import { Check, Sparkles, Crown, Rocket, Shield } from 'lucide-react';

const plans = [
  {
    icon: Sparkles,
    name: 'Explorer',
    description: 'Perfect for casual travelers looking to connect.',
    price: 'Free',
    period: '',
    cta: 'Get Started',
    popular: false,
    features: [
      'Browse 3 trips per month',
      'Basic matching algorithm',
      'Profile creation',
      'Group chat access',
      'Community forum',
    ],
  },
  {
    icon: Crown,
    name: 'Voyager',
    description: 'For the committed traveler who wants the best.',
    price: '₹299',
    period: '/month',
    originalPrice: '₹599',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      'Unlimited trip browsing',
      'Advanced AI matching',
      'Verified profile badge',
      'Priority trip creation',
      'Expense splitting tools',
      'Collaborative itinerary planner',
      'Video call introductions',
      'Translation support',
    ],
  },
  {
    icon: Rocket,
    name: 'Nomad',
    description: 'Built for digital nomads and full-time travelers.',
    price: '₹799',
    period: '/month',
    cta: 'Start Free Trial',
    popular: false,
    features: [
      'Everything in Voyager',
      'Co-working trip matching',
      'Long-term stay planning',
      'Visa requirement alerts',
      'Tax & expense reports',
      'Dedicated community manager',
      'Early access to new features',
      'Annual retreat invitation',
      'API access',
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden" aria-label="Pricing">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Crown className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-white/70">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Choose your{' '}
            <span className="gradient-text">travel plan</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Start free and upgrade when you're ready. Every plan includes our core matching 
            technology and safety features. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal relative group ${
                plan.popular ? 'md:-mt-4 md:mb-[-16px]' : ''
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-xs font-bold text-white shadow-lg shadow-brand-500/30">
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`h-full rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] ${
                  plan.popular
                    ? 'glass-strong border-brand-500/30 glow-brand'
                    : 'glass hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${
                    plan.popular
                      ? 'bg-gradient-to-br from-brand-500 to-brand-700'
                      : 'bg-white/10'
                  } flex items-center justify-center`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-white/60'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-white/40">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    {plan.originalPrice && (
                      <span className="text-lg text-white/30 line-through mb-1">{plan.originalPrice}</span>
                    )}
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/40 mb-1">{plan.period}</span>
                  </div>
                </div>

                <a
                  href="#cta"
                  className={`btn-primary block text-center w-full py-3 rounded-xl text-sm font-semibold ${
                    plan.popular ? 'text-white' : 'text-white'
                  }`}
                >
                  {plan.cta}
                </a>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="reveal text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-white/50">
              30-day money-back guarantee • No contracts • Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


