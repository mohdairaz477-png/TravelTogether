
import type {
  User,
  Trip,
  Message,
  Match,
  Location,
  ConnectionRequest,
  AdminNotification,
  EmailNotification,
  WelcomeEmail,
} from "../../backend";

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
} from "../../backend";

// Keep existing services working while we migrate authentication.
export {
  db,
  locationService,
  adminService,
  connectionService,
  emailService,
  regions,
  locations,
} from "../../backend";

const API_URL = "http://localhost:5000";

export async function registerWithMongoDB(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
}

export async function loginWithMongoDB(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}
