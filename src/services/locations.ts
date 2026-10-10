// ============================================================
// COMPATIBILITY SHIM
// ============================================================
// The real implementations now live in:
//   backend/data/locations.data.ts
//   backend/services/location.service.ts
//   backend/services/admin.service.ts
//
// New code should import from `frontend/api` instead.
// ============================================================

export type { Location, AdminNotification } from '../../frontend/api';
export { regions, locations, locationService, adminService } from '../../frontend/api';
