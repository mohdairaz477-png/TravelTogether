import { Users, Shield, Globe2, Map, Wallet, MessageCircle, Calendar, Heart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Smart Matching',
    description: 'Our AI algorithm matches you with travelers who share your interests, budget, and pace. Find your perfect adventure buddy.',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'Every traveler is identity-verified and reviewed. Travel with confidence knowing your companions are genuine and trustworthy.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: Globe2,
    title: 'Global Community',
    description: 'Connect with adventurers from 85+ countries. Whether you\'re heading to Bali or Barcelona, find locals and fellow travelers.',
    color: 'from-accent-500 to-warm-500',
  },
  {
    icon: Map,
    title: 'Trip Planning',
    description: 'Collaborative itineraries, shared bookmarks, and real-time sync. Plan your dream trip together with built-in tools.',
    color: 'from-coral-500 to-coral-700',
  },
  {
    icon: Wallet,
    title: 'Split Costs',
    description: 'Transparent expense tracking and automatic splitting. No more awkward money conversations — just seamless sharing.',
    color: 'from-violet-500 to-violet-700',
  },
  {
    icon: MessageCircle,
    title: 'Group Chat',
    description: 'Built-in messaging with translation support. Communicate effortlessly with travelers from any country.',
    color: 'from-sky-500 to-sky-700',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Open trips, flexible dates, last-minute plans — find adventures that fit your schedule, however spontaneous you are.',
    color: 'from-pink-500 to-pink-700',
  },
  {
    icon: Heart,
    title: 'Safety First',
    description: '24/7 support, emergency contacts, real-time location sharing, and SOS features. Your safety is our top priority.',
    color: 'from-rose-500 to-rose-700',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden" aria-label="Features">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-accent-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-white/70">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Everything you need to{' '}
            <span className="gradient-text">travel together</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            From finding the right travel buddies to splitting costs and planning itineraries — 
            we've built every tool to make group travel effortless and joyful.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="reveal group relative glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-default"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent" />

              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
