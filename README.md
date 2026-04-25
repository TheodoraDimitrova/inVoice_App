## Invoicer

An online invoicing software that helps you craft and print professional invoices for your customers for free! Keep your business and clients with one invoicing software.

Create a file named .env.local in the root directory of the project and place your Firebase keys inside. Here's an example content of the .env.local file:
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

### Custom password reset emails (professional setup)

The app includes a backend endpoint at `api/auth/forgot-password` that generates Firebase reset links and sends custom emails via Resend.

Add these server environment variables in your hosting provider (for example Vercel):

FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_service_account_private_key_with_escaped_newlines
RESEND_API_KEY=your_resend_api_key
AUTH_EMAIL_FROM="Invoicer <no-reply@your-domain.com>"
AUTH_APP_ORIGIN=https://your-app-domain.com

Notes:
- `FIREBASE_ADMIN_PRIVATE_KEY` must preserve `\n` characters.
- Verify your sending domain in Resend and configure DNS records (SPF, DKIM, DMARC).
- Keep Firebase email/password provider enabled.

### Tools Used:

- React.js
- Firebase
- React-to-print
- Tailwind CSS
- Material UI
- React Hook Form
- React Toastify
- Redux Toolkit

- Start the development `npm start`
