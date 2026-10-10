import { PiggyBank, Clock, Globe, ShieldCheck, Camera, Zap } from 'lucide-react';

const benefits = [
  {
    icon: PiggyBank,
    title: 'Save Up to 40%',
    description: 'Split accommodations, transport, and group activities. Travel further for less with shared costs.',
    stat: '40%',
    statLabel: 'Average Savings',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: Clock,
    title: 'Save Planning Time',
    description: 'Let others share the research burden. Split itinerary planning, find hidden gems through local knowledge.',
    stat: '8hrs',
    statLabel: 'Avg. Time Saved / Trip',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: Globe,
    title: 'Visit More Places',
    description: 'Travelers who journey with others visit 3x more destinations. Share the journey, double the experiences.',
    stat: '3x',
    statLabel: 'More Destinations',
    color: 'from-accent-500 to-warm-500',
  },
  {
    icon: ShieldCheck,
    title: 'Travel Safer',
    description: 'There\'s safety in numbers. Our community provides support, local insights, and 24/7 emergency features.',
    stat: '99%',
    statLabel: 'Safety Rating',
    color: 'from-violet-500 to-violet-700',
  },
  {
    icon: Camera,
    title: 'Capture Memories',
    description: 'Always have someone to take your best photos. Shared experiences create stories you\'ll tell for years.',
    stat: '5x',
    statLabel: 'More Photos Shared',
    color: 'from-coral-500 to-coral-700',
  },
  {
    icon: Zap,
    title: 'Instant Friends',
    description: 'Join a trip alone, leave with lifelong friends. 92% of our users say they\'d travel with their group again.',
    stat: '92%',
    statLabel: 'Would Reunite',
    color: 'from-sky-500 to-sky-700',
  },
];

export default function Benefits() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" aria-label="Benefits">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coral-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Zap className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-white/70">Why Travel Together</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            The smarter way to{' '}
            <span className="gradient-text">see the world</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Group travel isn't just more fun — it's smarter, safer, and more affordable. 
            Here's what makes traveling with others a game-changer.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className="reveal group relative glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{benefit.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold gradient-text">{benefit.stat}</span>
                    <span className="text-xs text-white/40 font-medium">{benefit.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
