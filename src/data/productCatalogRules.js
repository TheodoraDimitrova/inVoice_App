export const PRODUCT_KINDS = Object.freeze([
  { id: "product", label: "Продукт" },
  { id: "service", label: "Услуга" },
]);

export const PRODUCT_CATALOG_CATEGORIES = Object.freeze([
  {
    id: "goods",
    label: "Продукти",
    units: ["бр.", "к-т", "опак.", "кг", "т"],
    applications: ["Стоки", "Консумативи", "Хардуер"],
  },
  {
    id: "construction",
    label: "Строителство",
    units: ["м", "кв.м.", "куб.м.", "л.м."],
    applications: ["Материали", "Облицовки", "Монтаж"],
  },
  {
    id: "services",
    label: "Услуги",
    units: ["ч.", "р.д.", "усл.", "проект"],
    applications: ["Дизайн", "Софтуер", "Право", "Ремонт"],
  },
  {
    id: "logistics",
    label: "Логистика",
    units: ["км", "пал.", "курс", "т"],
    applications: ["Транспорт", "Куриерски услуги"],
  },
  {
    id: "subscription",
    label: "Абонамент",
    units: ["мес.", "год.", "трим."],
    applications: ["Наем", "SaaS"],
  },
]);

const CATEGORY_BY_ID = Object.fromEntries(
  PRODUCT_CATALOG_CATEGORIES.map((c) => [c.id, c]),
);

export function getCategoryById(id) {
  return CATEGORY_BY_ID[id] || PRODUCT_CATALOG_CATEGORIES[0];
}

export function normalizeCategoryId(raw) {
  const id = String(raw || "").trim();
  if (CATEGORY_BY_ID[id]) return id;
  return PRODUCT_CATALOG_CATEGORIES[0].id;
}

export function normalizeUnitForCategory(categoryId, unit) {
  const cat = getCategoryById(categoryId);
  const u = String(unit || "").trim();
  if (cat.units.includes(u)) return u;
  return cat.units[0];
}

export function normalizeApplicationForCategory(categoryId, application) {
  const cat = getCategoryById(categoryId);
  const a = String(application || "").trim();
  if (cat.applications.includes(a)) return a;
  return cat.applications[0];
}

export function kindLabel(kindId) {
  const k = PRODUCT_KINDS.find((x) => x.id === kindId);
  return k ? k.label : kindId;
}

export function normalizeStoredProduct(data, id) {
  const category = normalizeCategoryId(data?.category);
  return {
    id,
    name: data?.name || "",
    price: Number(data?.price) || 0,
    kind: data?.kind === "service" ? "service" : "product",
    category,
    application: normalizeApplicationForCategory(category, data?.application),
    unit: normalizeUnitForCategory(category, data?.unit),
    vat: Number.isFinite(Number(data?.vat)) ? Number(data.vat) : 20,
  };
}
