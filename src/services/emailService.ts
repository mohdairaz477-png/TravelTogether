// ============================================================
// COMPATIBILITY SHIM
// ============================================================
// The real implementation now lives in:
//   backend/services/email.service.ts
//
// New code should import from `frontend/api` instead.
// ============================================================

export type { EmailNotification, WelcomeEmail } from '../../frontend/api';
export { emailService } from '../../frontend/api';
