import { useState, useEffect } from 'react';
import { Shield, Bell, Users, UserPlus, LogIn, Trash2, CheckCheck, Calendar, Clock, Mail, X, Eye, RefreshCw, Copy, AlertCircle, CheckCircle, Settings, ExternalLink, Send, Key, UserCircle, Menu } from 'lucide-react';
import { db } from '../../services/db';
import type { AdminNotification } from '../../services/locations';
import { adminService } from '../../services/locations';
import { emailService } from '../../services/emailService';
import UserProfileView from './UserProfileView';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'users' | 'email' | 'settings'>('notifications');
  const [viewProfileUserId, setViewProfileUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'login' | 'signup'>('all');
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [emailConfig, setEmailConfig] = useState({
    publicKey: '',
    serviceId: '',
    templateId: '',
    adminEmail: 'mohdairaz477@gmail.com',
  });
  const [testEmailStatus, setTestEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tt_email_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEmailConfig({
        publicKey: parsed.publicKey || '',
        serviceId: parsed.serviceId || '',
        templateId: parsed.templateId || '',
        adminEmail: parsed.adminEmail || 'mohdairaz477@gmail.com',
      });
    }
  }, []);

  useEffect(() => {
    setNotifications(adminService.getNotifications());
    const interval = setInterval(() => setNotifications(adminService.getNotifications()), 3000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = () => {
    adminService.markAllRead();
    setNotifications(adminService.getNotifications());
  };

  const markRead = (id: string) => {
    adminService.markRead(id);
    setNotifications(adminService.getNotifications());
  };

  const clearAll = () => {
    adminService.clearAll();
    setNotifications([]);
  };

  const filtered = notifications.filter(n => filter === 'all' ? true : n.type === filter);

  const allUsers = (() => {
    const stored = localStorage.getItem('tt_users');
    return stored ? JSON.parse(stored) : [];
  })();

  const unreadCount = notifications.filter(n => !n.read).length;
  const loginCount = notifications.filter(n => n.type === 'login').length;
  const signupCount = notifications.filter(n => n.type === 'signup').length;
  const todayNotifs = notifications.filter(n => new Date(n.timestamp).toDateString() === new Date().toDateString()).length;
  const emailLog = emailService.getEmailLog();
  const emailSuccessCount = emailLog.filter((e: any) => e.sent).length;
  const emailFailCount = emailLog.filter((e: any) => !e.sent).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4 text-blue-400" />;
      case 'signup': return <UserPlus className="w-4 h-4 text-emerald-400" />;
      default: return <Bell className="w-4 h-4 text-white/40" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'login': return 'bg-blue-500/10 border-blue-500/20';
      case 'signup': return 'bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-white/5 border-white/10';
    }
  };

  const timeAgo = (timestamp: string) => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const saveEmailConfig = () => {
    setSaveStatus('saving');
    
    // Save to localStorage
    const config = {
      publicKey: emailConfig.publicKey,
      serviceId: emailConfig.serviceId,
      templateId: emailConfig.templateId,
      adminEmail: emailConfig.adminEmail,
    };
    localStorage.setItem('tt_email_config', JSON.stringify(config));

    // Also update the emailService config dynamically by writing to a special key
    localStorage.setItem('tt_email_runtime_config', JSON.stringify(config));
    
    console.log('✅ [Admin] Email config saved:', config);
    
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const resetConfig = () => {
    setEmailConfig({
      publicKey: '86IO3ZH43hjFBN8_U',
      serviceId: 'service_wf8c6jf',
      templateId: 'template_vqok13a',
      adminEmail: 'mohdairaz477@gmail.com',
    });
    localStorage.removeItem('tt_email_config');
    localStorage.removeItem('tt_email_runtime_config');
    console.log('🔄 [Admin] Config reset to defaults');
  };

  const sendTestEmail = async () => {
    setTestEmailStatus('sending');
    const result = await emailService.sendNotification({
      type: 'signup',
      userName: 'Admin Test',
      userEmail: 'test@traveltogether.in',
      message: '🧪 Test email from TravelTogether Admin Panel',
      timestamp: new Date().toISOString(),
    });
    setTestEmailStatus(result ? 'success' : 'error');
    setTimeout(() => setTestEmailStatus('idle'), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-40 h-screen w-64 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-white">Admin</span>
                <p className="text-[10px] text-white/30">Developer Panel</p>
              </div>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10">
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { id: 'notifications' as const, label: 'Notifications', icon: Bell, count: unreadCount },
            { id: 'users' as const, label: 'All Users', icon: Users, count: allUsers.length },
            { id: 'email' as const, label: 'Email Status', icon: Mail, count: emailFailCount > 0 ? emailFailCount : null },
            { id: 'settings' as const, label: 'Email Setup', icon: Settings, count: null },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.count !== null && item.count !== undefined && (
                <span className={`ml-auto px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  item.count > 0 ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40'
                }`}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-white/5">
            <p className="text-[10px] text-white/30">Admin Email</p>
            <p className="text-xs text-white/60 truncate">{emailService.getConfig().ADMIN_EMAIL}</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <X className="w-5 h-5" /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/90 border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors flex-shrink-0">
                <Menu className="w-5 h-5 text-white/60" />
              </button>
              <h2 className="text-sm sm:text-base font-semibold text-white capitalize flex items-center gap-2 truncate">
                {activeTab === 'notifications' && <Bell className="w-5 h-5 text-amber-400 flex-shrink-0" />}
                {activeTab === 'users' && <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                {activeTab === 'email' && <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                {activeTab === 'settings' && <Settings className="w-5 h-5 text-violet-400 flex-shrink-0" />}
                <span className="truncate">{activeTab}</span>
              </h2>
            </div>
            {activeTab === 'notifications' && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => setNotifications(adminService.getNotifications())} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <RefreshCw className="w-4 h-4 text-white/50" />
                </button>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                    <CheckCheck className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900/50 p-4 sm:p-6">
          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: notifications.length, icon: Bell, color: 'from-blue-500 to-blue-700' },
                  { label: 'Unread', value: unreadCount, icon: Eye, color: 'from-red-500 to-red-700', pulse: true },
                  { label: 'Logins Today', value: todayNotifs, icon: LogIn, color: 'from-amber-500 to-amber-700' },
                  { label: 'New Signups', value: signupCount, icon: UserPlus, color: 'from-emerald-500 to-emerald-700' },
                ].map(stat => (
                  <div key={stat.label} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      {stat.pulse && unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/30">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: 'all' as const, label: `All (${notifications.length})` },
                  { key: 'login' as const, label: `🔔 Logins (${loginCount})` },
                  { key: 'signup' as const, label: `🆕 Signups (${signupCount})` },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                      filter === f.key ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                    }`}>{f.label}</button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Bell className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/50 mb-1">No notifications yet</p>
                  <p className="text-white/30 text-sm">User login/signup activity will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(notif => (
                    <div key={notif.id}
                      className={`glass-card rounded-xl p-4 transition-all cursor-pointer ${!notif.read ? 'border-l-2 border-l-amber-500' : 'opacity-60'} ${showDetail === notif.id ? 'bg-white/[0.05]' : ''}`}
                      onClick={() => { markRead(notif.id); setShowDetail(showDetail === notif.id ? null : notif.id); }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getBg(notif.type)}`}>{getIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notif.read ? 'text-white' : 'text-white/60'}`}>{notif.message}</p>
                            {!notif.read && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 ml-2" />}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-white/30 flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(notif.timestamp)}</span>
                            <span className="text-xs text-white/30 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(notif.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          {showDetail === notif.id && (
                            <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
                              <div><span className="text-white/30">User ID:</span> <span className="text-white/60 font-mono">{notif.userId}</span></div>
                              <div><span className="text-white/30">Email:</span> <span className="text-white/60 font-mono">{notif.userEmail}</span></div>
                              <div><span className="text-white/30">Type:</span> <span className="text-white/60 capitalize">{notif.type}</span></div>
                              <div><span className="text-white/30">Time:</span> <span className="text-white/60">{new Date(notif.timestamp).toLocaleString('en-IN')}</span></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <p className="text-sm text-white/40">{allUsers.filter((u: any) => !adminService.isAdmin(u.email)).length} registered users</p>
              <div className="space-y-2">
                {allUsers.filter((u: any) => !adminService.isAdmin(u.email)).map((user: any) => {
                  const userTrips = db.tripFindAll().filter((t: any) => t.members.includes(user._id));
                  return (
                    <div key={user._id} className="glass-card rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-white/[0.03] transition-all group" onClick={() => setViewProfileUserId(user._id)}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.avatar || 'from-blue-500 to-blue-700'} flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform flex-shrink-0`}>{user.name?.charAt(0) || '?'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors truncate">{user.name}</p>
                          {user.verified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0">✓</span>}
                        </div>
                        <p className="text-xs text-white/30 flex items-center gap-1 truncate"><Mail className="w-3 h-3 flex-shrink-0" /><span className="truncate">{user.email}</span></p>
                      </div>
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="text-xs text-white/40">{userTrips.length} trips</p>
                        <p className="text-xs text-white/30">{user.plan || 'free'} plan</p>
                      </div>
                      <UserCircle className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EMAIL STATUS TAB */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              {/* Email Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center"><Send className="w-5 h-5 text-white" /></div>
                    <div><p className="text-2xl font-bold text-white">{emailSuccessCount}</p><p className="text-xs text-white/30">Emails Sent</p></div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-white" /></div>
                    <div><p className="text-2xl font-bold text-white">{emailFailCount}</p><p className="text-xs text-white/30">Emails Failed</p></div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${emailService.isConfigured() ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-amber-500 to-amber-700'}`}>
                      {emailService.isConfigured() ? <CheckCircle className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
                    </div>
                    <div><p className="text-lg font-bold text-white">{emailService.isConfigured() ? 'Connected' : 'Not Set Up'}</p><p className="text-xs text-white/30">EmailJS Status</p></div>
                  </div>
                </div>
              </div>

              {/* Email Log */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" />Email Log</h3>
                  {emailLog.length > 0 && (
                    <button onClick={() => { emailService.clearEmailLog(); }} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Clear Log
                    </button>
                  )}
                </div>
                {emailLog.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No emails sent yet</p>
                    <p className="text-white/30 text-xs mt-1">Emails will be logged when users log in or sign up</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {emailLog.slice(0, 20).map((entry: any, i: number) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${entry.sent ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
                        {entry.sent ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/60 truncate">{entry.message}</p>
                          <p className="text-[10px] text-white/30">{entry.userEmail} • {timeAgo(entry.timestamp)}{entry.fallback ? ' • (Fallback — no EmailJS key)' : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS TAB — EmailJS Configuration */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              {/* Current Config Status */}
              <div className={`glass-card rounded-2xl p-5 border ${emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                    {emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId ? 'Configuration Active' : 'Configuration Incomplete'}
                    </p>
                    <p className="text-xs text-white/30">
                      {emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId
                        ? 'Using custom settings from saved configuration'
                        : 'Using default settings — enter your keys below'}
                    </p>
                  </div>
                </div>
                {/* Current Values */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    { label: 'Public Key', value: emailConfig.publicKey || '—', color: emailConfig.publicKey ? 'text-emerald-400' : 'text-white/30' },
                    { label: 'Service ID', value: emailConfig.serviceId || '—', color: emailConfig.serviceId ? 'text-emerald-400' : 'text-white/30' },
                    { label: 'Template ID', value: emailConfig.templateId || '—', color: emailConfig.templateId ? 'text-emerald-400' : 'text-white/30' },
                    { label: 'Admin Email', value: emailConfig.adminEmail || '—', color: emailConfig.adminEmail ? 'text-blue-400' : 'text-white/30' },
                  ].map(item => (
                    <div key={item.label} className="glass rounded-lg p-2.5">
                      <p className="text-[10px] text-white/40">{item.label}</p>
                      <p className={`text-xs font-mono truncate ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Card */}
              <div className="glass-card rounded-2xl p-6 border border-amber-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Set Up Email Notifications</h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-3">
                      Get real-time email alerts when users log in or sign up. We use <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1">EmailJS <ExternalLink className="w-3 h-3" /></a> — it's free for 200 emails/month.
                    </p>
                    <div className="space-y-2 text-xs text-white/40">
                      <p className="flex items-start gap-2"><span className="text-white/60 font-medium">1.</span> Sign up at <span className="text-amber-400">emailjs.com</span></p>
                      <p className="flex items-start gap-2"><span className="text-white/60 font-medium">2.</span> Connect your Gmail/Outlook as Email Service</p>
                      <p className="flex items-start gap-2"><span className="text-white/60 font-medium">3.</span> Create an Email Template</p>
                      <p className="flex items-start gap-2"><span className="text-white/60 font-medium">4.</span> Paste your 3 keys below and click Save</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Form */}
              <div className="glass-card rounded-2xl p-6 space-y-5">
                {/* Public Key */}
                <div>
                  <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-3 h-3" /> Public Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., user_abc123xyz"
                      value={emailConfig.publicKey}
                      onChange={e => setEmailConfig(p => ({ ...p, publicKey: e.target.value }))}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] text-sm font-mono transition-all"
                    />
                    <button onClick={() => copyToClipboard(emailConfig.publicKey)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Copy className="w-4 h-4 text-white/40" /></button>
                  </div>
                </div>

                {/* Service ID */}
                <div>
                  <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider flex items-center gap-2">
                    <Send className="w-3 h-3" /> Service ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., service_abc123"
                      value={emailConfig.serviceId}
                      onChange={e => setEmailConfig(p => ({ ...p, serviceId: e.target.value }))}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] text-sm font-mono transition-all"
                    />
                    <button onClick={() => copyToClipboard(emailConfig.serviceId)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Copy className="w-4 h-4 text-white/40" /></button>
                  </div>
                </div>

                {/* Template ID */}
                <div>
                  <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Template ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., template_abc123"
                      value={emailConfig.templateId}
                      onChange={e => setEmailConfig(p => ({ ...p, templateId: e.target.value }))}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] text-sm font-mono transition-all"
                    />
                    <button onClick={() => copyToClipboard(emailConfig.templateId)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Copy className="w-4 h-4 text-white/40" /></button>
                  </div>
                </div>

                {/* Admin Email */}
                <div>
                  <label className="text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">Admin Email (Receives Notifications)</label>
                  <input
                    type="email"
                    value={emailConfig.adminEmail}
                    onChange={e => setEmailConfig(p => ({ ...p, adminEmail: e.target.value }))}
                    placeholder="admin@traveltogether.in"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] text-sm font-mono transition-all"
                  />
                  <p className="text-[10px] text-white/30 mt-1">All notifications will be sent to this email</p>
                </div>

                {/* Save & Test */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={saveEmailConfig}
                    disabled={saveStatus === 'saving'}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      saveStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      saveStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      saveStatus === 'saving' ? 'bg-white/10 text-white/40' :
                      'btn-primary text-white'
                    }`}
                  >
                    {saveStatus === 'saving' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : saveStatus === 'success' ? (
                      <CheckCheck className="w-4 h-4" />
                    ) : (
                      <CheckCheck className="w-4 h-4" />
                    )}
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? '✅ Saved Successfully!' : 'Save Configuration'}
                  </button>
                  <button
                    onClick={resetConfig}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 text-xs font-medium transition-colors"
                    title="Reset to default values"
                  >
                    Reset
                  </button>
                  <button onClick={sendTestEmail} disabled={testEmailStatus === 'sending'}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      testEmailStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      testEmailStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      testEmailStatus === 'sending' ? 'bg-white/10 text-white/40' :
                      'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                    }`}>
                    {testEmailStatus === 'sending' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                     testEmailStatus === 'success' ? <CheckCircle className="w-4 h-4" /> :
                     testEmailStatus === 'error' ? <AlertCircle className="w-4 h-4" /> :
                     <Send className="w-4 h-4" />}
                    {testEmailStatus === 'sending' ? 'Sending...' : testEmailStatus === 'success' ? 'Sent!' : testEmailStatus === 'error' ? 'Failed' : 'Send Test'}
                  </button>
                </div>
              </div>

              {/* Template Variables */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white/70 mb-3">Email Template Variables</h3>
                <p className="text-xs text-white/40 mb-3">Use these in your EmailJS template:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['{{to_email}}', '{{subject}}', '{{message}}', '{{user_name}}', '{{user_email}}', '{{timestamp}}', '{{notification_type}}'].map(v => (
                    <div key={v} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                      <code className="text-xs text-amber-400 font-mono">{v}</code>
                      <button onClick={() => copyToClipboard(v)} className="p-1 rounded hover:bg-white/10 transition-colors"><Copy className="w-3 h-3 text-white/30" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* User Profile Modal for Admin */}
        {viewProfileUserId && (
          <UserProfileView
            targetUserId={viewProfileUserId}
            currentUser={{ _id: 'admin_001', name: 'Mohd Airaz', email: 'mohdairaz477@gmail.com', avatar: 'from-amber-500 to-orange-600', age: 25, location: 'India', bio: 'Admin', interests: [], travelStyle: [], budget: 'high' as any, pace: 'moderate' as any, verified: true, rating: 5.0, tripCount: 0, joinedAt: '2024-01-01', plan: 'nomad' as any, password: '' }}
            onClose={() => setViewProfileUserId(null)}
            onNavigate={() => {}}
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
}
