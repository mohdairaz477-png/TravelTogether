import { Search, UserPlus, Plane, HeartHandshake } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Discover Trips',
    description: 'Browse upcoming trips by destination, dates, or travel style. Filter by budget, activity level, and group size.',
    color: 'from-brand-500 to-brand-700',
    visual: (
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-lg">🌴</div>
          <div>
            <p className="text-sm font-semibold text-white">Bali Adventure</p>
            <p className="text-xs text-white/40">15 Mar - 25 Mar • ₹35,000</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-warm-500 flex items-center justify-center text-lg">🏔️</div>
          <div>
            <p className="text-sm font-semibold text-white">Swiss Alps Trek</p>
            <p className="text-xs text-white/40">2 Apr - 10 Apr • ₹55,000</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-700 flex items-center justify-center text-lg">🌸</div>
          <div>
            <p className="text-sm font-semibold text-white">Tokyo Explorer</p>
            <p className="text-xs text-white/40">5 May - 14 May • ₹45,000</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: UserPlus,
    step: '02',
    title: 'Match & Connect',
    description: 'Get matched with compatible travelers. Chat, video call, and decide if the vibe is right before committing.',
    color: 'from-emerald-500 to-emerald-700',
    visual: (
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Sarah M.</p>
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">95% Match</span>
            </div>
            <p className="text-xs text-white/40">Adventure lover • 28 trips • ⭐ 4.9</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">James K.</p>
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">88% Match</span>
            </div>
            <p className="text-xs text-white/40">Foodie explorer • 41 trips • ⭐ 4.8</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Plane,
    step: '03',
    title: 'Plan Together',
    description: 'Build your itinerary collaboratively with shared boards, budget tracking, and real-time messaging.',
    color: 'from-accent-500 to-warm-500',
    visual: (
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex gap-2 mb-4">
          {['Day 1', 'Day 2', 'Day 3', 'Day 4'].map((day, i) => (
            <div key={day} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i === 0 ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-white/40'}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5" />
            <div>
              <p className="text-sm text-white/80">Arrive at Ngurah Rai Airport</p>
              <p className="text-xs text-white/30">10:00 AM • Pickup arranged</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent-400 mt-1.5" />
            <div>
              <p className="text-sm text-white/80">Sunset at Tanah Lot Temple</p>
              <p className="text-xs text-white/30">5:30 PM • Group dinner after</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-coral-400 mt-1.5" />
            <div>
              <p className="text-sm text-white/80">Rice Terrace Morning Walk</p>
              <p className="text-xs text-white/30">7:00 AM • Bring camera!</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: HeartHandshake,
    step: '04',
    title: 'Travel & Bond',
    description: 'Experience the world with people who share your passion. Create lifelong friendships along the way.',
    color: 'from-coral-500 to-coral-700',
    visual: (
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 p-4 text-center">
            <p className="text-2xl font-bold text-brand-400">8</p>
            <p className="text-xs text-white/40">New Friends Made</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-accent-500/20 to-warm-500/20 p-4 text-center">
            <p className="text-2xl font-bold text-accent-400">15</p>
            <p className="text-xs text-white/40">Memories Created</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-coral-500/20 to-coral-700/20 p-4 text-center">
            <p className="text-2xl font-bold text-coral-400">₹12,000</p>
            <p className="text-xs text-white/40">Saved on Costs</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">⭐ 5.0</p>
            <p className="text-xs text-white/40">Group Rating</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function ProductShowcase() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden" aria-label="How It Works">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Plane className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-white/70">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Four steps to your next{' '}
            <span className="gradient-text">adventure</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            From discovery to departure — our streamlined process makes finding travel companions 
            effortless. Your next adventure is just four steps away.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16 sm:space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`reveal flex flex-col ${
                i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-10 lg:gap-16`}
            >
              {/* Visual */}
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <div className={`absolute -inset-3 bg-gradient-to-br ${step.color} opacity-10 rounded-3xl blur-2xl`} />
                  {step.visual}
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-white/30 font-mono tracking-widest">STEP {step.step}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-white/50 leading-relaxed text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
