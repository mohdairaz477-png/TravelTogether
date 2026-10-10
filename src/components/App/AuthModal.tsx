
import { db } from '../../services/db';
import { useState } from 'react';
import {
  X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Globe2
} from 'lucide-react';
import { loginWithMongoDB, registerWithMongoDB } from "../../../frontend/api";
import { emailService } from '../../services/emailService';
import type { User as UserType } from '../../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: UserType, password?: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    let result;

    if (isLogin) {
      result = await loginWithMongoDB({
        email: formData.email,
        password: formData.password,
      });
    } else {
      result = await registerWithMongoDB({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      emailService.sendNotification({
        type: 'signup',
        userName: formData.name,
        userEmail: formData.email,
        message: `New user registered: ${formData.name} (${formData.email})`,
        timestamp: new Date().toISOString(),
      }).catch(err => console.error('[Email] Signup notification failed:', err));

      emailService.sendWelcomeEmail({
        userName: formData.name,
        userEmail: formData.email,
        type: 'welcome_signup',
        timestamp: new Date().toISOString(),
      }).catch(err => console.error('[Welcome Email] Failed:', err));
    }

    const apiUser = result.user;
    localStorage.setItem("authToken", result.token);

    const user = {
      ...apiUser,
      _id: apiUser.id,
      avatar: 'from-violet-400 to-blue-600',
      age: 25,
      location: '',
      bio: '',
      interests: [],
      travelStyle: [],
      budget: 'medium',
      pace: 'moderate',
      plan: 'free',
      verified: false,
      rating: 0,
      tripCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    } as UserType;

    onAuth(user, formData.password);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Something went wrong. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-violet-500/20 rounded-full blur-[80px]" />

      <div className="relative glass-card rounded-3xl w-full max-w-md overflow-hidden animate-bounce-in">
        {/* Gradient top bar */}
        <div className="h-1.5 animated-gradient" />

        <div className="p-8">
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/40" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl animated-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Welcome Back!' : 'Join the Adventure'}
            </h2>
            <p className="text-sm text-white/50 flex items-center justify-center gap-1">
              <Globe2 className="w-3.5 h-3.5" />
              {isLogin ? 'Sign in to find your travel companions' : 'Join 12,000+ travelers worldwide'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 animate-bounce-in">
              <span className="text-sm">⚠️</span>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm"
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-white/40 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or try demo</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo credentials */}
          {/* Demo credentials */}
          <button
            onClick={() => {
              setFormData({ name: '', email: 'elena@example.com', password: 'password123', confirmPassword: '' });
              setIsLogin(true);
              setError('');
            }}
            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-xs">elena@example.com</span>
            <span className="text-white/20">/</span>
            <span className="font-mono text-xs">password123</span>
          </button>

        </div>
      </div>
    </div>
  );
}
