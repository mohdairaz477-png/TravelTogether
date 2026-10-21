
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

const API_URL = (import.meta.env.VITE_API_URL || "https://traveltogether-api-xjl2.onrender.com").replace(/\/$/, "");

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

// Authenticated MongoDB-backed connection/admin API.
async function authenticatedRequest(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Please sign in again to continue.');
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result;
}

export const mongoUserApi = {
  searchByName: (query: string) => authenticatedRequest(`/api/users/search?q=${encodeURIComponent(query)}`),
  searchById: (id: string) => authenticatedRequest(`/api/users/search?q=${encodeURIComponent(id)}`),
};

export const mongoConnectionApi = {
  list: () => authenticatedRequest('/api/connections'),
  send: (payload: { toUserId: string; message?: string; matchScore?: number }) =>
    authenticatedRequest('/api/connections', { method: 'POST', body: JSON.stringify(payload) }),
  respond: (id: string, action: 'accepted' | 'rejected', responseMessage = '') =>
    authenticatedRequest(`/api/connections/${encodeURIComponent(id)}/respond`, { method: 'PATCH', body: JSON.stringify({ action, responseMessage }) }),
  cancel: (id: string) => authenticatedRequest(`/api/connections/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};


export const mongoDirectMessageApi = {
  list: (userId: string) => authenticatedRequest(`/api/messages/direct/${encodeURIComponent(userId)}`),
  send: (userId: string, content: string) => authenticatedRequest(`/api/messages/direct/${encodeURIComponent(userId)}`, { method: 'POST', body: JSON.stringify({ content }) }),
};

export const mongoAdminApi = {
  users: () => authenticatedRequest('/api/admin/users'),
  notifications: () => authenticatedRequest('/api/admin/notifications'),
  markAllRead: () => authenticatedRequest('/api/admin/notifications/read-all', { method: 'PATCH', body: JSON.stringify({}) }),
    clearAllNotifications: () => authenticatedRequest('/api/admin/notifications', { method: 'DELETE' }),
};
