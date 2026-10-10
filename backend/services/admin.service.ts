// ============================================================
// BACKEND — Admin Service
// ============================================================
// Admin authentication check + the admin notification feed.
// ============================================================

import { ADMIN_CREDENTIALS, STORAGE_KEYS, MAX_NOTIFICATIONS } from '../config/app.config';
import type { AdminNotification } from '../models';

export const adminService = {
  // Admin credentials (PERMANENT - DO NOT CHANGE)
  ADMIN_EMAIL: ADMIN_CREDENTIALS.EMAIL,
  ADMIN_PASSWORD: ADMIN_CREDENTIALS.PASSWORD,

  // Notify admin when user logs in
  notifyLogin: (user: { name: string; email: string }) => {
    const notifications = adminService.getNotifications();
    notifications.unshift({
      id: 'notif_' + Date.now().toString(36),
      type: 'login',
      userId: user.email,
      userName: user.name,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
      message: `${user.name} (${user.email}) just logged in`,
      read: false,
    });
    // Keep only last 100 notifications
    if (notifications.length > MAX_NOTIFICATIONS) notifications.length = MAX_NOTIFICATIONS;
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Notify admin when user signs up
  notifySignup: (user: { name: string; email: string }) => {
    const notifications = adminService.getNotifications();
    notifications.unshift({
      id: 'notif_' + Date.now().toString(36),
      type: 'signup',
      userId: user.email,
      userName: user.name,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
      message: `🆕 New user registered: ${user.name} (${user.email})`,
      read: false,
    });
    if (notifications.length > MAX_NOTIFICATIONS) notifications.length = MAX_NOTIFICATIONS;
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Get all notifications
  getNotifications: (): AdminNotification[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  // Get unread count
  getUnreadCount: (): number => {
    return adminService.getNotifications().filter((n: AdminNotification) => !n.read).length;
  },

  // Mark all as read
  markAllRead: (): void => {
    const notifications = adminService.getNotifications();
    notifications.forEach((n: AdminNotification) => n.read = true);
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Mark single as read
  markRead: (id: string): void => {
    const notifications = adminService.getNotifications();
    const notif = notifications.find((n: AdminNotification) => n.id === id);
    if (notif) notif.read = true;
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Clear all
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS);
  },

  // Check if current user is admin
  isAdmin: (email: string): boolean => {
    return email.toLowerCase() === adminService.ADMIN_EMAIL.toLowerCase();
  },
};
