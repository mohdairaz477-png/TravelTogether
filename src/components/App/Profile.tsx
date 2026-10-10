import { useState } from 'react';
import { MapPin, Calendar, Star, Heart, Edit2, Check, X, Camera, Shield, Trophy, Compass, Globe2, MessageSquare, Plus, Sparkles, Bookmark, Plane, Award, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { db, User as UserType } from '../../services/db';
import { locationService, locations } from '../../services/locations';
import { regions } from '../../services/locations';

interface ProfileProps {
  user: UserType;
  onUpdate: (user: UserType) => void;
  onViewProfile?: (userId: string) => void;
}

export default function ProfileView({ user, onUpdate }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    age: user.age,
    interests: user.interests.join(', '),
    travelStyle: user.travelStyle.join(', '),
    budget: user.budget,
    pace: user.pace,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'destinations' | 'stats'>('overview');

  const userTrips = db.tripFindAll().filter(t => t.members.includes(user._id));
  const locStats = locationService.getStats(user._id);
  const savedLocs = locationService.getUserSavedLocations(user._id).map(id => locations.find(l => l.id === id)).filter(Boolean);
  const wishlistLocs = locationService.getUserWishlist(user._id).map(id => locations.find(l => l.id === id)).filter(Boolean);

  const handleSave = () => {
    const interests = formData.interests.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const travelStyle = formData.travelStyle.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const updated = db.userUpdate(user._id, { ...formData, interests, travelStyle, age: Number(formData.age) });
    if (updated) { onUpdate(updated); setIsEditing(false); }
  };

  const handleCancel = () => {
    setFormData({ name: user.name, bio: user.bio, location: user.location, age: user.age, interests: user.interests.join(', '), travelStyle: user.travelStyle.join(', '), budget: user.budget, pace: user.pace });
    setIsEditing(false);
  };

  const interestOptions = [
    { name: 'food', emoji: '🍕' }, { name: 'culture', emoji: '🏛️' }, { name: 'hiking', emoji: '🥾' },
    { name: 'photography', emoji: '📸' }, { name: 'surfing', emoji: '🏄' }, { name: 'tech', emoji: '💻' },
    { name: 'camping', emoji: '⛺' }, { name: 'art', emoji: '🎨' }, { name: 'music', emoji: '🎵' },
    { name: 'festivals', emoji: '🎪' }, { name: 'coffee', emoji: '☕' }, { name: 'cycling', emoji: '🚴' },
    { name: 'museums', emoji: '🏛️' }, { name: 'tea', emoji: '🍵' }, { name: 'temples', emoji: '⛩️' },
    { name: 'beach', emoji: '🏖️' }, { name: 'adventure', emoji: '🧗' }, { name: 'wildlife', emoji: '🦁' },
    { name: 'kayaking', emoji: '🛶' }, { name: 'history', emoji: '📜' },
  ];

  const achievements = [
    { icon: '🌍', label: 'First Trip', desc: 'Complete your first trip', earned: userTrips.length > 0, gradient: 'from-blue-500 to-blue-700' },
    { icon: '✈️', label: 'Globetrotter', desc: 'Visit 3+ countries', earned: locStats.regionsVisited >= 3, gradient: 'from-violet-500 to-violet-700' },
    { icon: '⭐', label: 'Top Rated', desc: 'Get a 5-star rating', earned: user.rating >= 4.9, gradient: 'from-amber-500 to-amber-700' },
    { icon: '👥', label: 'Social Butterfly', desc: 'Travel with 10+ people', earned: userTrips.reduce((a, t) => a + t.members.length, 0) >= 10, gradient: 'from-pink-500 to-rose-600' },
    { icon: '📝', label: 'Planner', desc: 'Create 3 trips', earned: userTrips.filter(t => t.creatorId === user._id).length >= 3, gradient: 'from-emerald-500 to-emerald-700' },
    { icon: '🗺️', label: 'Explorer', desc: 'Save 5+ destinations', earned: locStats.saved >= 5, gradient: 'from-teal-500 to-teal-700' },
    { icon: '💬', label: 'Chatterbox', desc: 'Send 100 messages', earned: false, gradient: 'from-cyan-500 to-cyan-700' },
    { icon: '🏆', label: 'Legendary', desc: 'Complete 20 trips', earned: userTrips.length >= 20, gradient: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="h-40 sm:h-48 relative animated-gradient">
          <div className="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          {/* Decorative dots */}
          <div className="absolute top-6 left-6 grid grid-cols-4 gap-1 opacity-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white" />
            ))}
          </div>
          <button className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/25 hover:bg-black/40 transition-colors backdrop-blur-sm border border-white/10">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-5 sm:px-8 pb-6 -mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${user.avatar} border-4 border-slate-950 flex items-center justify-center shadow-2xl relative`}>
              <span className="text-5xl font-bold text-white">{user.name.charAt(0)}</span>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-16 sm:pt-20">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
                    {user.verified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5">
                    <span className="text-sm text-white/50 flex items-center gap-1.5 hover:text-white/70 transition-colors cursor-pointer">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />{user.location || 'Add location'}
                    </span>
                    <span className="text-sm text-white/50 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />Joined {user.joinedAt}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize border flex items-center gap-1 ${
                      user.plan === 'voyager' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      user.plan === 'nomad' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                      'bg-white/5 text-white/40 border-white/10'
                    }`}>
                      {user.plan === 'voyager' ? '👑' : user.plan === 'nomad' ? '🚀' : '✨'} {user.plan} plan
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isEditing ? 'btn-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Trips Taken', value: userTrips.length, icon: Plane, gradient: 'from-blue-500 to-cyan-600', sub: `${userTrips.filter(t => t.status === 'confirmed').length} upcoming` },
          { label: 'Rating', value: user.rating || '—', icon: Star, gradient: 'from-amber-500 to-orange-600', sub: '/ 5.0', highlight: true },
          { label: 'Travel Buddies', value: userTrips.reduce((acc, t) => acc + t.members.length - 1, 0), icon: Users, gradient: 'from-violet-500 to-pink-600', sub: 'met so far' },
          { label: 'Destinations', value: locStats.saved, icon: MapPin, gradient: 'from-emerald-500 to-teal-600', sub: `${locStats.wishlist} in wishlist` },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-4 interactive-card group">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              {stat.highlight && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}<span className="text-sm text-white/40 font-normal">{stat.sub}</span></p>
            <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5 overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Overview', icon: Compass },
          { id: 'destinations' as const, label: 'Destinations', icon: Globe2 },
          { id: 'trips' as const, label: 'My Trips', icon: Plane },
          { id: 'stats' as const, label: 'Stats & Badges', icon: Trophy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Bio */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              About Me
            </h3>
            {isEditing ? (
              <textarea value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} placeholder="Tell other travelers about yourself..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm resize-none transition-all" rows={3} />
            ) : (
              <p className="text-sm text-white/60 leading-relaxed">{user.bio || <span className="text-white/30 italic flex items-center gap-2"><Plus className="w-4 h-4" /> Add a bio to attract travel companions!</span>}</p>
            )}
          </div>

          {/* Preferences */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Travel Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">Budget Range</label>
                {isEditing ? (
                  <select value={formData.budget} onChange={e => setFormData(p => ({ ...p, budget: e.target.value as any }))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 text-sm transition-all appearance-none cursor-pointer">
                    <option value="low" className="bg-slate-900">💰 Budget-friendly</option>
                    <option value="medium" className="bg-slate-900">💵 Mid-range</option>
                    <option value="high" className="bg-slate-900">💎 Premium</option>
                    <option value="luxury" className="bg-slate-900">👑 Luxury</option>
                  </select>
                ) : (
                  <div className={`px-4 py-3 rounded-xl text-sm font-medium capitalize flex items-center gap-2 border ${
                    user.budget === 'low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    user.budget === 'medium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    user.budget === 'high' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {user.budget === 'low' ? '💰' : user.budget === 'medium' ? '💵' : user.budget === 'high' ? '💎' : '👑'}
                    {user.budget === 'low' ? 'Budget-friendly' : user.budget}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">Travel Pace</label>
                {isEditing ? (
                  <select value={formData.pace} onChange={e => setFormData(p => ({ ...p, pace: e.target.value as any }))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 text-sm transition-all appearance-none cursor-pointer">
                    <option value="relaxed" className="bg-slate-900">🐢 Relaxed</option>
                    <option value="moderate" className="bg-slate-900">🚶 Moderate</option>
                    <option value="fast" className="bg-slate-900">🏃 Fast-paced</option>
                  </select>
                ) : (
                  <div className="px-4 py-3 rounded-xl text-sm font-medium capitalize bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2">
                    {user.pace === 'relaxed' ? '🐢' : user.pace === 'moderate' ? '🚶' : '🏃'} {user.pace}
                  </div>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">Location</label>
                  <input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="Your city" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: Number(e.target.value) }))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] text-sm transition-all" />
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              Interests
            </h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <button key={interest.name} type="button" onClick={() => {
                    const current = formData.interests.split(',').map(s => s.trim()).filter(Boolean);
                    const updated = current.includes(interest.name) ? current.filter(i => i !== interest.name) : [...current, interest.name];
                    setFormData(p => ({ ...p, interests: updated.join(', ') }));
                  }} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${formData.interests.includes(interest.name) ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-white/5 text-white/30 border border-white/10 hover:bg-white/10 hover:text-white/50'}`}>
                    <span>{interest.emoji}</span>
                    <span className="capitalize">{interest.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.interests.length > 0 ? user.interests.map(i => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-xs text-blue-300 capitalize border border-blue-500/10">
                    {interestOptions.find(io => io.name === i)?.emoji} {i}
                  </span>
                )) : <p className="text-sm text-white/30 italic flex items-center gap-2"><Plus className="w-4 h-4" /> Add interests to improve your matches!</p>}
              </div>
            )}
          </div>

          {/* Location Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Saved Places', value: locStats.saved, icon: Bookmark, gradient: 'from-blue-500 to-blue-700' },
              { label: 'Wishlist', value: locStats.wishlist, icon: Heart, gradient: 'from-pink-500 to-rose-600' },
              { label: 'Regions', value: `${locStats.regionsVisited}/${regions.length - 1}`, icon: Globe2, gradient: 'from-teal-500 to-emerald-600' },
            ].map(item => (
              <button key={item.label} onClick={() => setActiveTab('destinations')} className="glass-card rounded-xl p-4 text-center interactive-card">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-white/30">{item.label}</p>
              </button>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Save Changes
              </button>
              <button onClick={handleCancel} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 text-sm font-semibold transition-colors flex items-center gap-2 border border-white/10">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Destinations Tab */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          {/* Saved Locations */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-400" />
              Saved Destinations ({savedLocs.length})
            </h3>
            {savedLocs.length === 0 ? (
              <div className="text-center py-8">
                <Globe2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No saved destinations yet</p>
                <p className="text-white/30 text-xs mt-1">Explore destinations and save your favorites</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedLocs.map(loc => loc && (
                  <div key={loc.id} className="glass rounded-xl p-3 flex items-center gap-3 interactive-card">
                    <span className="text-2xl">{loc.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{loc.name}</p>
                      <p className="text-xs text-white/40">{loc.country} • {loc.avgCostINR}</p>
                    </div>
                    <span className={`text-xs font-bold ${loc.popularity >= 90 ? 'text-emerald-400' : loc.popularity >= 80 ? 'text-blue-400' : 'text-white/40'}`}>{loc.popularity}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              Wishlist ({wishlistLocs.length})
            </h3>
            {wishlistLocs.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Your wishlist is empty</p>
                <p className="text-white/30 text-xs mt-1">Heart destinations you dream of visiting</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {wishlistLocs.map(loc => loc && (
                  <div key={loc.id} className="glass rounded-xl p-3 flex items-center gap-3 interactive-card">
                    <span className="text-2xl">{loc.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{loc.name}</p>
                      <p className="text-xs text-white/40">{loc.country} • {loc.bestSeason}</p>
                    </div>
                    <span className="text-xs text-pink-400">{loc.avgCostINR}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Region Progress */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-teal-400" />
              Regions Explored
            </h3>
            <div className="space-y-3">
              {regions.filter(r => r.id !== 'all').map(region => {
                const regionLocs = locations.filter(l => l.region === region.id);
                const savedInRegion = regionLocs.filter(l => savedLocs.some(s => s?.id === l.id)).length;
                return (
                  <div key={region.id} className="flex items-center gap-3">
                    <span className="text-lg w-8 text-center">{region.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/60 font-medium">{region.name}</span>
                        <span className="text-white/30">{savedInRegion}/{regionLocs.length} saved</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${savedInRegion > 0 ? 'from-blue-500 to-teal-500' : 'from-white/10 to-white/20'} transition-all duration-700`} style={{ width: `${(savedInRegion / regionLocs.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="space-y-3">
          {userTrips.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <Plane className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/50">No trips yet</p>
              <p className="text-sm text-white/30 mt-1">Start exploring and join a trip!</p>
            </div>
          ) : (
            userTrips.map(trip => (
              <div key={trip._id} className="glass-card rounded-xl p-4 flex items-center gap-4 interactive-card">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trip.gradient} flex items-center justify-center text-xl shadow-lg`}>{trip.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">{trip.title}</h3>
                  <p className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-400" />{trip.destination} • <Calendar className="w-3 h-3 text-violet-400 inline" /> {trip.startDate}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  trip.status === 'confirmed' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                  trip.status === 'planning' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-white/5 text-white/40 border-white/10'
                }`}>{trip.status}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Trips', value: userTrips.length, icon: Plane, gradient: 'from-blue-500 to-cyan-600' },
              { label: 'Countries Visited', value: new Set(userTrips.map(t => t.country)).size, icon: MapPin, gradient: 'from-emerald-500 to-teal-600' },
              { label: 'Travelers Met', value: userTrips.reduce((acc, t) => acc + t.members.length - 1, 0), icon: Users, gradient: 'from-violet-500 to-pink-600' },
              { label: 'Messages Sent', value: 42, icon: MessageSquare, gradient: 'from-amber-500 to-orange-600' },
              { label: 'Avg. Rating', value: user.rating || '—', icon: Star, gradient: 'from-yellow-500 to-amber-600' },
              { label: 'Member Since', value: user.joinedAt, icon: Clock, gradient: 'from-indigo-500 to-blue-700' },
              { label: 'Regions Explored', value: `${locStats.regionsVisited}/${regions.length - 1}`, icon: Globe2, gradient: 'from-teal-500 to-emerald-700' },
              { label: 'Saved Places', value: locStats.saved, icon: Bookmark, gradient: 'from-blue-500 to-indigo-600' },
              { label: 'Wishlist', value: locStats.wishlist, icon: Heart, gradient: 'from-pink-500 to-rose-600' },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-xl p-4 interactive-card">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Achievements ({achievements.filter(a => a.earned).length}/{achievements.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {achievements.map(ach => (
                <div key={ach.label} className={`rounded-xl p-4 text-center transition-all ${ach.earned ? 'glass-card interactive-card' : 'bg-white/[0.02] border border-white/5 opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ach.gradient} flex items-center justify-center mx-auto mb-2 shadow-lg ${ach.earned ? '' : 'grayscale'}`}>
                    <span className="text-2xl">{ach.icon}</span>
                  </div>
                  <p className="text-xs font-semibold text-white">{ach.label}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{ach.desc}</p>
                  {ach.earned && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <Check className="w-3 h-3" /> Earned
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Stats */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Activity Overview
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Profile Completion', value: 75, color: 'from-blue-500 to-cyan-500' },
                { label: 'Match Quality', value: 82, color: 'from-emerald-500 to-teal-500' },
                { label: 'Trip Engagement', value: 60, color: 'from-violet-500 to-purple-500' },
                { label: 'Community Rating', value: user.rating ? user.rating * 20 : 0, color: 'from-amber-500 to-orange-500' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/60 font-medium">{stat.label}</span>
                    <span className="text-white/40">{stat.value}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000`} style={{ width: `${stat.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
