import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send, Users, ChevronLeft, Smile, Paperclip, Image, Mic } from 'lucide-react';
import { db } from '../../services/db';
import type { Trip, Message as MessageType, User } from '../../services/db';

interface ChatProps {
  user: User;
  onViewProfile?: (userId: string) => void;
  onNavigate?: (view: 'trips') => void;
}

export default function Chat({ user, onViewProfile, onNavigate }: ChatProps) {
  const emojiList = ['😊', '❤️', '🎉', '🔥', '👍', '😂', '🤩', '🙌', '💪', '✨', '🌟', '🎊', '🥳', '😎', '🤝', '🌍', '✈️', '🏖️', '🍕', '🎵'];

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userTrips = db.tripFindAll().filter(t => t.members.includes(user._id));

  useEffect(() => {
    if (selectedTrip) {
      setMessages(db.messageFindByTrip(selectedTrip._id));
    }
  }, [selectedTrip]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedTrip) return;
    const msg = db.messageCreate({
      tripId: selectedTrip._id,
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newMessage.trim(),
    });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const filteredTrips = searchQuery
    ? userTrips.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.destination.toLowerCase().includes(searchQuery.toLowerCase()))
    : userTrips;

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      {/* Trip List Sidebar */}
      <div className={`${selectedTrip ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 border-r border-white/5`}>
        {/* Search */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 text-sm transition-colors"
            />
          </div>
        </div>

        {/* Trip List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTrips.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-8 h-8 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/40">No trips yet</p>
              <p className="text-xs text-white/30 mt-1 mb-3">Join a trip to start chatting</p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('trips')}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5"
                >
                  Browse Trips
                </button>
              )}
            </div>
          ) : (
            filteredTrips.map(trip => {
              const tripMsgs = db.messageFindByTrip(trip._id);
              const lastMsg = tripMsgs[tripMsgs.length - 1];
              const isSelected = selectedTrip?._id === trip._id;
              return (
                <button
                  key={trip._id}
                  onClick={() => { setSelectedTrip(trip); setShowEmojiPicker(false); }}
                  className={`w-full p-4 flex items-start gap-3 border-b border-white/5 transition-all text-left cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-500/10 border-l-2 border-l-blue-500'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{trip.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-blue-300' : 'text-white group-hover:text-blue-200'}`}>{trip.title}</p>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{trip.destination} • {trip.members.length} members</p>
                    {lastMsg && (
                      <p className="text-xs text-white/30 mt-1 truncate">{lastMsg.content}</p>
                    )}
                  </div>
                  {lastMsg && (
                    <span className="text-xs text-white/20 flex-shrink-0">
                      {new Date(lastMsg.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedTrip ? 'flex' : 'hidden lg:flex'} flex-col flex-1 bg-gradient-to-b from-slate-950 to-slate-900/50`}>
        {selectedTrip ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 glass-strong">
              <button
                onClick={() => { setSelectedTrip(null); setShowEmojiPicker(false); }}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-2xl">{selectedTrip.emoji}</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{selectedTrip.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedTrip.status === 'confirmed' ? 'bg-emerald-400' :
                    selectedTrip.status === 'planning' ? 'bg-amber-400' : 'bg-blue-400 animate-pulse'
                  }`} />
                  <span className="text-xs text-white/40 capitalize">{selectedTrip.status}</span>
                  <span className="text-white/10">•</span>
                  <span className="text-xs text-white/30">{selectedTrip.members.length} online</span>
                </div>
              </div>
              <div className="flex -space-x-2">
                {selectedTrip.members.slice(0, 4).map(memberId => {
                  const member = db.userFindById(memberId);
                  return member ? (
                    <button
                      key={memberId}
                      onClick={() => onViewProfile?.(memberId)}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.avatar} border-2 border-slate-950 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer`}
                      title={`View ${member.name}'s profile`}
                    />
                  ) : null;
                })}
                {selectedTrip.members.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-slate-950 flex items-center justify-center">
                    <span className="text-xs text-white/60">+{selectedTrip.members.length - 4}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Trip Info */}
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass">
                  <span className="text-lg">{selectedTrip.emoji}</span>
                  <span className="text-sm text-white/60">{selectedTrip.title}</span>
                  <span className="text-xs text-white/30">{selectedTrip.startDate}</span>
                </div>
              </div>

              {/* Welcome message */}
              <div className="glass-card rounded-2xl p-5 max-w-sm mx-auto text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white/70 font-medium">Welcome to the group chat!</p>
                <p className="text-xs text-white/30 mt-1">Introduce yourself and start planning together</p>
              </div>

              {messages.map(msg => {
                const isOwn = msg.userId === user._id;
                return (
                  <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                      {!isOwn && (
                        <button
                          onClick={() => onViewProfile?.(msg.userId)}
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${msg.userAvatar} flex-shrink-0 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer`}
                          title={`View ${msg.userName}'s profile`}
                        />
                      )}
                      <div>
                        {!isOwn && (
                          <button
                            onClick={() => onViewProfile?.(msg.userId)}
                            className="text-xs text-white/40 mb-1 ml-1 hover:text-blue-300 transition-colors cursor-pointer"
                          >
                            {msg.userName}
                          </button>
                        )}
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isOwn
                            ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-md shadow-lg shadow-blue-500/20'
                            : 'glass text-white/80 rounded-bl-md'
                        }`}>
                          {msg.content}
                        </div>
                        <p className={`text-[10px] text-white/15 mt-1 ${isOwn ? 'text-right' : ''}`}>
                          {new Date(msg.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="px-4 pb-2">
                <div className="glass rounded-xl p-3">
                  <div className="flex flex-wrap gap-1">
                    {emojiList.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="w-9 h-9 rounded-lg hover:bg-white/10 text-lg flex items-center justify-center transition-all hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-end gap-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-3 rounded-xl transition-all ${showEmojiPicker ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 transition-all">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 text-sm transition-colors pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <Image className="w-4 h-4 text-white/30" />
                    </button>
                  </div>
                </div>
                {newMessage.trim() ? (
                  <button
                    onClick={sendMessage}
                    className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                ) : (
                  <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 transition-all">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900/50">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-white/15" />
              </div>
              <p className="text-lg font-semibold text-white/60">Select a trip</p>
              <p className="text-sm text-white/30 mt-1">Choose a trip to start chatting with your travel group</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
