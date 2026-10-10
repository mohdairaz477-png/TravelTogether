// Utility helpers for TravelTogether

// Generate a unique ID
export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}

// Temporary client-side hash for the existing localStorage implementation.
// Real password hashing will be handled by bcrypt on the backend.
export function hashPassword(password: string): string {
  let hash = 0;

  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(16);
}