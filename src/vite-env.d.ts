/// <reference types="vite/client" />

// ============================================================
// Type definitions for environment variables
// ============================================================
// Gives autocomplete + type-safety for import.meta.env.*
// Values are defined in the .env file at the project root.
// ============================================================

interface ImportMetaEnv {
  /** EmailJS public key — from emailjs.com → Account → API Keys */
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  /** EmailJS service ID — from emailjs.com → Email Services */
  readonly VITE_EMAILJS_SERVICE_ID: string;
  /** EmailJS template ID — from emailjs.com → Email Templates */
  readonly VITE_EMAILJS_TEMPLATE_ID: string;

  /** Email address that receives all admin notifications */
  readonly VITE_ADMIN_EMAIL: string;
  /** Password required to access the Admin Panel */
  readonly VITE_ADMIN_PASSWORD: string;

  /** Display name of the site */
  readonly VITE_SITE_NAME: string;
  /** Public URL of the deployed site */
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
