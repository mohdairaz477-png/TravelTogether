import { useState } from 'react';
import { Search, Calendar, Users, Heart, Plus, X, Check, Globe2, Filter, Grid3X3, List, Bookmark, Share2, MapPin, Flame, ChevronDown, IndianRupee } from 'lucide-react';
import { db, User } from '../../services/db';

interface TripsProps {
  user: User;
  onCreateTrip: () => void;
  onViewProfile?: (userId: string) => void;
}

export default function TripsView({ user, onCreateTrip, onViewProfile }: TripsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [joinedTrips, setJoinedTrips] = useState<string[]>(
    db.tripFindAll().filter(t => t.members.includes(user._id)).map(t => t._id)
  );
  const [savedTrips, setSavedTrips] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const allTrips = db.tripFindAll();
  
  const filteredTrips = allTrips
    .filter(t => {
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.destination.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.activities.some(a => a.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (sortBy === 'price') return a.budgetPerPerson - b.budgetPerPerson;
      if (sortBy === 'popular') return b.members.length - a.members.length;
      return 0;
    });

  const handleJoin = (tripId: string) => {
    const result = db.tripJoin(tripId, user._id);
    if ('error' in result) {
      alert(result.error);
      return;
    }
    setJoinedTrips(prev => [...prev, tripId]);
  };

  const handleLeave = (tripId: string) => {
    db.tripLeave(tripId, user._id);
    setJoinedTrips(prev => prev.filter(id => id !== tripId));
  };

  const toggleSave = (tripId: string) => {
    setSavedTrips(prev => {
      const next = new Set(prev);
      if (next.has(tripId)) next.delete(tripId);
      else next.add(tripId);
      return next;
    });
  };

  const statusColors: Record<string, string> = {
    planning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    confirmed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    ongoing: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    completed: 'bg-white/5 text-white/40 border-white/10',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-3">
            Discover Trips
            <span className="text-3xl">🌍</span>
          </h1>
          <p className="text-white/40 text-sm">{filteredTrips.length} of {allTrips.length} trips worldwide</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Create Trip
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="glass-card rounded-2xl p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search destinations, activities, countries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showFilters ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Mode */}
          <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-white/40 hover:text-white/70'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-white/40 hover:text-white/70'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1">
              {['all', 'planning', 'confirmed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-white/10 mx-1" />
            {/* Sort */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/30 mr-1">Sort:</span>
              {[
                { key: 'date', label: 'Date' },
                { key: 'price', label: 'Price' },
                { key: 'popular', label: 'Popular' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sortBy === s.key
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trip Grid/List */}
      {filteredTrips.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Globe2 className="w-12 h-12 text-white/15 mx-auto mb-4" />
          <p className="text-white/50 text-lg mb-2">No trips found</p>
          <p className="text-white/30 text-sm">Try a different search or create a new trip</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map(trip => {
            const isJoined = joinedTrips.includes(trip._id);
            const isFull = trip.currentGroupSize >= trip.maxGroupSize;
            const isSaved = savedTrips.has(trip._id);
            const daysLeft = Math.ceil((new Date(trip.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const fillPercent = Math.round((trip.currentGroupSize / trip.maxGroupSize) * 100);

            return (
              <div
                key={trip._id}
                className="glass-card rounded-2xl overflow-hidden interactive-card group"
              >
                {/* Trip Header */}
                <div className={`relative h-40 bg-gradient-to-br ${trip.gradient} p-5 overflow-hidden`}>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
                  
                  <div className="relative z-10">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColors[trip.status]}`}>
                          {trip.status}
                        </span>
                        {daysLeft > 0 && daysLeft < 30 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">
                            <Flame className="w-3 h-3" /> Soon
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleSave(trip._id)}
                          className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white text-white' : 'text-white/60'}`} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                          <Share2 className="w-3.5 h-3.5 text-white/60" />
                        </button>
                      </div>
                    </div>

                    <span className="text-4xl block mb-2">{trip.emoji}</span>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-bold text-white drop-shadow-lg">{trip.destination}</h3>
                      <p className="text-sm text-white/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{trip.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-4 space-y-3">
                  {/* Info row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/50">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {trip.startDate}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-white/80">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                      ₹{trip.budgetPerPerson.toLocaleString()}
                    </span>
                  </div>

                  {/* Group progress */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{trip.currentGroupSize}/{trip.maxGroupSize} spots</span>
                      <span>{fillPercent}% full</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${trip.gradient} transition-all duration-700`}
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="flex flex-wrap gap-1.5">
                    {trip.activities.slice(0, 3).map(a => (
                      <span key={a} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/50 capitalize">
                        {a.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {trip.activities.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/40">+{trip.activities.length - 3}</span>
                    )}
                  </div>

                  {/* Members */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {trip.members.slice(0, 4).map(mId => {
                          const member = db.userFindById(mId);
                          return member ? (
                            <button
                              key={mId}
                              onClick={(e) => { e.stopPropagation(); onViewProfile?.(mId); }}
                              className={`w-7 h-7 rounded-full bg-gradient-to-br ${member.avatar} border-2 border-slate-950 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer`}
                              title={`View ${member.name}'s profile`}
                            />
                          ) : null;
                        })}
                      </div>
                      <span className="text-[11px] text-white/30">
                        {trip.members.length} traveler{trip.members.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => isJoined ? handleLeave(trip._id) : handleJoin(trip._id)}
                    disabled={isFull && !isJoined}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isJoined
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                        : isFull
                        ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                        : 'btn-primary text-white border-0'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-4 h-4" /> Joined — Click to Leave
                      </>
                    ) : isFull ? (
                      <>
                        <Users className="w-4 h-4" /> Trip Full
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" /> Join This Trip
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredTrips.map(trip => {
            const isJoined = joinedTrips.includes(trip._id);
            const isFull = trip.currentGroupSize >= trip.maxGroupSize;
            return (
              <div
                key={trip._id}
                className="glass-card rounded-2xl p-4 interactive-card flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <span className="text-3xl">{trip.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{trip.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[trip.status]}`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{trip.destination}, {trip.country}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{trip.startDate}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3 text-emerald-400" />₹{trip.budgetPerPerson.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{trip.currentGroupSize}/{trip.maxGroupSize}</span>
                  </div>
                </div>
                <button
                  onClick={() => isJoined ? handleLeave(trip._id) : handleJoin(trip._id)}
                  disabled={isFull && !isJoined}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                    isJoined
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400'
                      : isFull
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'btn-primary text-white'
                  }`}
                >
                  {isJoined ? 'Leave' : isFull ? 'Full' : 'Join'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Trip Modal */}
      {showCreateModal && (
        <CreateTripModal
          user={user}
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateTrip}
        />
      )}
    </div>
  );
}

interface CreateTripModalProps {
  user: User;
  onClose: () => void;
  onCreate: () => void;
}

function CreateTripModal({ user, onClose, onCreate }: CreateTripModalProps) {
  const [formData, setFormData] = useState({
    title: '', destination: '', country: '', startDate: '', endDate: '',
    budget: '', maxGroupSize: '8', description: '', activities: '', emoji: '🌍',
  });

  const emojis = ['🌴', '🏔️', '🌸', '🦅', '🚢', '🇵🇹', '🏖️', '🎭', '🗼', '🌊', '🌋', '🏜️', '🎪', '🛕'];
  const gradients = [
    'from-blue-600 to-blue-400', 'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-400', 'from-emerald-500 to-emerald-700',
    'from-violet-500 to-violet-700', 'from-cyan-500 to-cyan-700',
    'from-indigo-500 to-indigo-700', 'from-teal-500 to-teal-700',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activities = formData.activities.split(',').map(a => a.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean);
    db.tripCreate(
      {
        title: formData.title,
        destination: formData.destination,
        country: formData.country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: Number(formData.budget),
        budgetPerPerson: Number(formData.budget),
        maxGroupSize: Number(formData.maxGroupSize),
        description: formData.description,
        activities,
        status: 'planning',
        emoji: formData.emoji,
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
      },
      user._id
    );
    onCreate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-card rounded-3xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-bounce-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-white/60" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">✨</span> Create New Trip
          </h2>
          <p className="text-sm text-white/40 mt-1">Plan your next adventure with fellow travelers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji Picker */}
          <div>
            <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">Choose an icon</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map(e => (
                <button key={e} type="button" onClick={() => setFormData(p => ({ ...p, emoji: e }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${formData.emoji === e ? 'bg-blue-500/20 scale-110 ring-2 ring-blue-500/50' : 'bg-white/5 hover:bg-white/10 hover:scale-105'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <input type="text" placeholder="Trip title (e.g., Bali Adventure)" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" required />

          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="📍 Destination" value={formData.destination} onChange={e => setFormData(p => ({ ...p, destination: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" required />
            <input type="text" placeholder="🌍 Country" value={formData.country} onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Start Date</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" required />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">End Date</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="💰 Budget per person (₹)" value={formData.budget} onChange={e => setFormData(p => ({ ...p, budget: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" required />
            <input type="number" placeholder="👥 Max group size" value={formData.maxGroupSize} onChange={e => setFormData(p => ({ ...p, maxGroupSize: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" required />
          </div>

          <textarea placeholder="✍️ Describe your trip..." value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm resize-none transition-all" rows={3} required />

          <input type="text" placeholder="🎯 Activities (comma separated, e.g., hiking, food, culture)" value={formData.activities} onChange={e => setFormData(p => ({ ...p, activities: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" />

          <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Create Trip
          </button>
        </form>
      </div>
    </div>
  );
}
