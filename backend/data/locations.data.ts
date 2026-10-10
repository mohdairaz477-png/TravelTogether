// ============================================================
// BACKEND — Locations Dataset
// ============================================================
// Static reference data for travel destinations.
// 10 Indian destinations + 10 international destinations.
// ============================================================

import type { Location } from '../models';

export const regions = [
  { id: 'all', name: 'All', emoji: '🌍' },
  { id: 'india', name: 'In India', emoji: '🇮🇳' },
  { id: 'asia', name: 'Asia', emoji: '🌏' },
  { id: 'europe', name: 'Europe', emoji: '🇪🇺' },
  { id: 'americas', name: 'Americas', emoji: '🌎' },
  { id: 'africa', name: 'Africa', emoji: '🌍' },
  { id: 'oceania', name: 'Oceania', emoji: '🏝️' },
  { id: 'middle-east', name: 'Middle East', emoji: '🕌' },
];

export const locations: Location[] = [
  // 🇮🇳 INDIAN LOCATIONS
  { id: 'loc_india_1', name: 'Goa', country: 'India', region: 'india', emoji: '🏖️', popularity: 96, avgCostINR: '₹15K-25K', bestSeason: 'Nov-Feb', description: 'Stunning beaches, vibrant nightlife, Portuguese heritage, and incredible seafood.', tags: ['beach', 'nightlife', 'food', 'water-sports', 'heritage'], isIndian: true, coords: { lat: 15.30, lng: 73.91 } },
  { id: 'loc_india_2', name: 'Manali', country: 'India', region: 'india', emoji: '🏔️', popularity: 92, avgCostINR: '₹12K-20K', bestSeason: 'Mar-Jun', description: 'Snow-capped mountains, adventure sports, and serene valleys in the Himalayas.', tags: ['mountains', 'adventure', 'snow', 'hiking', 'photography'], isIndian: true, coords: { lat: 32.24, lng: 77.19 } },
  { id: 'loc_india_3', name: 'Kerala', country: 'India', region: 'india', emoji: '🌴', popularity: 94, avgCostINR: '₹18K-30K', bestSeason: 'Sep-Mar', description: "God's Own Country — backwaters, houseboats, tea gardens, and Ayurvedic retreats.", tags: ['backwaters', 'nature', 'ayurveda', 'food', 'relaxation'], isIndian: true, coords: { lat: 10.16, lng: 76.64 } },
  { id: 'loc_india_4', name: 'Ladakh', country: 'India', region: 'india', emoji: '🏍️', popularity: 90, avgCostINR: '₹20K-35K', bestSeason: 'Jun-Sep', description: 'High-altitude desert, monasteries, Pangong Lake, and the ultimate road trip destination.', tags: ['adventure', 'mountains', 'road-trip', 'monasteries', 'photography'], isIndian: true, coords: { lat: 34.15, lng: 77.58 } },
  { id: 'loc_india_5', name: 'Jaipur', country: 'India', region: 'india', emoji: '🕌', popularity: 88, avgCostINR: '₹10K-18K', bestSeason: 'Oct-Mar', description: 'The Pink City — majestic palaces, vibrant bazaars, and Rajasthani royal heritage.', tags: ['heritage', 'palaces', 'shopping', 'food', 'culture'], isIndian: true, coords: { lat: 26.92, lng: 75.79 } },
  { id: 'loc_india_6', name: 'Rishikesh', country: 'India', region: 'india', emoji: '🧘', popularity: 87, avgCostINR: '₹8K-15K', bestSeason: 'Mar-May', description: 'Yoga capital of the world, Ganges rafting, Beatles Ashram, and spiritual awakening.', tags: ['yoga', 'rafting', 'spiritual', 'adventure', 'nature'], isIndian: true, coords: { lat: 30.09, lng: 78.27 } },
  { id: 'loc_india_7', name: 'Andaman Islands', country: 'India', region: 'india', emoji: '🏝️', popularity: 89, avgCostINR: '₹25K-40K', bestSeason: 'Oct-May', description: 'Crystal-clear waters, coral reefs, Radhanagar Beach, and untouched tropical paradise.', tags: ['beach', 'diving', 'snorkeling', 'island', 'relaxation'], isIndian: true, coords: { lat: 11.62, lng: 92.73 } },
  { id: 'loc_india_8', name: 'Mysore', country: 'India', region: 'india', emoji: '🐘', popularity: 82, avgCostINR: '₹8K-15K', bestSeason: 'Oct-Feb', description: 'Royal heritage, magnificent palace, sandalwood city, and authentic South Indian culture.', tags: ['heritage', 'palace', 'culture', 'food', 'yoga'], isIndian: true, coords: { lat: 12.30, lng: 76.66 } },
  { id: 'loc_india_9', name: 'Darjeeling', country: 'India', region: 'india', emoji: '🍵', popularity: 85, avgCostINR: '₹10K-18K', bestSeason: 'Apr-Jun', description: 'Queen of Hills — world-famous tea, toy train, Kanchenjunga views, and colonial charm.', tags: ['tea', 'mountains', 'toy-train', 'nature', 'photography'], isIndian: true, coords: { lat: 27.04, lng: 88.26 } },
  { id: 'loc_india_10', name: 'Varanasi', country: 'India', region: 'india', emoji: '🕉️', popularity: 83, avgCostINR: '₹6K-12K', bestSeason: 'Oct-Mar', description: "Ancient spiritual capital on the Ganges — ghats, aarti, silk, and life's deepest mysteries.", tags: ['spiritual', 'culture', 'heritage', 'food', 'photography'], isIndian: true, coords: { lat: 25.32, lng: 82.99 } },

  // 🌍 INTERNATIONAL LOCATIONS
  { id: 'loc_1', name: 'Bali', country: 'Indonesia', region: 'asia', emoji: '🌴', popularity: 95, avgCostINR: '₹45K-70K', bestSeason: 'Apr-Oct', description: 'Tropical paradise with rice terraces, temples, and world-class surf.', tags: ['beach', 'culture', 'surfing', 'yoga', 'food'], isIndian: false, coords: { lat: -8.34, lng: 115.09 } },
  { id: 'loc_2', name: 'Tokyo', country: 'Japan', region: 'asia', emoji: '🌸', popularity: 93, avgCostINR: '₹80K-1.2L', bestSeason: 'Mar-May', description: 'A mesmerizing blend of ancient traditions and cutting-edge technology.', tags: ['culture', 'food', 'technology', 'temples', 'shopping'], isIndian: false, coords: { lat: 35.68, lng: 139.69 } },
  { id: 'loc_3', name: 'Swiss Alps', country: 'Switzerland', region: 'europe', emoji: '🏔️', popularity: 89, avgCostINR: '₹1.5L-2.5L', bestSeason: 'Jun-Sep', description: 'Breathtaking mountain scenery with world-class hiking and skiing.', tags: ['hiking', 'skiing', 'mountains', 'photography', 'nature'], isIndian: false, coords: { lat: 46.82, lng: 8.23 } },
  { id: 'loc_4', name: 'Lisbon', country: 'Portugal', region: 'europe', emoji: '🇵🇹', popularity: 87, avgCostINR: '₹60K-90K', bestSeason: 'Mar-Oct', description: 'Colorful city with rich history, amazing food, and vibrant nightlife.', tags: ['city', 'food', 'history', 'nightlife', 'surfing'], isIndian: false, coords: { lat: 38.72, lng: -9.14 } },
  { id: 'loc_5', name: 'Patagonia', country: 'Argentina', region: 'americas', emoji: '🦅', popularity: 84, avgCostINR: '₹1L-1.8L', bestSeason: 'Nov-Mar', description: 'Untamed wilderness with glaciers, mountains, and incredible wildlife.', tags: ['hiking', 'wildlife', 'photography', 'glaciers', 'adventure'], isIndian: false, coords: { lat: -50.34, lng: -72.26 } },
  { id: 'loc_10', name: 'Santorini', country: 'Greece', region: 'europe', emoji: '🏛️', popularity: 91, avgCostINR: '₹70K-1.2L', bestSeason: 'Apr-Oct', description: 'Iconic white-washed buildings, stunning sunsets, and crystal waters.', tags: ['beach', 'photography', 'romantic', 'food', 'history'], isIndian: false, coords: { lat: 36.39, lng: 25.46 } },
  { id: 'loc_11', name: 'Kyoto', country: 'Japan', region: 'asia', emoji: '⛩️', popularity: 90, avgCostINR: '₹75K-1.1L', bestSeason: 'Mar-May', description: 'Ancient capital with serene temples, bamboo groves, and traditional gardens.', tags: ['culture', 'temples', 'nature', 'food', 'photography'], isIndian: false, coords: { lat: 35.01, lng: 135.77 } },
  { id: 'loc_13', name: 'Bangkok', country: 'Thailand', region: 'asia', emoji: '🛕', popularity: 88, avgCostINR: '₹35K-55K', bestSeason: 'Nov-Feb', description: 'Vibrant street life, ornate temples, incredible food, and bustling markets.', tags: ['food', 'culture', 'temples', 'shopping', 'nightlife'], isIndian: false, coords: { lat: 13.75, lng: 100.50 } },
  { id: 'loc_15', name: 'Maldives', country: 'Maldives', region: 'asia', emoji: '🏝️', popularity: 92, avgCostINR: '₹80K-2L', bestSeason: 'Nov-Apr', description: 'Pristine overwater villas, crystal lagoons, and world-class diving.', tags: ['beach', 'diving', 'luxury', 'relaxation', 'romantic'], isIndian: false, coords: { lat: 3.20, lng: 73.22 } },
  { id: 'loc_16', name: 'Dubai', country: 'UAE', region: 'middle-east', emoji: '🏙️', popularity: 88, avgCostINR: '₹50K-1.5L', bestSeason: 'Nov-Mar', description: 'Futuristic city with luxury shopping, skyscrapers, and desert safaris.', tags: ['luxury', 'shopping', 'city', 'desert', 'adventure'], isIndian: false, coords: { lat: 25.20, lng: 55.27 } },
];
