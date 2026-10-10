// ============================================================
// BACKEND — Connection Service
// ============================================================
// Traveller-to-traveller connection requests:
// send / accept / reject / cancel + per-user notification feed.
// ============================================================

import { STORAGE_KEYS } from '../config/app.config';
import type { ConnectionRequest } from '../models';

export const connectionService = {
  // Send a connection request
  sendRequest: (
    fromUserId: string, fromUserName: string, fromUserAvatar: string,
    toUserId: string, toUserName: string, toUserAvatar: string,
    matchScore: number, message: string = ''
  ): ConnectionRequest => {
    const requests = connectionService.getRequests();

    // Check if already sent
    const existing = requests.find(r =>
      r.fromUserId === fromUserId && r.toUserId === toUserId && r.status === 'pending'
    );
    if (existing) return { ...existing, _duplicate: true } as any;

    const request: ConnectionRequest = {
      _id: 'conn_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      fromUserId, fromUserName, fromUserAvatar,
      toUserId, toUserName, toUserAvatar,
      matchScore, message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      respondedAt: null,
      responseMessage: null,
    };

    requests.unshift(request);
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(requests));

    // Add user-specific notifications
    const userNotifs = connectionService.getUserNotifications(toUserId);
    userNotifs.unshift({
      id: 'notif_' + Date.now().toString(36),
      type: 'connection_request',
      fromUserId, fromUserName, toUserId,
      connectionId: request._id,
      timestamp: new Date().toISOString(),
      message: `💌 ${fromUserName} sent you a connection request${matchScore > 0 ? ` (${matchScore}% match)` : ''}`,
      read: false,
    });
    localStorage.setItem(`tt_user_notifs_${toUserId}`, JSON.stringify(userNotifs));

    return request;
  },

  // Get all requests
  getRequests: (): ConnectionRequest[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    return stored ? JSON.parse(stored) : [];
  },

  // Get pending requests for a user (received)
  getReceivedRequests: (userId: string): ConnectionRequest[] => {
    return connectionService.getRequests().filter(r => r.toUserId === userId && r.status === 'pending');
  },

  // Get sent requests for a user
  getSentRequests: (userId: string): ConnectionRequest[] => {
    return connectionService.getRequests().filter(r => r.fromUserId === userId && r.status === 'pending');
  },

  // Get all connections for a user
  getConnections: (userId: string): ConnectionRequest[] => {
    return connectionService.getRequests().filter(r =>
      (r.fromUserId === userId || r.toUserId === userId) && r.status === 'accepted'
    );
  },

  // Accept a request
  acceptRequest: (requestId: string, responseMessage: string = ''): ConnectionRequest | null => {
    const requests = connectionService.getRequests();
    const idx = requests.findIndex(r => r._id === requestId);
    if (idx === -1 || requests[idx].status !== 'pending') return null;

    requests[idx].status = 'accepted';
    requests[idx].respondedAt = new Date().toISOString();
    requests[idx].responseMessage = responseMessage;
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(requests));

    // Notify the sender
    const request = requests[idx];
    const senderNotifs = connectionService.getUserNotifications(request.fromUserId);
    senderNotifs.unshift({
      id: 'notif_' + Date.now().toString(36),
      type: 'connection_accepted',
      fromUserId: request.toUserId,
      fromUserName: request.toUserName,
      toUserId: request.fromUserId,
      connectionId: requestId,
      timestamp: new Date().toISOString(),
      message: `✅ ${request.toUserName} accepted your connection request! 🎉`,
      read: false,
    });
    localStorage.setItem(`tt_user_notifs_${request.fromUserId}`, JSON.stringify(senderNotifs));

    return requests[idx];
  },

  // Reject a request
  rejectRequest: (requestId: string, responseMessage: string = ''): ConnectionRequest | null => {
    const requests = connectionService.getRequests();
    const idx = requests.findIndex(r => r._id === requestId);
    if (idx === -1 || requests[idx].status !== 'pending') return null;

    requests[idx].status = 'rejected';
    requests[idx].respondedAt = new Date().toISOString();
    requests[idx].responseMessage = responseMessage;
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(requests));

    // Notify the sender
    const request = requests[idx];
    const senderNotifs = connectionService.getUserNotifications(request.fromUserId);
    senderNotifs.unshift({
      id: 'notif_' + Date.now().toString(36),
      type: 'connection_rejected',
      fromUserId: request.toUserId,
      fromUserName: request.toUserName,
      toUserId: request.fromUserId,
      connectionId: requestId,
      timestamp: new Date().toISOString(),
      message: `❌ ${request.toUserName} declined your connection request`,
      read: false,
    });
    localStorage.setItem(`tt_user_notifs_${request.fromUserId}`, JSON.stringify(senderNotifs));

    return requests[idx];
  },

  // Cancel sent request
  cancelRequest: (requestId: string): boolean => {
    const requests = connectionService.getRequests();
    const idx = requests.findIndex(r => r._id === requestId && r.status === 'pending');
    if (idx === -1) return false;
    requests.splice(idx, 1);
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(requests));
    return true;
  },

  // Get user notifications
  getUserNotifications: (userId: string): any[] => {
    const stored = localStorage.getItem(`tt_user_notifs_${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  // Mark user notification as read
  markUserNotifRead: (userId: string, notifId: string): void => {
    const notifs = connectionService.getUserNotifications(userId);
    const notif = notifs.find((n: any) => n.id === notifId);
    if (notif) notif.read = true;
    localStorage.setItem(`tt_user_notifs_${userId}`, JSON.stringify(notifs));
  },

  // Mark all user notifications as read
  markAllUserNotifsRead: (userId: string): void => {
    const notifs = connectionService.getUserNotifications(userId);
    notifs.forEach((n: any) => n.read = true);
    localStorage.setItem(`tt_user_notifs_${userId}`, JSON.stringify(notifs));
  },

  // Get unread count for user
  getUnreadCount: (userId: string): number => {
    return connectionService.getUserNotifications(userId).filter((n: any) => !n.read).length;
  },

  // Get pending request count for user
  getPendingRequestCount: (userId: string): number => {
    return connectionService.getReceivedRequests(userId).length;
  },

  // Check if request already exists
  hasPendingRequest: (fromUserId: string, toUserId: string): boolean => {
    return connectionService.getRequests().some(r =>
      r.fromUserId === fromUserId && r.toUserId === toUserId && r.status === 'pending'
    );
  },

  // Check if already connected
  isConnected: (userId1: string, userId2: string): boolean => {
    return connectionService.getRequests().some(r =>
      ((r.fromUserId === userId1 && r.toUserId === userId2) ||
       (r.fromUserId === userId2 && r.toUserId === userId1)) &&
      r.status === 'accepted'
    );
  },

  // Get stats
  getStats: (userId: string) => ({
    sent: connectionService.getSentRequests(userId).length,
    received: connectionService.getReceivedRequests(userId).length,
    connections: connectionService.getConnections(userId).length,
    pending: connectionService.getRequests().filter(r => r.status === 'pending').length,
  }),
};
