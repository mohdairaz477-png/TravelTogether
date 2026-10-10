import { useState } from 'react';
import { Search, MapPin, Star, Calendar, Heart as HeartIcon, Filter, X, Bookmark, Compass, IndianRupee, Plane, ArrowRight, Thermometer, Shield } from 'lucide-react';
import { locations, locationService } from '../../services/locations';
import type { Location } from '../../services/locations';

interface LocationSelectorProps {
  userId: string;
  onSelect: (location: Location) => void;
}

const visaInfo: Record<string, string> = {
  'Indonesia': 'e-Visa / Visa on Arrival',
  'Japan': 'e-Visa Required',
  'Switzerland': 'Schengen Visa',
  'Portugal': 'Schengen Visa',
  'Argentina': 'Visa Free (90 days)',
  'Morocco': 'Visa Free (90 days)',
  'Australia': 'e-Visa Required',
  'UAE': 'Visa on Arrival',
  'Mexico': 'Visa Free (180 days)',
  'Greece': 'Schengen Visa',
  'Thailand': 'Visa on Arrival',
  'Maldives': 'Visa Free (30 days)',
  'India': 'No Visa Required 🇮🇳',
  'Jordan': 'Visa on Arrival',
  'New Zealand': 'e-Visa Required',
};

const weatherInfo: Record<string, string> = {
  'Goa': '30-35°C Tropical',
  'Manali': '10-25°C Pleasant',
  'Kerala': '28-35°C Warm',
  'Ladakh': '5-20°C Cool',
  'Jaipur': '25-45°C Hot',
  'Rishikesh': '15-35°C Moderate',
  'Andaman Islands': '24-30°C Tropical',
  'Mysore': '20-35°C Warm',
  'Darjeeling': '5-20°C Cool',
  'Varanasi': '20-45°C Hot',
  'Bali': '26-30°C Tropical',
  'Tokyo': '5-30°C Variable',
  'Swiss Alps': '-5 to 25°C Alpine',
  'Lisbon': '15-30°C Mediterranean',
  'Patagonia': '0-20°C Variable',
  'Marrakech': '20-40°C Hot',
  'Sydney': '10-26°C Mild',
  'Dubai': '25-45°C Desert',
  'Cancun': '24-33°C Tropical',
  'Santorini': '15-30°C Mediterranean',
  'Kyoto': '5-35°C Variable',
  'Cape Town': '15-28°C Mild',
  'Bangkok': '25-38°C Tropical',
  'Reykjavik': '-5 to 20°C Cold',
  'Maldives': '26-32°C Tropical',
  'New York': '-5 to 35°C Variable',
  'Petra': '10-40°C Desert',
  'Queenstown': '0-25°C Mild',
};

const popularTags = ['beach', 'food', 'culture', 'hiking', 'adventure', 'photography', 'romantic', 'budget', 'mountains', 'temples', 'nightlife', 'diving'];

export default function LocationSelector({ userId, onSelect }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Set<string>>(new Set(locationService.getUserSavedLocations(userId)));
  const [wishlistLocations, setWishlistLocations] = useState<Set<string>>(new Set(locationService.getUserWishlist(userId)));
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<'all' | 'india' | 'abroad' | 'saved' | 'wishlist'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredLocations = locations
    .filter(loc => {
      if (locationType === 'india' && !loc.isIndian) return false;
      if (locationType === 'abroad' && loc.isIndian) return false;
      if (locationType === 'saved' && !savedLocations.has(loc.id)) return false;
      if (locationType === 'wishlist' && !wishlistLocations.has(loc.id)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!loc.name.toLowerCase().includes(q) && 
            !loc.country.toLowerCase().includes(q) && 
            !loc.tags.some(t => t.includes(q)) &&
            !loc.description.toLowerCase().includes(q)) return false;
      }
      if (selectedRegion !== 'all' && loc.region !== selectedRegion) return false;
      if (selectedTags.length > 0 && !selectedTags.some(t => loc.tags.includes(t))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const toggleSave = (locId: string) => {
    setSavedLocations(prev => {
      const next = new Set(prev);
      if (next.has(locId)) { next.delete(locId); locationService.unsaveLocation(userId, locId); }
      else { next.add(locId); locationService.saveLocation(userId, locId); }
      return next;
    });
  };

  const toggleWishlist = (locId: string) => {
    setWishlistLocations(prev => {
      const next = new Set(prev);
      if (next.has(locId)) { next.delete(locId); locationService.removeFromWishlist(userId, locId); }
      else { next.add(locId); locationService.addToWishlist(userId, locId); }
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleExpand = (locId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(locId)) next.delete(locId);
      else next.add(locId);
      return next;
    });
  };

  const stats = locationService.getStats(userId);

  const getPopularityBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400';
    if (score >= 80) return 'bg-blue-500/15 border-blue-500/20 text-blue-400';
    if (score >= 70) return 'bg-amber-500/15 border-amber-500/20 text-amber-400';
    return 'bg-white/5 border-white/10 text-white/40';
  };

  const indianCount = locations.filter(l => l.isIndian).length;
  const abroadCount = locations.filter(l => !l.isIndian).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-3">
            Explore Destinations 🗺️
          </h1>
          <p className="text-white/40 text-sm">{stats.totalLocations} destinations • {stats.indianCount} in India • {stats.abroadCount} abroad</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button onClick={() => setLocationType(locationType === 'saved' ? 'all' : 'saved')}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              locationType === 'saved' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
            }`}>
            <Bookmark className="w-3 h-3" /> Saved ({stats.saved})
          </button>
          <button onClick={() => setLocationType(locationType === 'wishlist' ? 'all' : 'wishlist')}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              locationType === 'wishlist' ? 'bg-pink-500/15 border-pink-500/30 text-pink-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
            }`}>
            <HeartIcon className="w-3 h-3" /> Wishlist ({stats.wishlist})
          </button>
        </div>
      </div>

      {/* India / Abroad Toggle */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Choose where to explore</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all' as const, label: 'All Destinations', count: stats.totalLocations, gradient: 'from-blue-500/20 to-violet-500/20', border: 'border-blue-500/30', icon: '🌍' },
            { key: 'india' as const, label: 'In India', count: indianCount, gradient: 'from-orange-500/20 to-green-500/20', border: 'border-orange-500/30', icon: '🇮🇳' },
            { key: 'abroad' as const, label: 'International', count: abroadCount, gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: '✈️' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => { setLocationType(item.key); if (item.key === 'india') setSelectedRegion('india'); else if (item.key === 'abroad') setSelectedRegion('all'); }}
              className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${
                locationType === item.key
                  ? `bg-gradient-to-r ${item.gradient} text-white ${item.border} shadow-lg`
                  : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${locationType === item.key ? 'bg-white/10' : 'bg-white/5'}`}>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-2xl p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text" placeholder="Search destinations, countries, activities..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 transition-colors">
                <X className="w-3 h-3 text-white/40" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showFilters ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-4">
            {/* Interest Tags */}
            <div>
              <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">Popular Interests</label>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map(tag => (
                  <button
                    key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all flex items-center gap-1 ${
                      selectedTags.includes(tag)
                        ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                        : 'bg-white/5 text-white/30 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {/* Sort */}
            <div className="flex gap-2">
              <span className="text-xs text-white/40">Sort:</span>
              {[
                { key: 'popularity' as const, label: '🔥 Most Popular' },
                { key: 'name' as const, label: '🔤 A-Z' },
              ].map(s => (
                <button key={s.key} onClick={() => setSortBy(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sortBy === s.key ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                  }`}>{s.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">{filteredLocations.length} destinations</p>
        {(searchQuery || locationType !== 'all' || selectedTags.length > 0) && (
          <button onClick={() => { setSearchQuery(''); setSelectedRegion('all'); setSelectedTags([]); setLocationType('all'); }} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Clear all filters
          </button>
        )}
      </div>

      {/* Quick Destination Grid */}
      {filteredLocations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredLocations.map(loc => {
            const isSaved = savedLocations.has(loc.id);
            const isWishlisted = wishlistLocations.has(loc.id);
            const isExpanded = expandedCards.has(loc.id);
            const visa = visaInfo[loc.country] || 'Check Visa';
            const weather = weatherInfo[loc.name] || 'Variable';
            const nearbyLocations = filteredLocations.filter(l => l.id !== loc.id && (l.region === loc.region || l.tags.some(t => loc.tags.includes(t)))).slice(0, 3);

            return (
              <div
                key={loc.id}
                className={`glass-card rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer group interactive-card ${isExpanded ? 'col-span-1 sm:col-span-2 lg:col-span-3' : ''}`}
                onClick={() => { toggleExpand(loc.id); if (!isExpanded) setSelectedLocation(loc); }}
              >
                {/* Header with gradient */}
                <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${loc.isIndian ? 'from-orange-600/30 to-emerald-600/30' : 'from-blue-600/30 to-violet-600/30'} overflow-hidden`}>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Center emoji */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{loc.emoji}</span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${getPopularityBg(loc.popularity)}`}>
                      <Star className="w-3 h-3 fill-current" /> {loc.popularity}%
                    </span>
                    {loc.isIndian && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/20">
                        🇮🇳 India
                      </span>
                    )}
                  </div>

                  {/* Save/Wishlist buttons */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(loc.id); }}
                      className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${isWishlisted ? 'bg-pink-500/30 text-pink-400' : 'bg-black/20 text-white/60 hover:bg-black/30'}`}>
                      <HeartIcon className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-pink-400' : ''}`} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleSave(loc.id); }}
                      className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${isSaved ? 'bg-blue-500/30 text-blue-400' : 'bg-black/20 text-white/60 hover:bg-black/30'}`}>
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-400' : ''}`} />
                    </button>
                  </div>

                  {/* Location name */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-base font-bold text-white drop-shadow-lg">{loc.name}</h3>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{loc.country}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 space-y-2.5">
                  {/* Quick info row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <IndianRupee className="w-3 h-3 text-emerald-400" />
                      <span className="text-white/50">{loc.avgCostINR}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      <span className="text-white/50">{weather.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span className="text-white/50 truncate">{visa.split('/')[0].trim()}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {loc.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] text-white/40 capitalize">{tag}</span>
                    ))}
                    {loc.tags.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] text-white/30">+{loc.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Plan Trip Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(loc); }}
                    className="btn-primary w-full py-2 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    Plan {loc.isIndian ? 'Domestic' : 'International'} Trip
                  </button>

                  {/* Expand indicator */}
                  <div className="flex items-center justify-center text-[10px] text-white/20 gap-1">
                    {isExpanded ? 'Click to collapse' : 'Click to see more details'}
                    <ArrowRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-white/5 space-y-3 animate-bounce-in">
                      {/* Full description */}
                      <p className="text-xs text-white/50 leading-relaxed">{loc.description}</p>

                      {/* All details grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="glass rounded-lg p-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] text-white/40 font-medium">Best Time</span>
                          </div>
                          <p className="text-xs text-white/70">{loc.bestSeason}</p>
                        </div>
                        <div className="glass rounded-lg p-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Thermometer className="w-3 h-3 text-red-400" />
                            <span className="text-[10px] text-white/40 font-medium">Weather</span>
                          </div>
                          <p className="text-xs text-white/70">{weather}</p>
                        </div>
                        <div className="glass rounded-lg p-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Shield className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] text-white/40 font-medium">Visa (Indians)</span>
                          </div>
                          <p className="text-xs text-white/70">{visa}</p>
                        </div>
                        <div className="glass rounded-lg p-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <IndianRupee className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-white/40 font-medium">Budget</span>
                          </div>
                          <p className="text-xs text-white/70">{loc.avgCostINR} / person</p>
                        </div>
                      </div>

                      {/* All tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {loc.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-[10px] text-blue-300 capitalize border border-blue-500/20">{tag}</span>
                        ))}
                      </div>

                      {/* Nearby destinations */}
                      {nearbyLocations.length > 0 && (
                        <div>
                          <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-1.5">Also Explore Nearby</p>
                          <div className="flex flex-wrap gap-1.5">
                            {nearbyLocations.map(nearby => (
                              <button
                                key={nearby.id}
                                onClick={(e) => { e.stopPropagation(); toggleExpand(loc.id); setSelectedLocation(null); setTimeout(() => { toggleExpand(nearby.id); }, 100); }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-white/60 hover:text-white"
                              >
                                <span>{nearby.emoji}</span>
                                <span>{nearby.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredLocations.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Compass className="w-12 h-12 text-white/15 mx-auto mb-4" />
          <p className="text-white/50 text-lg mb-2">No destinations found</p>
          <p className="text-white/30 text-sm">Try adjusting your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLocation && !expandedCards.has(selectedLocation.id) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedLocation(null)} />
          <div className="relative glass-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-bounce-in">
            <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <span className="text-7xl relative z-10">{selectedLocation.emoji}</span>
              <button onClick={() => setSelectedLocation(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-black/30 hover:bg-black/50 transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
              {selectedLocation.isIndian && (
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/20">
                  🇮🇳 Domestic
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedLocation.name}</h2>
                <p className="text-sm text-white/40 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-blue-400" />{selectedLocation.country}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Popularity', value: `${selectedLocation.popularity}%`, icon: '🔥' },
                  { label: 'Budget', value: selectedLocation.avgCostINR, icon: '💰' },
                  { label: 'Weather', value: weatherInfo[selectedLocation.name] || '—', icon: '🌤️' },
                  { label: 'Visa', value: (visaInfo[selectedLocation.country] || '—').split('/')[0].trim(), icon: '🛂' },
                ].map(item => (
                  <div key={item.label} className="glass rounded-xl p-3 text-center">
                    <p className="text-xl mb-1">{item.icon}</p>
                    <p className="text-xs font-bold text-white truncate">{item.value}</p>
                    <p className="text-[10px] text-white/30">{item.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-white/60 leading-relaxed">{selectedLocation.description}</p>

              <div>
                <p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLocation.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-blue-500/10 text-xs text-blue-300 capitalize border border-blue-500/20">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { onSelect(selectedLocation); setSelectedLocation(null); }}
                  className="btn-primary flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
                  <Compass className="w-4 h-4" />
                  {selectedLocation.isIndian ? 'Plan Domestic Trip' : 'Plan International Trip'}
                </button>
                <button onClick={() => toggleSave(selectedLocation.id)}
                  className={`p-3 rounded-xl transition-all border ${savedLocations.has(selectedLocation.id) ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}>
                  <Bookmark className={`w-5 h-5 ${savedLocations.has(selectedLocation.id) ? 'fill-blue-400' : ''}`} />
                </button>
                <button onClick={() => toggleWishlist(selectedLocation.id)}
                  className={`p-3 rounded-xl transition-all border ${wishlistLocations.has(selectedLocation.id) ? 'bg-pink-500/10 text-pink-400 border-pink-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}>
                  <HeartIcon className={`w-5 h-5 ${wishlistLocations.has(selectedLocation.id) ? 'fill-pink-400' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
