// ============================================================
// COMPATIBILITY SHIM
// ============================================================
// The real implementation now lives in:
//   backend/services/database.service.ts
//
// This file only re-exports it through the frontend API layer
// so existing component imports keep working unchanged.
// New code should import from `frontend/api` instead.
// ============================================================

export type { User, Trip, Message, Match } from '../../frontend/api';
export { db } from '../../frontend/api';
