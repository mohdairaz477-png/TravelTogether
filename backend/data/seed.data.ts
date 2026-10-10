// ============================================================
// BACKEND — Seed Data
// ============================================================
// Initial database records inserted on first run.
// ============================================================

import type { User, Trip, Message } from '../models';
import { hashPassword } from '../utils/helpers';

export function getSeedUsers(): User[] {
  return [
    {
      _id: 'user_1', name: 'Elena Rodriguez', email: 'elena@example.com',
      password: hashPassword('password123'), avatar: 'from-violet-400 to-violet-600',
      age: 29, location: 'Barcelona, Spain', bio: 'Adventure seeker & foodie. Love exploring hidden gems and local cuisine.',
      interests: ['food', 'culture', 'hiking', 'photography'], travelStyle: ['slow', 'budget-friendly'],
      budget: 'medium', pace: 'moderate', verified: true, rating: 4.9, tripCount: 28,
      joinedAt: '2024-01-15', plan: 'voyager'
    },
    {
      _id: 'user_2', name: 'Marcus Chen', email: 'marcus@example.com',
      password: hashPassword('password123'), avatar: 'from-sky-400 to-sky-600',
      age: 34, location: 'San Francisco, USA', bio: 'Digital nomad who loves surfing and mountain trails.',
      interests: ['surfing', 'hiking', 'tech', 'camping'], travelStyle: ['adventure', 'flexible'],
      budget: 'medium', pace: 'fast', verified: true, rating: 4.8, tripCount: 41,
      joinedAt: '2023-11-20', plan: 'nomad'
    },
    {
      _id: 'user_3', name: 'Priya Patel', email: 'priya@example.com',
      password: hashPassword('password123'), avatar: 'from-amber-400 to-amber-600',
      age: 27, location: 'Mumbai, India', bio: 'Travel photographer chasing sunsets and stories.',
      interests: ['photography', 'art', 'street-food', 'festivals'], travelStyle: ['creative', 'cultural'],
      budget: 'low', pace: 'relaxed', verified: true, rating: 4.7, tripCount: 15,
      joinedAt: '2024-03-10', plan: 'voyager'
    },
    {
      _id: 'user_4', name: 'David Müller', email: 'david@example.com',
      password: hashPassword('password123'), avatar: 'from-emerald-400 to-emerald-600',
      age: 31, location: 'Berlin, Germany', bio: 'Remote developer seeking co-working adventures.',
      interests: ['coding', 'coffee', 'cycling', 'museums'], travelStyle: ['digital-nomad', 'urban'],
      budget: 'high', pace: 'moderate', verified: true, rating: 4.9, tripCount: 19,
      joinedAt: '2024-02-05', plan: 'nomad'
    },
    {
      _id: 'user_5', name: 'Yuki Tanaka', email: 'yuki@example.com',
      password: hashPassword('password123'), avatar: 'from-cyan-400 to-cyan-600',
      age: 26, location: 'Tokyo, Japan', bio: 'Cultural explorer and tea enthusiast.',
      interests: ['culture', 'tea', 'temples', 'language'], travelStyle: ['cultural', 'immersive'],
      budget: 'medium', pace: 'relaxed', verified: false, rating: 4.6, tripCount: 8,
      joinedAt: '2024-05-18', plan: 'free'
    },
    // Admin User (PERMANENT - DO NOT REMOVE)
    {
      _id: 'admin_001', name: 'Mohd Airaz', email: 'mohdairaz477@gmail.com',
      password: hashPassword('admin@8520'), avatar: 'from-amber-500 to-orange-600',
      age: 25, location: 'India', bio: 'Platform Administrator & Developer.',
      interests: ['tech', 'travel', 'coding'], travelStyle: ['digital-nomad'],
      budget: 'high', pace: 'moderate', verified: true, rating: 5.0, tripCount: 0,
      joinedAt: '2024-01-01', plan: 'nomad'
    },
  ];
}

export function getSeedTrips(): Trip[] {
  return [
    {
      _id: 'trip_1', title: 'Bali Adventure Retreat', destination: 'Bali', country: 'Indonesia',
      startDate: '2026-03-15', endDate: '2026-03-25', budget: 1500, budgetPerPerson: 1500,
      maxGroupSize: 8, currentGroupSize: 5, description: '10 days of rice terraces, temple visits, surf lessons, and beach sunsets.',
      activities: ['surfing', 'temple-visits', 'rice-terrace-hike', 'beach-yoga', 'cooking-class'],
      creatorId: 'user_1', members: ['user_1', 'user_2', 'user_3', 'user_4', 'user_5'],
      status: 'confirmed', createdAt: '2026-01-10', emoji: '🌴', gradient: 'from-brand-600 to-brand-400'
    },
    {
      _id: 'trip_2', title: 'Swiss Alps Trek', destination: 'Swiss Alps', country: 'Switzerland',
      startDate: '2026-04-02', endDate: '2026-04-10', budget: 2800, budgetPerPerson: 2800,
      maxGroupSize: 6, currentGroupSize: 3, description: 'Epic mountain trekking through the most scenic trails in the Alps.',
      activities: ['hiking', 'mountain-climbing', 'photography', 'camping'],
      creatorId: 'user_2', members: ['user_2', 'user_4', 'user_5'],
      status: 'planning', createdAt: '2026-01-20', emoji: '🏔️', gradient: 'from-accent-500 to-warm-500'
    },
    {
      _id: 'trip_3', title: 'Tokyo Cherry Blossom', destination: 'Tokyo', country: 'Japan',
      startDate: '2026-05-05', endDate: '2026-05-14', budget: 2200, budgetPerPerson: 2200,
      maxGroupSize: 10, currentGroupSize: 7, description: 'Experience Japan during cherry blossom season with local guides.',
      activities: ['cherry-blossom', 'temple-visits', 'street-food', 'tea-ceremony', 'anime-tour'],
      creatorId: 'user_5', members: ['user_5', 'user_1', 'user_3'],
      status: 'planning', createdAt: '2026-02-01', emoji: '🌸', gradient: 'from-coral-500 to-coral-400'
    },
    {
      _id: 'trip_4', title: 'Patagonia Expedition', destination: 'Patagonia', country: 'Argentina',
      startDate: '2026-06-10', endDate: '2026-06-22', budget: 3500, budgetPerPerson: 3500,
      maxGroupSize: 5, currentGroupSize: 2, description: 'Wild expedition through glaciers, mountains, and untouched wilderness.',
      activities: ['hiking', 'glacier-walk', 'wildlife', 'photography', 'kayaking'],
      creatorId: 'user_3', members: ['user_3', 'user_1'],
      status: 'planning', createdAt: '2026-02-15', emoji: '🦅', gradient: 'from-emerald-500 to-emerald-700'
    },
    {
      _id: 'trip_5', title: 'Mediterranean Cruise', destination: 'Mediterranean', country: 'Italy',
      startDate: '2026-07-01', endDate: '2026-07-12', budget: 4000, budgetPerPerson: 4000,
      maxGroupSize: 12, currentGroupSize: 8, description: 'Luxury cruise through the most beautiful Mediterranean ports.',
      activities: ['cruise', 'wine-tasting', 'beach', 'history', 'cooking-class'],
      creatorId: 'user_4', members: ['user_4', 'user_1', 'user_2', 'user_5'],
      status: 'confirmed', createdAt: '2026-02-20', emoji: '🚢', gradient: 'from-violet-500 to-violet-700'
    },
    {
      _id: 'trip_6', title: 'Portugal Digital Nomad Stay', destination: 'Lisbon', country: 'Portugal',
      startDate: '2026-08-01', endDate: '2026-08-30', budget: 2000, budgetPerPerson: 2000,
      maxGroupSize: 15, currentGroupSize: 9, description: 'Month-long co-working and exploring adventure in beautiful Portugal.',
      activities: ['co-working', 'surfing', 'food-tour', 'city-exploring', 'sunset-viewing'],
      creatorId: 'user_4', members: ['user_4', 'user_2'],
      status: 'planning', createdAt: '2026-03-01', emoji: '🇵🇹', gradient: 'from-sky-500 to-sky-700'
    },
  ];
}

export function getSeedMessages(): Message[] {
  return [
    { _id: 'msg_1', tripId: 'trip_1', userId: 'user_1', userName: 'Elena R.', userAvatar: 'from-violet-400 to-violet-600', content: 'Hey everyone! So excited for our Bali trip! 🌴', timestamp: '2026-02-28T10:00:00Z' },
    { _id: 'msg_2', tripId: 'trip_1', userId: 'user_2', userName: 'Marcus C.', userAvatar: 'from-sky-400 to-sky-600', content: 'Me too! I\'ve been researching surf spots. Should I share?', timestamp: '2026-02-28T10:15:00Z' },
    { _id: 'msg_3', tripId: 'trip_1', userId: 'user_3', userName: 'Priya P.', userAvatar: 'from-amber-400 to-amber-600', content: 'Yes please! Also, any temple recommendations for photography?', timestamp: '2026-02-28T10:30:00Z' },
    { _id: 'msg_4', tripId: 'trip_1', userId: 'user_5', userName: 'Yuki T.', userAvatar: 'from-cyan-400 to-cyan-600', content: 'I\'ve booked a cooking class for us! Traditional Balinese cuisine 🍜', timestamp: '2026-02-28T11:00:00Z' },
    { _id: 'msg_5', tripId: 'trip_1', userId: 'user_4', userName: 'David M.', userAvatar: 'from-emerald-400 to-emerald-600', content: 'Great! I found some amazing co-working spaces in Canggu too.', timestamp: '2026-02-28T11:30:00Z' },
  ];
}
