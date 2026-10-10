import { ArrowRight, Users, MapPin, Globe, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" aria-label="Hero">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-slate-950">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coral-500/10 rounded-full blur-[150px] animate-pulse-glow" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black_20%,transparent_70%)]" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[10%] animate-float opacity-30">
          <div className="glass rounded-2xl p-3">
            <MapPin className="w-6 h-6 text-brand-400" />
          </div>
        </div>
        <div className="absolute top-[25%] right-[12%] animate-float-slow opacity-30" style={{ animationDelay: '2s' }}>
          <div className="glass rounded-2xl p-3">
            <Globe className="w-6 h-6 text-accent-400" />
          </div>
        </div>
        <div className="absolute bottom-[20%] left-[15%] animate-float opacity-30" style={{ animationDelay: '4s' }}>
          <div className="glass rounded-2xl p-3">
            <Users className="w-6 h-6 text-coral-400" />
          </div>
        </div>
        <div className="absolute bottom-[30%] right-[8%] animate-float-slow opacity-30" style={{ animationDelay: '1s' }}>
          <div className="glass rounded-2xl p-3">
            <Sparkles className="w-6 h-6 text-brand-300" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float" style={{ animationDuration: '4s' }}>
          <Sparkles className="w-4 h-4 text-accent-400" />
          <span className="text-sm font-medium text-white/80">
            12,000+ travelers already connected
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="block text-white">Never Travel</span>
          <span className="gradient-text">Alone Again</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Find your perfect travel companions. Match with like-minded explorers, 
          split costs, share experiences, and create unforgettable memories — 
          all in one beautiful platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth'))}
            className="btn-primary group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <a
            href="#how-it-works"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white/70 hover:text-white glass hover:bg-white/10 transition-all duration-300"
          >
            See How It Works
          </a>
        </div>

        {/* Hero Visual - Floating Cards */}
        <div className="relative max-w-3xl mx-auto">
          <div className="glass-strong rounded-3xl p-1 glow-brand">
            <div className="rounded-[22px] bg-gradient-to-br from-slate-900/80 to-slate-800/80 overflow-hidden">
              {/* Mock App UI */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="flex-1" />
                  <div className="text-xs text-white/40 font-mono">travel-together.app</div>
                </div>

                {/* Trip Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { dest: 'Goa, India', date: 'Mar 15-20', color: 'from-orange-600 to-orange-400', emoji: '🏖️', type: '🇮🇳 In Country' },
                    { dest: 'Ladakh, India', date: 'Apr 2-10', color: 'from-emerald-500 to-emerald-700', emoji: '🏍️', type: '🇮🇳 In Country' },
                    { dest: 'Tokyo, Japan', date: 'May 5-14', color: 'from-coral-500 to-coral-400', emoji: '🌸', type: '✈️ Abroad' },
                  ].map((trip, i) => (
                    <div
                      key={trip.dest}
                      className="glass rounded-2xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group"
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trip.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                        {trip.emoji}
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-semibold text-white">{trip.dest}</h3>
                      </div>
                      <p className="text-xs text-white/50">{trip.date}</p>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${trip.type.includes('Country') ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {trip.type}
                      </span>
                      <div className="flex -space-x-2 mt-3">
                        {[0,1,2,3].map((j) => (
                          <div key={j} className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 border-2 border-slate-900" />
                        ))}
                      </div>
                      <p className="text-xs text-brand-400 mt-2 font-medium">+6 going</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect behind */}
          <div className="absolute -inset-4 bg-brand-500/10 rounded-[2rem] blur-3xl -z-10" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
