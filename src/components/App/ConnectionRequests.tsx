import { useState, useEffect, useCallback } from 'react';
import { Heart, UserPlus, Check, X, MessageCircle, Clock, UserCheck } from 'lucide-react';
import { mongoConnectionApi } from '../../../frontend/api';
import type { ConnectionRequest } from '../../../backend';

interface ConnectionRequestsProps {
  userId: string;
  onNavigate: (view: 'chat') => void;
  onViewProfile?: (userId: string) => void;
}

export default function ConnectionRequests({ userId, onNavigate, onViewProfile }: ConnectionRequestsProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'connections'>('received');
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponseBox, setShowResponseBox] = useState<string | null>(null);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const refreshRequests = useCallback(async () => {
    try {
      const result = await mongoConnectionApi.list();
      setRequests((result.requests || []).map((r: any) => ({ ...r,
        fromUserId: String(r.fromUserId), toUserId: String(r.toUserId),
        respondedAt: r.respondedAt || null, responseMessage: r.responseMessage || null,
      })));
      setActionError('');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not load requests.');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refreshRequests(); }, [refreshRequests]);

  const received = requests.filter(r => r.toUserId === userId && r.status === 'pending');
  const sent = requests.filter(r => r.fromUserId === userId && r.status === 'pending');
  const connections = requests.filter(r => (r.fromUserId === userId || r.toUserId === userId) && r.status === 'accepted');
  const pendingCount = received.length;

  const handleAccept = async (requestId: string) => {
    try { await mongoConnectionApi.respond(requestId, 'accepted', responseMessage); await refreshRequests(); setShowResponseBox(null); setResponseMessage(''); }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Could not accept request.'); }
  };
  const handleReject = async (requestId: string) => {
    try { await mongoConnectionApi.respond(requestId, 'rejected', responseMessage); await refreshRequests(); setShowResponseBox(null); setResponseMessage(''); }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Could not decline request.'); }
  };
  const handleCancel = async (requestId: string) => {
    try { await mongoConnectionApi.cancel(requestId); await refreshRequests(); }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Could not cancel request.'); }
  };

  const timeAgo = (timestamp: string) => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-4">
      {actionError && <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">{actionError}</div>}
      {loading && <p className="text-sm text-white/40">Loading your requests from the server…</p>}
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'received' ? 'bg-pink-500/15 text-pink-400' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Heart className="w-4 h-4" />
          Received
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'sent' ? 'bg-blue-500/15 text-blue-400' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Sent
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'connections' ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Connected
          {connections.length > 0 && (
            <span className="text-[10px] text-white/40">({connections.length})</span>
          )}
        </button>
      </div>

      {/* Received Requests */}
      {activeTab === 'received' && (
        <div className="space-y-3">
          {received.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <Heart className="w-10 h-10 text-pink-400/20 mx-auto mb-3" />
              <p className="text-white/50 mb-1">No pending requests</p>
              <p className="text-white/30 text-sm">When someone sends you a connection request, it'll appear here</p>
            </div>
          ) : (
            received.map(req => (
              <div
                key={req._id}
                className={`glass-card rounded-2xl p-5 transition-all ${
                  showResponseBox === req._id ? 'ring-2 ring-pink-500/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onViewProfile?.(req.fromUserId)}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${req.fromUserAvatar} flex-shrink-0 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer`}
                    title={`View ${req.fromUserName}'s profile`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <button
                        onClick={() => onViewProfile?.(req.fromUserId)}
                        className="text-sm font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        {req.fromUserName}
                      </button>
                      <span className="text-xs text-white/30">{timeAgo(req.createdAt)}</span>
                    </div>
                    {req.matchScore > 0 && (
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-[10px] font-bold text-blue-400 mb-2">
                        {req.matchScore}% Match
                      </span>
                    )}
                    {req.message && (
                      <p className="text-sm text-white/50 mt-2 bg-white/5 rounded-lg p-3">
                        <MessageCircle className="w-3 h-3 inline mr-1 text-blue-400" />
                        {req.message}
                      </p>
                    )}

                    {/* Response Box */}
                    {showResponseBox === req._id && (
                      <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-white/40 mb-2">Add a message (optional):</p>
                        <input
                          type="text"
                          placeholder="e.g., Great! Looking forward to it..."
                          value={responseMessage}
                          onChange={e => setResponseMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 text-xs"
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-xs font-semibold hover:from-emerald-600 hover:to-emerald-800 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => setShowResponseBox(showResponseBox === req._id ? null : req._id)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-xs transition-colors flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reply
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sent Requests */}
      {activeTab === 'sent' && (
        <div className="space-y-3">
          {sent.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <Clock className="w-10 h-10 text-blue-400/20 mx-auto mb-3" />
              <p className="text-white/50 mb-1">No pending sent requests</p>
              <p className="text-white/30 text-sm">Connect with travelers to see your sent requests here</p>
            </div>
          ) : (
            sent.map(req => (
              <div key={req._id} className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onViewProfile?.(req.toUserId)}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${req.toUserAvatar} flex-shrink-0 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer`}
                    title={`View ${req.toUserName}'s profile`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onViewProfile?.(req.toUserId)}
                        className="text-sm font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        {req.toUserName}
                      </button>
                      <span className="text-xs text-white/30">{timeAgo(req.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-amber-400">Pending</span>
                      {req.matchScore > 0 && (
                        <span className="text-xs text-white/30">• {req.matchScore}% match</span>
                      )}
                    </div>
                    {req.message && (
                      <p className="text-xs text-white/40 mt-1">"{req.message}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCancel(req._id)}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Accepted Connections */}
      {activeTab === 'connections' && (
        <div className="space-y-3">
          {connections.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <UserCheck className="w-10 h-10 text-emerald-400/20 mx-auto mb-3" />
              <p className="text-white/50 mb-1">No connections yet</p>
              <p className="text-white/30 text-sm">Accept connection requests to build your travel network</p>
            </div>
          ) : (
            connections.map(req => {
              const otherUserId = req.fromUserId === userId ? req.toUserId : req.fromUserId;
              const otherUser = req.fromUserId === userId
                ? { name: req.toUserName, avatar: req.toUserAvatar }
                : { name: req.fromUserName, avatar: req.fromUserAvatar };
              return (
                <div key={req._id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onViewProfile?.(otherUserId)}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${otherUser.avatar} flex-shrink-0 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer`}
                      title={`View ${otherUser.name}'s profile`}
                    />
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onViewProfile?.(otherUserId)}
                        className="text-sm font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        {otherUser.name}
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Connected</span>
                        {req.respondedAt && (
                          <span className="text-xs text-white/30">• {timeAgo(req.respondedAt)}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('chat')}
                      className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
