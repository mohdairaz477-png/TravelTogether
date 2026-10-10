import { useState, useEffect } from 'react';
import { Star, MessageCircle, MapPin, Heart, Zap, Globe2, Check, X, Filter, Sparkles, Shield, Users, TrendingUp, Send, Clock, ExternalLink } from 'lucide-react';
import { db } from '../../services/db';
import type { User, Match } from '../../services/db';
import { connectionService } from '../../services/connectionService';

interface MatchesProps {
  user: User;
  onNavigate: (view: 'trips' | 'matches' | 'chat' | 'profile' | 'locations') => void;
  onViewProfile?: (userId: string) => void;
}

export default function MatchesView({ user, onNavigate, onViewProfile }: MatchesProps) {
  const matches = db.matchFind(user._id);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [contacted, setContacted] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);

  // Track connection requests
  useEffect(() => {
    const refresh = () => {
      const reqs = connectionService.getRequests();
      setConnectionRequests(reqs);
    };
    refresh();
    window.addEventListener('connection-updated', refresh);
    return () => window.removeEventListener('connection-updated', refresh);
  }, []);

  const filteredMatches = matches.filter(m => {
    if (filter === 'high') return m.matchScore >= 80;
    if (filter === 'medium') return m.matchScore >= 60 && m.matchScore < 80;
    return true;
  });

  const getConnectionStatus = (matchUserId: string): 'none' | 'pending' | 'accepted' | 'rejected' => {
    const existing = connectionRequests.find(r =>
      (r.fromUserId === user._id && r.toUserId === matchUserId) ||
      (r.fromUserId === matchUserId && r.toUserId === user._id)
    );
    if (!existing) return 'none';
    return existing.status;
  };

  const handleConnect = (match: Match) => {
    if (showMessageBox === match.userId) {
      // Actually send the request
      connectionService.sendRequest(
        user._id, user.name, user.avatar,
        match.userId, match.userName, match.userAvatar,
        match.matchScore, requestMessage
      );
      setContacted(prev => new Set(prev).add(match.userId));
      setShowMessageBox(null);
      setRequestMessage('');
      window.dispatchEvent(new Event('connection-updated'));
    } else {
      setShowMessageBox(match.userId);
    }
  };

  const handleCancelRequest = (match: Match) => {
    const req = connectionRequests.find(r =>
      r.fromUserId === user._id && r.toUserId === match.userId && r.status === 'pending'
    );
    if (req) {
      connectionService.cancelRequest(req._id);
      setContacted(prev => {
        const next = new Set(prev);
        next.delete(match.userId);
        return next;
      });
      window.dispatchEvent(new Event('connection-updated'));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-white/40';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-emerald-400 to-green-500';
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-amber-400 to-orange-500';
    return 'from-white/20 to-white/40';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Perfect Match';
    if (score >= 80) return 'Great Match';
    if (score >= 60) return 'Good Match';
    return 'Maybe';
  };

  const highCount = matches.filter(m => m.matchScore >= 80).length;
  const mediumCount = matches.filter(m => m.matchScore >= 60 && m.matchScore < 80).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-3">
            Find Travel Companions
            <span className="text-3xl">🤝</span>
          </h1>
          <p className="text-white/40 text-sm">
            {matches.length} potential matches • {highCount} great • {mediumCount} good
          </p>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Improve Matches
        </button>
      </div>

      {/* Algorithm Info */}
      <div className="reveal glass-card rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl animated-gradient flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              Smart Matching Algorithm
              <Shield className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Our AI analyzes your interests, travel style, budget, pace, and personality traits 
              to find the most compatible travel companions.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Shared Interests', 'Travel Style', 'Budget', 'Pace', 'Verification'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            showFilters ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-white/40 border border-white/10'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
        
        <div className="flex items-center gap-2">
          {[
            { key: 'all' as const, label: 'All', count: matches.length, color: 'blue' },
            { key: 'high' as const, label: 'Great', count: highCount, color: 'emerald' },
            { key: 'medium' as const, label: 'Good', count: mediumCount, color: 'amber' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filter === f.key
                  ? `${f.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : f.color === 'amber' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-blue-500/15 text-blue-400 border-blue-500/30'} border`
                  : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
              }`}
            >
              {f.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                filter === f.key ? 'bg-white/10' : 'bg-white/5'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Matches', value: matches.length, icon: Users, color: 'from-blue-500 to-blue-700' },
          { label: 'Avg. Score', value: matches.length ? Math.round(matches.reduce((a, b) => a + b.matchScore, 0) / matches.length) : 0, icon: TrendingUp, color: 'from-violet-500 to-violet-700', suffix: '%' },
          { label: 'Connected', value: contacted.size, icon: Heart, color: 'from-pink-500 to-rose-600' },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-1`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-lg font-bold text-white">
              {stat.value}{stat.suffix || ''}
            </p>
            <p className="text-[10px] text-white/30">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Globe2 className="w-12 h-12 text-white/15 mx-auto mb-4" />
          <p className="text-white/50 text-lg mb-2">No matches in this category</p>
          <p className="text-white/30 text-sm">Try completing your profile for better matches</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match, i) => (
            <div
              key={match.userId}
              className="glass-card rounded-2xl p-5 interactive-card group relative overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Top colored bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getScoreGradient(match.matchScore)}`} />

              <div className="flex items-start gap-4">
                {/* Avatar with score ring - clickable to view profile */}
                <div className="relative cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewProfile?.(match.userId); }}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${match.userAvatar} group-hover:scale-105 group-hover:ring-2 group-hover:ring-blue-500/50 transition-all`} />
                  {/* Score badge */}
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-slate-950 border-2 border-slate-950 flex items-center justify-center">
                    <span className={`text-[11px] font-bold ${getScoreColor(match.matchScore)}`}>
                      {match.matchScore}
                    </span>
                  </div>
                  {/* View profile tooltip */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] bg-blue-500/90 text-white px-1.5 py-0.5 rounded whitespace-nowrap">View Profile</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewProfile?.(match.userId); }}
                        className="text-base font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {match.userName}
                        <ExternalLink className="w-3 h-3 text-white/20" />
                      </button>
                      <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-400" />{match.userLocation}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      match.matchScore >= 90 ? 'bg-emerald-400/10 text-emerald-400' :
                      match.matchScore >= 80 ? 'bg-green-400/10 text-green-400' :
                      'bg-amber-400/10 text-amber-400'
                    }`}>
                      {getScoreLabel(match.matchScore)}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{match.rating}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Globe2 className="w-3 h-3 text-violet-400" />{match.tripCount} trips
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Heart className="w-3 h-3 text-pink-400" />{match.sharedInterests.length} shared
                    </span>
                  </div>

                  {/* Shared interests */}
                  {match.sharedInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {match.sharedInterests.map(interest => (
                        <span key={interest} className="px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-[10px] text-blue-300 capitalize border border-blue-500/10">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-xs text-white/30 mt-3 line-clamp-2 italic">"{match.bio}"</p>

                  {/* Connection Status / Action Buttons */}
                  <div className="mt-4">
                    {getConnectionStatus(match.userId) === 'accepted' ? (
                      <div className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <span className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5" /> Connected!
                        </span>
                      </div>
                    ) : getConnectionStatus(match.userId) === 'rejected' ? (
                      <div className="py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                        <span className="text-xs text-red-400 flex items-center justify-center gap-1.5 font-medium">
                          <X className="w-3.5 h-3.5" /> Request declined
                        </span>
                      </div>
                    ) : getConnectionStatus(match.userId) === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                          <span className="text-xs text-amber-400 flex items-center justify-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" /> Request pending
                          </span>
                        </div>
                        <button
                          onClick={() => handleCancelRequest(match)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : showMessageBox === match.userId ? (
                      <div className="glass rounded-xl p-3 space-y-2">
                        <textarea
                          value={requestMessage}
                          onChange={e => setRequestMessage(e.target.value)}
                          placeholder="Add a message (optional)..."
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 text-xs resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConnect(match)}
                            className="flex-1 btn-primary py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send Request
                          </button>
                          <button
                            onClick={() => { setShowMessageBox(null); setRequestMessage(''); }}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white/80 text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConnect(match)}
                          className="flex-1 btn-primary py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          Send Request
                        </button>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <MessageCircle className="w-4 h-4 text-white/50" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
