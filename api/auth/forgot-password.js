const admin = require("firebase-admin");
const { Resend } = require("resend");

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT_PER_WINDOW = 5;
const rateLimitStore = new Map();

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function createRateLimitKey(req, email) {
  return `${getClientIp(req)}:${email.toLowerCase()}`;
}

function isRateLimited(key) {
  const now = Date.now();
  const found = rateLimitStore.get(key);
  if (!found || now - found.startedAt > WINDOW_MS) {
    rateLimitStore.set(key, { startedAt: now, count: 1 });
    return false;
  }
  if (found.count >= LIMIT_PER_WINDOW) {
    return true;
  }
  found.count += 1;
  rateLimitStore.set(key, found);
  return false;
}

function getEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`missing_env:${name}`);
  }
  return value.trim();
}

function initFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();

  const privateKey = getEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n");
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: getEnv("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: getEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey,
    }),
  });
}

function getPasswordResetActionSettings() {
  const appOrigin = process.env.AUTH_APP_ORIGIN || process.env.APP_ORIGIN;
  const safeOrigin = (appOrigin || "").trim() || "http://localhost:3000";
  return {
    url: `${safeOrigin}/auth`,
    handleCodeInApp: false,
  };
}

function buildTemplate(resetLink) {
  return `
<div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;max-width:560px;margin:0 auto;">
  <h2 style="margin:0 0 16px;">Възстановяване на парола</h2>
  <p style="margin:0 0 16px;">
    Получихме заявка за смяна на паролата за вашия профил в Invoicer.
  </p>
  <p style="margin:0 0 20px;">
    Натиснете бутона по-долу, за да създадете нова парола:
  </p>
  <p style="margin:0 0 24px;">
    <a href="${resetLink}" style="background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;display:inline-block;">
      Смени паролата
    </a>
  </p>
  <p style="margin:0 0 8px;color:#475569;font-size:14px;">
    Ако не сте поискали смяна на парола, игнорирайте този имейл.
  </p>
</div>
  `.trim();
}

async function sendResetEmail({ email, resetLink }) {
  const resend = new Resend(getEnv("RESEND_API_KEY"));
  const from = process.env.AUTH_EMAIL_FROM || "Invoicer <no-reply@invoicerapp.com>";

  await resend.emails.send({
    from,
    to: email,
    subject: "Възстановяване на парола - Invoicer",
    html: buildTemplate(resetLink),
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const email = String(req.body?.email || "").trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isEmailValid) {
    return res.status(400).json({ ok: false });
  }

  const rateKey = createRateLimitKey(req, email);
  if (isRateLimited(rateKey)) {
    return res.status(429).json({ ok: true });
  }

  try {
    initFirebaseAdmin();
    const resetLink = await admin
      .auth()
      .generatePasswordResetLink(email, getPasswordResetActionSettings());
    await sendResetEmail({ email, resetLink });
    return res.status(200).json({ ok: true });
  } catch (error) {
    // Keep response generic to avoid account enumeration.
    if (error?.code === "auth/user-not-found") {
      return res.status(200).json({ ok: true });
    }
    if (String(error?.message || "").startsWith("missing_env:")) {
      return res.status(500).json({ ok: false, reason: "server_not_configured" });
    }
    return res.status(200).json({ ok: true });
  }
};
