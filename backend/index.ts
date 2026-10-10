// ============================================================
// BACKEND — Public Entry Point
// ============================================================
// Everything the frontend is allowed to consume is exported here.
// The frontend must NEVER import from backend internals directly —
// it goes through `frontend/api` which wraps this barrel.
// ============================================================

// ---- Models / Types ----
export type {
  User,
  Trip,
  Message,
  Match,
  Location,
  ConnectionRequest,
  AdminNotification,
  EmailNotification,
  WelcomeEmail,
} from './models';

// ---- Configuration ----
export {
  EMAIL_DEFAULT_CONFIG,
  ADMIN_CREDENTIALS,
  SITE_CONFIG,
  STORAGE_KEYS,
} from './config/app.config';

// ---- Reference Data ----
export { regions, locations } from './data/locations.data';

// ---- Services ----
export { db } from './services/database.service';
export { locationService } from './services/location.service';
export { adminService } from './services/admin.service';
export { connectionService } from './services/connection.service';
export { emailService } from './services/email.service';
