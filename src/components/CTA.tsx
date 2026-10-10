import { ArrowRight, Plane, Sparkles, Users } from 'lucide-react';

function CTAForm() {
  const handleOpenAuth = () => window.dispatchEvent(new CustomEvent('open-auth'));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenAuth();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-8">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full sm:w-72 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50 focus:bg-white/[0.07] transition-all duration-300 text-sm"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="btn-primary group flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white w-full sm:w-auto justify-center whitespace-nowrap"
      >
        Join Now — It's Free
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </form>
  );
}

export default function CTA() {
  return (
    <section id="cta" className="relative py-24 sm:py-32 overflow-hidden" aria-label="Call to Action">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[200px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-coral-500/5 rounded-full blur-[100px]" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal">
          {/* Floating Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="animate-float">
              <div className="glass rounded-2xl p-3">
                <Plane className="w-6 h-6 text-brand-400" />
              </div>
            </div>
            <div className="animate-float-slow" style={{ animationDelay: '1s' }}>
              <div className="glass rounded-2xl p-3">
                <Users className="w-6 h-6 text-accent-400" />
              </div>
            </div>
            <div className="animate-float" style={{ animationDelay: '2s' }}>
              <div className="glass rounded-2xl p-3">
                <Sparkles className="w-6 h-6 text-coral-400" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Ready to find your
            <br />
            <span className="gradient-text">travel tribe?</span>
          </h2>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join 12,000+ travelers who've discovered that the best journeys aren't about the 
            destinations — they're about the people you share them with.
          </p>

          {/* CTA Form */}
          <CTAForm />

          <p className="text-xs text-white/30">
            No credit card required • Free forever plan available • Join in 30 seconds
          </p>

          {/* Social proof below CTA */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {['from-brand-400 to-brand-600', 'from-accent-400 to-warm-500', 'from-coral-400 to-coral-600', 'from-violet-400 to-violet-600', 'from-emerald-400 to-emerald-600'].map((gradient, i) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-slate-950`} />
              ))}
            </div>
            <p className="text-sm text-white/40">
              <span className="text-white/70 font-semibold">12,847 travelers</span> joined this month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
