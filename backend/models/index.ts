// ============================================================
// BACKEND — Data Models (Schemas)
// ============================================================
// These interfaces mirror what would be Mongoose schemas
// in a real MongoDB backend.
// ============================================================

/** User model — like mongoose.Schema('User') */
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  travelStyle: string[];
  budget: 'low' | 'medium' | 'high' | 'luxury';
  pace: 'relaxed' | 'moderate' | 'fast';
  verified: boolean;
  rating: number;
  tripCount: number;
  joinedAt: string;
  plan: 'free' | 'voyager' | 'nomad';
}

/** Trip model — like mongoose.Schema('Trip') */
export interface Trip {
  _id: string;
  title: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetPerPerson: number;
  maxGroupSize: number;
  currentGroupSize: number;
  description: string;
  activities: string[];
  creatorId: string;
  members: string[];
  status: 'planning' | 'confirmed' | 'ongoing' | 'completed';
  createdAt: string;
  emoji: string;
  gradient: string;
}

/** Message model — like mongoose.Schema('Message') */
export interface Message {
  _id: string;
  tripId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

/** Match result — output of the matching aggregation pipeline */
export interface Match {
  userId: string;
  userName: string;
  userAvatar: string;
  userLocation: string;
  matchScore: number;
  sharedInterests: string[];
  travelStyle: string[];
  rating: number;
  tripCount: number;
  bio: string;
}

/** Location model — travel destination */
export interface Location {
  id: string;
  name: string;
  country: string;
  region: string;
  emoji: string;
  popularity: number;
  avgCostINR: string;
  bestSeason: string;
  description: string;
  tags: string[];
  isIndian: boolean;
  coords: { lat: number; lng: number };
}

/** Connection request between two travellers */
export interface ConnectionRequest {
  _id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  matchScore: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt: string | null;
  responseMessage: string | null;
}

/** Admin notification entry */
export interface AdminNotification {
  id: string;
  type: 'login' | 'signup' | 'trip_created' | 'trip_joined' | 'message_sent';
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  message: string;
  read: boolean;
}

/** Payload for an admin alert email */
export interface EmailNotification {
  type: 'login' | 'signup' | 'trip_created' | 'trip_joined';
  userName: string;
  userEmail: string;
  message: string;
  timestamp: string;
}

/** Payload for a welcome email sent to the user */
export interface WelcomeEmail {
  userName: string;
  userEmail: string;
  type: 'welcome_login' | 'welcome_signup';
  timestamp: string;
}
