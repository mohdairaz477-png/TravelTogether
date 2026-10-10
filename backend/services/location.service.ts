// ============================================================
// BACKEND — Location Service
// ============================================================
// Queries over the destinations dataset + per-user
// saved / wishlist / visited collections.
// ============================================================

import { locations } from '../data/locations.data';
import type { Location } from '../models';

export const locationService = {
  getAll: (): Location[] => locations,
  getById: (id: string): Location | undefined => locations.find(l => l.id === id),
  search: (query: string): Location[] => {
    const q = query.toLowerCase();
    return locations.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.tags.some(t => t.toLowerCase().includes(q)) ||
      l.description.toLowerCase().includes(q)
    );
  },
  getByRegion: (region: string): Location[] => {
    if (region === 'all') return locations;
    return locations.filter(l => l.region === region);
  },
  getSorted: (sortBy: 'popularity' | 'cost' | 'name'): Location[] => {
    const sorted = [...locations];
    if (sortBy === 'popularity') return sorted.sort((a, b) => b.popularity - a.popularity);
    if (sortBy === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  },
  getByTags: (tags: string[]): Location[] =>
    locations.filter(l => tags.some(t => l.tags.includes(t.toLowerCase()))),
  getPopular: (limit = 10): Location[] =>
    [...locations].sort((a, b) => b.popularity - a.popularity).slice(0, limit),
  getIndian: (): Location[] => locations.filter(l => l.isIndian),
  getAbroad: (): Location[] => locations.filter(l => !l.isIndian),
  getRandom: (count = 3): Location[] => {
    const shuffled = [...locations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },
  getUserSavedLocations: (userId: string): string[] => {
    const saved = localStorage.getItem(`tt_saved_locations_${userId}`);
    return saved ? JSON.parse(saved) : [];
  },
  saveLocation: (userId: string, locationId: string): void => {
    const saved = locationService.getUserSavedLocations(userId);
    if (!saved.includes(locationId)) {
      saved.push(locationId);
      localStorage.setItem(`tt_saved_locations_${userId}`, JSON.stringify(saved));
    }
  },
  unsaveLocation: (userId: string, locationId: string): void => {
    const saved = locationService.getUserSavedLocations(userId);
    localStorage.setItem(`tt_saved_locations_${userId}`, JSON.stringify(saved.filter((id: string) => id !== locationId)));
  },
  getUserVisitedLocations: (userId: string): string[] => {
    const visited = localStorage.getItem(`tt_visited_locations_${userId}`);
    return visited ? JSON.parse(visited) : [];
  },
  markVisited: (userId: string, locationId: string): void => {
    const visited = locationService.getUserVisitedLocations(userId);
    if (!visited.includes(locationId)) {
      visited.push(locationId);
      localStorage.setItem(`tt_visited_locations_${userId}`, JSON.stringify(visited));
    }
  },
  getUserWishlist: (userId: string): string[] => {
    const wishlist = localStorage.getItem(`tt_wishlist_${userId}`);
    return wishlist ? JSON.parse(wishlist) : [];
  },
  addToWishlist: (userId: string, locationId: string): void => {
    const wishlist = locationService.getUserWishlist(userId);
    if (!wishlist.includes(locationId)) {
      wishlist.push(locationId);
      localStorage.setItem(`tt_wishlist_${userId}`, JSON.stringify(wishlist));
    }
  },
  removeFromWishlist: (userId: string, locationId: string): void => {
    const wishlist = locationService.getUserWishlist(userId);
    localStorage.setItem(`tt_wishlist_${userId}`, JSON.stringify(wishlist.filter((id: string) => id !== locationId)));
  },
  getStats: (userId: string) => ({
    saved: locationService.getUserSavedLocations(userId).length,
    visited: locationService.getUserVisitedLocations(userId).length,
    wishlist: locationService.getUserWishlist(userId).length,
    totalLocations: locations.length,
    indianCount: locations.filter(l => l.isIndian).length,
    abroadCount: locations.filter(l => !l.isIndian).length,
    regionsVisited: new Set(
      locationService.getUserVisitedLocations(userId)
        .map((id: string) => locations.find(l => l.id === id)?.region)
        .filter(Boolean)
    ).size,
  }),
};
