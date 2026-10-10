import { useState, useEffect } from 'react';
import {
  Compass, Users, MessageSquare, UserCircle,
  LogOut, Menu, Bell, ChevronLeft, ChevronRight, Sparkles, MapPin, Heart
} from 'lucide-react';
import { db } from './services/db';
import type { User as UserType } from './services/db';
import type { Location } from './services/locations';
import { adminService } from './services/locations';
import { connectionService } from './services/connectionService';
import AdminPanel from './components/App/AdminPanel';
import ConnectionRequests from './components/App/ConnectionRequests';
import UserProfileView from './components/App/UserProfileView';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Features from './components/Features';
import ProductShowcase from './components/ProductShowcase';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthModal from './components/App/AuthModal';
// Dashboard removed
import TripsView from './components/App/Trips';
import MatchesView from './components/App/Matches';
import Chat from './components/App/Chat';
import ProfileView from './components/App/Profile';
import LocationSelector from './components/App/LocationSelector';
import ScrollToTop from './components/ScrollToTop';

type View = 'trips' | 'matches' | 'chat' | 'profile' | 'locations' | 'connections';

function ScrollRevealObserver() {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

const viewNames: Record<View, string> = {
  trips: 'Explore Trips',
  matches: 'Find Matches',
  chat: 'Messages',
  profile: 'My Profile',
  locations: 'Destinations',
  connections: 'Connection Requests',
};

// ====== APP VIEW ======
function AppView({ user, onLogout, unreadNotifs }: { user: UserType; onLogout: () => void; unreadNotifs: number }) {
  const [currentView, setCurrentView] = useState<View>('locations');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewProfileUserId, setViewProfileUserId] = useState<string | null>(null);
  const [isAdminViewing, setIsAdminViewing] = useState(false);

  const openUserProfile = (userId: string, asAdmin = false) => {
    setViewProfileUserId(userId);
    setIsAdminViewing(asAdmin);
  };

  const pendingRequests = user ? connectionService.getReceivedRequests(user._id).length : 0;

  const navItems = [
    { id: 'locations' as View, label: 'Destinations', icon: MapPin, gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/25', badge: 0 },
    { id: 'trips' as View, label: 'Explore Trips', icon: Compass, gradient: 'from-violet-500 to-purple-700', glow: 'shadow-violet-500/25', badge: 0 },
    { id: 'matches' as View, label: 'Find Matches', icon: Users, gradient: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/25', badge: 0 },
    { id: 'connections' as View, label: 'Requests', icon: Heart, gradient: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/25', badge: pendingRequests },
    { id: 'chat' as View, label: 'Messages', icon: MessageSquare, gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/25', badge: 3 },
    { id: 'profile' as View, label: 'My Profile', icon: UserCircle, gradient: 'from-indigo-500 to-blue-700', glow: 'shadow-indigo-500/25', badge: 0 },
  ];

  const handleLocationSelect = (_location: Location) => {
    setCurrentView('trips');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-40 h-screen transition-all duration-500 ease-out flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-[72px]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border-r border-white/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.03] via-transparent to-purple-600/[0.03]" />

        <div className="relative flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center gap-3 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                Travel<span className="text-blue-400">Together</span>
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-3 space-y-1.5">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${item.glow}`
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && sidebarOpen && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b ${item.gradient}`} />
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-all ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                    {item.label}
                  </span>
                  {item.badge > 0 && sidebarOpen && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t border-white/5 space-y-2">
            {/* User Info */}
            <div className={`flex items-center gap-3 ${sidebarOpen ? 'px-2' : 'justify-center'} py-2`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex-shrink-0 shadow-lg flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-white/30 truncate capitalize">{user.plan} plan</p>
              </div>
            </div>

            {/* Upgrade */}
            {user.plan === 'free' && sidebarOpen && (
              <button className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:from-amber-500/20 hover:to-orange-500/20 transition-all flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Upgrade to Voyager
              </button>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-white/10 transition-colors group">
                {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" /> : <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />}
              </button>
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors">
                <Menu className="w-5 h-5 text-white/50" />
              </button>
              <h2 className="text-base font-semibold text-white">{viewNames[currentView]}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group border border-white/5">
                <Bell className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[9px] font-bold text-white flex items-center justify-center border-2 border-slate-950 shadow-lg shadow-red-500/30">{unreadNotifs || '!'}</span>
              </button>
              <button onClick={() => setCurrentView('profile')} className={`w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-white font-bold text-sm`}>
                {user.name.charAt(0)}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-900/50">
          {currentView === 'locations' && <LocationSelector userId={user._id} onSelect={handleLocationSelect} />}
          {currentView === 'trips' && <TripsView user={user} onCreateTrip={() => {}} onViewProfile={(id) => openUserProfile(id)} />}
          {currentView === 'matches' && <MatchesView user={user} onNavigate={setCurrentView} onViewProfile={(id) => openUserProfile(id)} />}
          {currentView === 'connections' && <ConnectionRequests userId={user._id} onNavigate={() => setCurrentView('chat')} onViewProfile={(id) => openUserProfile(id)} />}
          {currentView === 'chat' && <Chat user={user} onViewProfile={(id) => openUserProfile(id)} onNavigate={(view) => setCurrentView(view)} />}
          {currentView === 'profile' && <ProfileView user={user} onUpdate={() => {}} onViewProfile={(id) => openUserProfile(id)} />}
        </main>

        {/* User Profile Modal */}
        {viewProfileUserId && (
          <UserProfileView
            targetUserId={viewProfileUserId}
            currentUser={user}
            onClose={() => setViewProfileUserId(null)}
            onNavigate={(view) => { setViewProfileUserId(null); setCurrentView(view); }}
            isAdmin={isAdminViewing}
          />
        )}
      </div>
    </div>
  );
}

// ====== MAIN APP ======
export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    db.init();
    const stored = db.authGetCurrentUser();
    if (stored) {
      setCurrentUser(stored);
      setIsAdmin(adminService.isAdmin(stored.email));
    }
    setUnreadNotifs(adminService.getUnreadCount());

    const handleOpenAuth = () => setShowAuth(true);
    window.addEventListener('open-auth', handleOpenAuth);
    // Refresh unread count every 5 seconds
    const interval = setInterval(() => setUnreadNotifs(adminService.getUnreadCount()), 5000);
    return () => {
      window.removeEventListener('open-auth', handleOpenAuth);
      clearInterval(interval);
    };
  }, []);

  const handleAuth = (user: UserType, password?: string) => {
    setCurrentUser(user);
    // Only grant admin access if email matches AND password is correct
    const isAdminEmail = adminService.isAdmin(user.email);
    const isAdminPassword = password === adminService.ADMIN_PASSWORD;
    setIsAdmin(isAdminEmail && isAdminPassword);
    setShowAuth(false);
    setUnreadNotifs(adminService.getUnreadCount());
    console.log('[Auth] Login successful:', { user: user.name, isAdmin: isAdminEmail && isAdminPassword });
  };

  const handleLogout = () => {
    db.authLogout();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  // If admin is logged in, show AdminPanel
  if (isAdmin && currentUser) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ScrollRevealObserver />
      {currentUser ? (
        <AppView user={currentUser} onLogout={handleLogout} unreadNotifs={unreadNotifs} />
      ) : (
        <>
          <Navbar />
          <Hero />
          <SocialProof />
          <Features />
          <ProductShowcase />
          <Benefits />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CTA />
          <Footer />
        </>
      )}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onAuth={handleAuth} />
      <ScrollToTop />
    </div>
  );
}
