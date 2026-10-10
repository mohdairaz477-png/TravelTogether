// ============================================================
// BACKEND — Database Service (MongoDB-style data access layer)
// ============================================================
// Replace with real MongoDB/Mongoose in production:
// - Install: mongoose, bcrypt, jsonwebtoken
// - Connect: mongoose.connect(process.env.MONGO_URI)
// - Define schemas with mongoose.Schema
// - Create Express routes for CRUD operations
// ============================================================

import { STORAGE_KEYS, MAX_NOTIFICATIONS } from '../config/app.config';
import type { User, Trip, Message, Match } from '../models';
import { generateId, hashPassword } from '../utils/helpers';
import { getSeedUsers, getSeedTrips, getSeedMessages } from '../data/seed.data';
import { emailService } from './email.service';
import { adminService } from './admin.service';

// Re-export the models so consumers can import types alongside `db`
export type { User, Trip, Message, Match } from '../models';

// In-memory "collections" (replaces MongoDB collections)
let users: User[] = [];
let trips: Trip[] = [];
let messages: Message[] = [];
let currentUser: User | null = null;

// Seed initial data
function seedData() {
  const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  const storedTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
  const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

  if (storedUsers) users = JSON.parse(storedUsers);
  if (storedTrips) trips = JSON.parse(storedTrips);
  if (storedMessages) messages = JSON.parse(storedMessages);
  if (storedCurrentUser) currentUser = JSON.parse(storedCurrentUser);

  if (users.length === 0) {
    users = getSeedUsers();
    trips = getSeedTrips();
    messages = getSeedMessages();
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  if (currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
}

// User Operations (mimics MongoDB User model operations)
export const db = {
  // Connect / Initialize (like mongoose.connect)
  init: () => {
    seedData();
    console.log('[MongoDB] Connected to TravelTogether Database');
  },

  // ===== USER OPERATIONS =====
  // Like: await User.create({...})
  userCreate: (data: Omit<User, '_id' | 'verified' | 'rating' | 'tripCount' | 'joinedAt'>): User => {
    const user: User = {
      ...data,
      _id: 'user_' + generateId(),
      verified: false,
      rating: 0,
      tripCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    user.password = hashPassword(data.password);
    users.push(user);
    saveToStorage();
    // Notify admin about new signup
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS) || '[]');
    notifs.unshift({ id: 'notif_' + Date.now().toString(36), type: 'signup', userId: user.email, userName: user.name, userEmail: user.email, timestamp: new Date().toISOString(), message: `🆕 New user registered: ${user.name} (${user.email})`, read: false });
    if (notifs.length > MAX_NOTIFICATIONS) notifs.length = MAX_NOTIFICATIONS;
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifs));
    return user;
  },

  // Like: await User.findOne({ email })
  userFindByEmail: (email: string): User | undefined => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // Like: await User.findById(id)
  userFindById: (id: string): User | undefined => {
    return users.find(u => u._id === id);
  },

  // Like: await User.find().sort({ rating: -1 }).limit(10)
  userFindTopRated: (limit = 10): User[] => {
    return [...users].filter(u => u.verified).sort((a, b) => b.rating - a.rating).slice(0, limit);
  },

  // Like: await User.findByIdAndUpdate(id, { $set: updates })
  userUpdate: (id: string, updates: Partial<User>): User | undefined => {
    const idx = users.findIndex(u => u._id === id);
    if (idx === -1) return undefined;
    users[idx] = { ...users[idx], ...updates };
    saveToStorage();
    if (currentUser?._id === id) currentUser = users[idx];
    return users[idx];
  },

  // Like: await User.deleteOne({ _id })
  userDelete: (id: string): boolean => {
    const idx = users.findIndex(u => u._id === id);
    if (idx === -1) return false;
    users.splice(idx, 1);
    saveToStorage();
    return true;
  },

  // ===== AUTH OPERATIONS =====
  // Like: JWT authentication middleware
  authLogin: async (email: string, password: string): Promise<{ user: User; token: string } | { error: string }> => {
    const user = db.userFindByEmail(email);
    if (!user) return { error: 'No account found with this email' };
    if (user.password !== hashPassword(password)) return { error: 'Incorrect password' };
    currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    // Skip notifications for admin login
    const isAdmin = adminService.isAdmin(user.email);

    if (!isAdmin) {
      // Notify admin about login
      const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS) || '[]');
      notifs.unshift({ id: 'notif_' + Date.now().toString(36), type: 'login', userId: user._id, userName: user.name, userEmail: user.email, timestamp: new Date().toISOString(), message: `🔔 ${user.name} (${user.email}) just logged in`, read: false });
      if (notifs.length > MAX_NOTIFICATIONS) notifs.length = MAX_NOTIFICATIONS;
      localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifs));

      // Send email to admin
      emailService.sendNotification({
        type: 'login',
        userName: user.name,
        userEmail: user.email,
        message: `User ${user.name} (${user.email}) logged into TravelTogether at ${new Date().toLocaleString('en-IN')}`,
        timestamp: new Date().toISOString(),
      }).catch(err => console.error('[Email] Login notification failed:', err));

      // Send welcome email TO the user's own email
      emailService.sendWelcomeEmail({
        userName: user.name,
        userEmail: user.email,
        type: 'welcome_login',
        timestamp: new Date().toISOString(),
      }).catch(err => console.error('[Welcome Email] Failed:', err));
    }

    return { user, token: 'jwt_' + generateId() };
  },

  authLogout: () => {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  authGetCurrentUser: (): User | null => {
    return currentUser;
  },

  // ===== TRIP OPERATIONS =====
  // Like: await Trip.find().populate('creator')
  tripFindAll: (): Trip[] => {
    return trips;
  },

  // Like: await Trip.find({ status: 'planning' })
  tripFindByStatus: (status: Trip['status']): Trip[] => {
    return trips.filter(t => t.status === status);
  },

  // Like: await Trip.findById(id)
  tripFindById: (id: string): Trip | undefined => {
    return trips.find(t => t._id === id);
  },

  // Like: await Trip.find({ destination: /bali/i })
  tripSearch: (query: string): Trip[] => {
    const q = query.toLowerCase();
    return trips.filter(t =>
      t.destination.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.activities.some(a => a.toLowerCase().includes(q))
    );
  },

  // Like: await Trip.create({...})
  tripCreate: (data: Omit<Trip, '_id' | 'members' | 'currentGroupSize' | 'createdAt' | 'creatorId'>, creatorId: string): Trip => {
    const trip: Trip = {
      ...data,
      _id: 'trip_' + generateId(),
      creatorId,
      members: [creatorId],
      currentGroupSize: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    trips.push(trip);
    saveToStorage();
    return trip;
  },

  // Like: await Trip.findByIdAndUpdate(id, { $push: { members }, $inc: { currentGroupSize: 1 } })
  tripJoin: (tripId: string, userId: string): Trip | { error: string } => {
    const trip = trips.find(t => t._id === tripId);
    if (!trip) return { error: 'Trip not found' };
    if (trip.members.includes(userId)) return { error: 'Already a member' };
    if (trip.currentGroupSize >= trip.maxGroupSize) return { error: 'Trip is full' };
    trip.members.push(userId);
    trip.currentGroupSize++;
    saveToStorage();
    return trip;
  },

  tripLeave: (tripId: string, userId: string): Trip | { error: string } => {
    const trip = trips.find(t => t._id === tripId);
    if (!trip) return { error: 'Trip not found' };
    const memberIdx = trip.members.indexOf(userId);
    if (memberIdx === -1) return { error: 'Not a member' };
    trip.members.splice(memberIdx, 1);
    trip.currentGroupSize--;
    saveToStorage();
    return trip;
  },

  // ===== MATCHING OPERATIONS =====
  // Like: Complex aggregation pipeline for matching
  matchFind: (userId: string): Match[] => {
    const user = db.userFindById(userId);
    if (!user) return [];

    return users
      .filter(u => u._id !== userId)
      .map(otherUser => {
        // Calculate match score based on shared interests, travel style, budget, pace
        let score = 0;
        const sharedInterests = user.interests.filter(i => otherUser.interests.includes(i));
        score += sharedInterests.length * 15;

        const sharedStyles = user.travelStyle.filter(s => otherUser.travelStyle.includes(s));
        score += sharedStyles.length * 20;

        if (user.budget === otherUser.budget) score += 15;
        if (user.pace === otherUser.pace) score += 10;
        if (otherUser.verified) score += 10;

        // Add some randomness for demo purposes
        score += Math.random() * 15;

        return {
          userId: otherUser._id,
          userName: otherUser.name,
          userAvatar: otherUser.avatar,
          userLocation: otherUser.location,
          matchScore: Math.min(Math.round(score), 99),
          sharedInterests,
          travelStyle: sharedStyles,
          rating: otherUser.rating,
          tripCount: otherUser.tripCount,
          bio: otherUser.bio,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  // ===== MESSAGING OPERATIONS =====
  // Like: await Message.find({ tripId }).sort({ timestamp: 1 })
  messageFindByTrip: (tripId: string): Message[] => {
    return messages
      .filter(m => m.tripId === tripId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  // Like: await Message.create({...})
  messageCreate: (data: Omit<Message, '_id' | 'timestamp'>): Message => {
    const msg: Message = {
      ...data,
      _id: 'msg_' + generateId(),
      timestamp: new Date().toISOString(),
    };
    messages.push(msg);
    saveToStorage();
    return msg;
  },

  // ===== STATS =====
  statsGet: () => ({
    totalUsers: users.length,
    totalTrips: trips.length,
    totalMessages: messages.length,
    activeTrips: trips.filter(t => t.status === 'confirmed' || t.status === 'ongoing').length,
    planningTrips: trips.filter(t => t.status === 'planning').length,
  }),
};
