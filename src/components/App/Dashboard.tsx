import { useState, useEffect } from 'react';
import { Globe2, Users, MessageSquare, TrendingUp, MapPin, Calendar, Star, Compass, ChevronRight, Sparkles, Plane, Plus, Settings, Bell, Heart, Zap, Shield, Trophy } from 'lucide-react';
import { db, Trip, User } from '../../services/db';
import { locationService } from '../../services/locations';

interface DashboardProps {
  user: User;
  onNavigate: (view: 'dashboard' | 'trips' | 'matches' | 'chat' | 'profile' | 'locations') => void;
  onSelectTrip: (trip: Trip) => void;
  onViewProfile?: (userId: string) => void;
}

export default function Dashboard({ user, onNavigate, onViewProfile }: DashboardProps) {
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [topMatches, setTopMatches] = useState<any[]>([]);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  useEffect(() => {
    setUserTrips(db.tripFindAll().filter(t => t.members.includes(user._id)));
    setTopMatches(db.matchFind(user._id).slice(0, 6));
  }, [user._id]);

  const locStats = locationService.getStats(user._id);
  
  const stats = [
    { label: 'Active Trips', value: userTrips.filter(t => t.status === 'confirmed' || t.status === 'ongoing').length, icon: Globe2, color: 'from-blue-500 to-blue-700', accent: 'bg-blue-500/10 text-blue-400', change: '+2 this month', trend: 'up' },
    { label: 'Saved Places', value: locStats.saved, icon: MapPin, color: 'from-emerald-500 to-teal-600', accent: 'bg-emerald-500/10 text-emerald-400', change: `${locStats.wishlist} wishlisted`, trend: 'up' },
    { label: 'Travel Buddies', value: userTrips.reduce((acc, t) => acc + t.members.length, 0), icon: Users, color: 'from-violet-500 to-violet-700', accent: 'bg-violet-500/10 text-violet-400', change: '+8 new', trend: 'up' },
    { label: 'Match Score', value: user.rating ? `${user.rating}` : '—', icon: Zap, color: 'from-amber-500 to-orange-600', accent: 'bg-amber-500/10 text-amber-400', change: '/ 5.0 rating', trend: 'star' },
  ];

  const statusColors: Record<string, string> = {
    planning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    confirmed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    ongoing: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    completed: 'bg-white/5 text-white/40 border-white/10',
  };

  const statusDots: Record<string, string> = {
    planning: 'bg-amber-400',
    confirmed: 'bg-emerald-400',
    ongoing: 'bg-blue-400 animate-pulse',
    completed: 'bg-white/30',
  };

  const quickActions = [
    { id: 'browse', label: 'Browse Trips', icon: Compass, color: 'from-blue-500 to-blue-700', bg: 'hover:bg-blue-500/10', target: 'trips' as const },
    { id: 'destinations', label: 'Destinations', icon: MapPin, color: 'from-emerald-500 to-teal-600', bg: 'hover:bg-emerald-500/10', target: 'locations' as const },
    { id: 'matches', label: 'Find Matches', icon: Heart, color: 'from-pink-500 to-rose-600', bg: 'hover:bg-pink-500/10', target: 'matches' as const },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'from-violet-500 to-purple-700', bg: 'hover:bg-violet-500/10', target: 'chat' as const },
    { id: 'create', label: 'Create Trip', icon: Plus, color: 'from-amber-500 to-orange-600', bg: 'hover:bg-amber-500/10', target: 'trips' as const },
    { id: 'profile', label: 'My Profile', icon: Settings, color: 'from-indigo-500 to-blue-700', bg: 'hover:bg-indigo-500/10', target: 'profile' as const },
  ];

  const recentActivity = [
    { icon: '🌴', text: 'Bali trip confirmed for March!', time: '2h ago', color: 'from-blue-500 to-blue-700' },
    { icon: '👋', text: 'Marcus joined your Swiss Alps trip', time: '5h ago', color: 'from-violet-500 to-violet-700' },
    { icon: '💬', text: '3 new messages in Tokyo trip', time: '1d ago', color: 'from-emerald-500 to-emerald-700' },
    { icon: '⭐', text: 'Elena rated you 5 stars!', time: '2d ago', color: 'from-amber-500 to-amber-700' },
    { icon: '🎉', text: 'You earned the Explorer badge!', time: '3d ago', color: 'from-pink-500 to-pink-700' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="reveal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {user.name.split(' ')[0]}! ✨
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
              <Trophy className="w-3 h-3" /> Level 5 Explorer
            </span>
          </div>
          <p className="text-white/40 text-sm">Your adventure dashboard — let's plan something amazing</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
            <Bell className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-slate-950">5</span>
          </button>
          <button className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plane className="w-4 h-4" />
            <span className="hidden sm:inline">Book Next Trip</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-4 sm:p-5 interactive-card group relative overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                {stat.trend === 'up' && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                  </span>
                )}
                {stat.trend === 'new' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {stat.trend === 'star' && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40 font-medium">{stat.label}</p>
                <p className={`text-xs ${stat.accent.split(' ')[1]}`}>{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="reveal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              <button className="text-xs text-white/40 hover:text-white/70 transition-colors">Customize</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => {
                    setActiveQuickAction(action.id);
                    onNavigate(action.target);
                  }}
                  className={`glass-card rounded-2xl p-3 sm:p-4 text-center interactive-card group flex flex-col items-center gap-2 transition-all duration-300 ${
                    activeQuickAction === action.id ? 'scale-95' : ''
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Your Trips */}
          <div className="reveal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Your Trips
              </h2>
              <button
                onClick={() => onNavigate('trips')}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1 group"
              >
                View all
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="space-y-3">
              {userTrips.length === 0 ? (
                <div className="glass-card rounded-2xl p-10 text-center">
                  <Compass className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/50 mb-1 font-medium">No trips yet</p>
                  <p className="text-white/30 text-sm mb-4">Start exploring amazing destinations</p>
                  <button
                    onClick={() => onNavigate('trips')}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Find a Trip
                  </button>
                </div>
              ) : (
                userTrips.map((trip, i) => (
                  <button
                    key={trip._id}
                    onClick={() => onNavigate('trips')}
                    className="glass-card rounded-2xl p-4 w-full text-left interactive-card group relative overflow-hidden"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Colored left border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${trip.gradient} rounded-l-2xl`} />
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${trip.gradient} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                        {trip.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">{trip.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[trip.status]} flex items-center gap-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDots[trip.status]}`} />
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/40">
                          <span className="flex items-center gap-1.5 hover:text-white/60 transition-colors cursor-pointer">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />{trip.destination}, {trip.country}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-violet-400" />{trip.startDate} → {trip.endDate}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />{trip.currentGroupSize}/{trip.maxGroupSize} travelers
                          </span>
                        </div>
                        
                        {/* Progress bar for group filling */}
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between text-[10px] text-white/30 mb-1">
                            <span>Group progress</span>
                            <span>{Math.round((trip.currentGroupSize / trip.maxGroupSize) * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${trip.gradient} transition-all duration-1000`}
                              style={{ width: `${(trip.currentGroupSize / trip.maxGroupSize) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex -space-x-2">
                          {trip.members.slice(0, 3).map(mId => {
                            const member = db.userFindById(mId);
                            return member ? (
                              <div key={mId} className={`w-7 h-7 rounded-full bg-gradient-to-br ${member.avatar} border-2 border-slate-950 group-hover:scale-110 transition-transform`} />
                            ) : null;
                          })}
                          {trip.members.length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-slate-950 flex items-center justify-center">
                              <span className="text-[10px] text-white/60">+{trip.members.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Matches */}
          <div className="reveal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Top Matches
              </h2>
              <button
                onClick={() => onNavigate('matches')}
                className="text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors"
              >
                See all →
              </button>
            </div>
            <div className="glass-card rounded-2xl p-3 space-y-1">
              {topMatches.slice(0, 5).map((match) => (
                <div
                  key={match.userId}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] transition-all group cursor-pointer"
                >
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); onViewProfile?.(match.userId); }}
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${match.userAvatar} group-hover:scale-110 transition-transform`}
                    />
                    <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-slate-950 ${
                      match.matchScore >= 80 ? 'bg-emerald-500 text-white' :
                      match.matchScore >= 60 ? 'bg-amber-500 text-white' :
                      'bg-white/20 text-white/60'
                    }`}>
                      {match.matchScore}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors truncate">{match.userName}</p>
                    <p className="text-xs text-white/30">{match.userLocation}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/50 transition-colors">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {match.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="reveal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Activity Feed
              </h2>
            </div>
            <div className="glass-card rounded-2xl p-3 space-y-1">
              {recentActivity.map((activity, i) => (
                <button
                  key={i}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.05] transition-all group text-left"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors">{activity.text}</p>
                    <p className="text-xs text-white/30 mt-0.5">{activity.time}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activity.color} flex-shrink-0 mt-2`} />
                </button>
              ))}
            </div>
          </div>

          {/* Upgrade Banner */}
          {user.plan === 'free' && (
            <div className="reveal">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="animated-gradient p-5">
                  <div className="relative z-10">
                    <Shield className="w-8 h-8 text-white/80 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-1">Upgrade to Voyager</h3>
                    <p className="text-sm text-white/70 mb-3">Unlock AI matching, unlimited trips & more</p>
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                      Start 7-day free trial →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trending Destinations */}
          <div className="reveal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-cyan-400" />
                Trending Destinations
              </h2>
              <button
                onClick={() => onNavigate('locations')}
                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1 group"
              >
                View all
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {locationService.getPopular(4).map(loc => {
                const gradients: Record<string, string> = {
                  'asia': 'from-blue-500/20 to-cyan-700/20',
                  'europe': 'from-violet-500/20 to-purple-700/20',
                  'americas': 'from-emerald-500/20 to-teal-700/20',
                  'africa': 'from-amber-500/20 to-orange-700/20',
                  'oceania': 'from-pink-500/20 to-rose-700/20',
                  'middle-east': 'from-teal-500/20 to-cyan-700/20',
                };
                return (
                  <button
                    key={loc.id}
                    onClick={() => onNavigate('locations')}
                    className={`glass-card rounded-xl p-3 text-left interactive-card bg-gradient-to-br ${gradients[loc.region] || 'from-blue-500/20 to-blue-700/20'}`}
                  >
                    <span className="text-2xl">{loc.emoji}</span>
                    <p className="text-sm font-semibold text-white mt-1">{loc.name}</p>
                    <p className="text-[10px] text-white/40">{loc.popularity}% popular</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
