import { useState } from 'react';
import { MapPin, Calendar, Star, Plane, MessageSquare, Heart, Shield, X, UserCheck, Clock, Award } from 'lucide-react';
import { db, User as UserType } from '../../services/db';
import { connectionService } from '../../services/connectionService';

interface UserProfileViewProps {
  targetUserId: string;
  currentUser: UserType;
  onClose: () => void;
  onNavigate: (view: 'chat' | 'matches') => void;
  isAdmin?: boolean;
}

export default function UserProfileView({ targetUserId, currentUser, onClose, onNavigate, isAdmin = false }: UserProfileViewProps) {
  const user = db.userFindById(targetUserId);
  const [activeTab, setActiveTab] = useState<'about' | 'trips' | 'badges'>('about');
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>(() => {
    const reqs = connectionService.getRequests();
    const existing = reqs.find(r =>
      (r.fromUserId === currentUser._id && r.toUserId === targetUserId) ||
      (r.fromUserId === targetUserId && r.toUserId === currentUser._id)
    );
    return existing ? existing.status : 'none';
  });

  if (!user) return null;

  const userTrips = db.tripFindAll().filter(t => t.members.includes(targetUserId));
  const connections = connectionService.getConnections(targetUserId);
  const isSelf = currentUser._id === targetUserId;

  const handleSendRequest = () => {
    connectionService.sendRequest(
      currentUser._id, currentUser.name, currentUser.avatar,
      targetUserId, user.name, user.avatar,
      db.matchFind(currentUser._id).find(m => m.userId === targetUserId)?.matchScore || 0
    );
    setConnectionStatus('pending');
    window.dispatchEvent(new Event('connection-updated'));
  };

  const handleCancelRequest = () => {
    const req = connectionService.getRequests().find(r =>
      r.fromUserId === currentUser._id && r.toUserId === targetUserId && r.status === 'pending'
    );
    if (req) connectionService.cancelRequest(req._id);
    setConnectionStatus('none');
    window.dispatchEvent(new Event('connection-updated'));
  };


  const interestOptions = [
    { name: 'food', emoji: '🍕' }, { name: 'culture', emoji: '🏛️' }, { name: 'hiking', emoji: '🥾' },
    { name: 'photography', emoji: '📸' }, { name: 'surfing', emoji: '🏄' }, { name: 'tech', emoji: '💻' },
    { name: 'camping', emoji: '⛺' }, { name: 'art', emoji: '🎨' }, { name: 'music', emoji: '🎵' },
    { name: 'beach', emoji: '🏖️' }, { name: 'adventure', emoji: '🧗' }, { name: 'wildlife', emoji: '🦁' },
  ];

  const matchInfo = db.matchFind(currentUser._id).find(m => m.userId === targetUserId);

  const statusColors: Record<string, string> = {
    planning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    confirmed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    ongoing: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    completed: 'bg-white/5 text-white/40 border-white/10',
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true" style={{ backgroundColor: '#020617' }}>
      {/* Sticky Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[110] p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors shadow-lg"
      >
        <X className="w-5 h-5 text-white" />
      </button>
      <div className="min-h-full flex items-start justify-center p-4 pt-16 pb-16">
      <div className="relative rounded-3xl w-full max-w-2xl animate-bounce-in border border-white/10 shadow-2xl overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
        {/* Cover */}
        <div className="h-32 sm:h-40 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-t-3xl">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          {isAdmin && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Admin View
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="px-6 pb-4 -mt-20 relative z-10" style={{ backgroundColor: 'transparent' }}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${user.avatar} border-4 border-slate-950 flex items-center justify-center shadow-2xl`}>
              <span className="text-4xl font-bold text-white">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 pt-14 sm:pt-16">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                {user.verified && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/40">
                {user.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" />{user.location}</span>
                )}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-violet-400" />Joined {user.joinedAt}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize border ${
                  user.plan === 'voyager' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  user.plan === 'nomad' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                  'bg-white/5 text-white/40 border-white/10'
                }`}>{user.plan} plan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-6 mt-5 grid grid-cols-4 gap-3">
          {[
            { label: 'Trips', value: userTrips.length, icon: Plane, color: 'from-blue-500 to-blue-700' },
            { label: 'Rating', value: user.rating || '—', icon: Star, color: 'from-amber-500 to-orange-600', suffix: '/5' },
            { label: 'Connections', value: connections.length, icon: Heart, color: 'from-pink-500 to-rose-600' },
            { label: 'Location', value: user.location ? user.location.split(',')[0] : '—', icon: MapPin, color: 'from-emerald-500 to-teal-600', isText: true },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-3 text-center border border-white/10" style={{ backgroundColor: '#1e293b' }}>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-1`}>
                <stat.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-sm font-bold text-white">{stat.value}{stat.suffix || ''}</p>
              <p className="text-[10px] text-white/30">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Match Info (if not self) */}
        {!isSelf && matchInfo && (
          <div className="px-6 mt-4">
            <div className={`rounded-xl p-4 flex items-center gap-4 border ${
              matchInfo.matchScore >= 80 ? 'border-emerald-500/20' : matchInfo.matchScore >= 60 ? 'border-amber-500/20' : 'border-white/10'
            }`} style={{ backgroundColor: '#1e293b' }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                matchInfo.matchScore >= 80 ? 'bg-emerald-500/10' : matchInfo.matchScore >= 60 ? 'bg-amber-500/10' : 'bg-white/5'
              }`}>
                <span className={`text-lg font-bold ${
                  matchInfo.matchScore >= 80 ? 'text-emerald-400' : matchInfo.matchScore >= 60 ? 'text-amber-400' : 'text-white/40'
                }`}>{matchInfo.matchScore}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Match Score</p>
                <p className="text-xs text-white/40">
                  {matchInfo.sharedInterests.length > 0 && `${matchInfo.sharedInterests.length} shared interests`}
                  {matchInfo.travelStyle.length > 0 && ` • ${matchInfo.travelStyle.length} travel styles`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons (if not self and not admin) */}
        {!isSelf && !isAdmin && (
          <div className="px-6 mt-4">
            {connectionStatus === 'accepted' ? (
              <div className="flex gap-2">
                <div className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
                    <UserCheck className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>
                <button onClick={() => onNavigate('chat')} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-xs font-medium transition-colors">
                  <MessageSquare className="w-4 h-4 inline mr-1" /> Chat
                </button>
              </div>
            ) : connectionStatus === 'pending' ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <span className="text-xs text-amber-400 flex items-center justify-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Request pending
                  </span>
                </div>
                <button onClick={handleCancelRequest} className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors">
                  Cancel
                </button>
              </div>
            ) : connectionStatus === 'rejected' ? (
              <div className="py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <span className="text-xs text-red-400">Request declined</span>
              </div>
            ) : (
              <button onClick={handleSendRequest} className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" /> Send Connection Request
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 mt-5">
          <div className="flex items-center gap-1 rounded-xl p-1 border border-white/10" style={{ backgroundColor: '#1e293b' }}>
            {[
              { id: 'about' as const, label: 'About' },
              { id: 'trips' as const, label: 'Trips' },
              { id: 'badges' as const, label: 'Badges' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-blue-500/15 text-blue-400' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 max-h-64 overflow-y-auto" style={{ backgroundColor: '#0f172a' }}>
          {activeTab === 'about' && (
            <div className="space-y-4">
              {user.bio && (
                <div>
                  <h3 className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">About</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{user.bio}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">Budget</h3>
                  <div className="px-3 py-2 rounded-lg text-sm text-white/60 capitalize border border-white/10" style={{ backgroundColor: '#1e293b' }}>{user.budget === 'low' ? 'Budget-friendly' : user.budget}</div>
                </div>
                <div>
                  <h3 className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">Pace</h3>
                  <div className="px-3 py-2 rounded-lg text-sm text-white/60 capitalize border border-white/10" style={{ backgroundColor: '#1e293b' }}>{user.pace}</div>
                </div>
              </div>
              {user.interests.length > 0 && (
                <div>
                  <h3 className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.interests.map(i => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-[10px] text-blue-300 capitalize border border-blue-500/10 flex items-center gap-1">
                        {interestOptions.find(io => io.name === i)?.emoji} {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="space-y-2">
              {userTrips.length === 0 ? (
                <p className="text-center text-white/30 text-sm py-4">No trips yet</p>
              ) : (
                userTrips.map(trip => (
                  <div key={trip._id} className="rounded-xl p-3 flex items-center gap-3 border border-white/10" style={{ backgroundColor: '#1e293b' }}>
                    <span className="text-xl">{trip.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{trip.title}</p>
                      <p className="text-xs text-white/40">{trip.destination} • {trip.startDate}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColors[trip.status]}`}>
                      {trip.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '✈️', label: 'First Trip', earned: userTrips.length > 0, color: 'from-blue-500 to-blue-700' },
                { icon: '⭐', label: 'Top Rated', earned: user.rating >= 4.9, color: 'from-amber-500 to-amber-700' },
                { icon: '👥', label: 'Social', earned: connections.length >= 5, color: 'from-pink-500 to-rose-600' },
                { icon: '🗺️', label: 'Explorer', earned: userTrips.length >= 3, color: 'from-emerald-500 to-teal-700' },
                { icon: '🏆', label: 'Veteran', earned: userTrips.length >= 10, color: 'from-violet-500 to-violet-700' },
                { icon: '📝', label: 'Planner', earned: userTrips.filter(t => t.creatorId === targetUserId).length >= 2, color: 'from-orange-500 to-red-600' },
              ].map(badge => (
                <div key={badge.label} className={`rounded-xl p-4 text-center transition-all border ${badge.earned ? 'border-white/10' : 'border-white/5 opacity-40'}`} style={{ backgroundColor: badge.earned ? '#1e293b' : '#0f172a' }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-2 shadow-lg ${badge.earned ? '' : 'grayscale'}`}>
                    <span className="text-2xl">{badge.icon}</span>
                  </div>
                  <p className="text-xs font-semibold text-white">{badge.label}</p>
                  {badge.earned && (
                    <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <Award className="w-3 h-3" /> Earned
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-2 border-t border-white/5" style={{ backgroundColor: '#0f172a' }}>
          <p className="text-[10px] text-white/20 text-center">
            User ID: {user._id} • {isAdmin ? 'Viewed as Admin' : `Viewed by ${currentUser.name}`}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
