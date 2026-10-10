// ============================================================
// COMPATIBILITY SHIM
// ============================================================
// The real implementation now lives in:
//   backend/services/connection.service.ts
//
// New code should import from `frontend/api` instead.
// ============================================================

export type { ConnectionRequest } from '../../frontend/api';
export { connectionService } from '../../frontend/api';
