import { Star, Users } from 'lucide-react';

const partners = [
  'Lonely Planet', 'National Geographic', 'Condé Nast', 'Travel + Leisure', 'AFAR', 'Rough Guides'
];

const stats = [
  { value: '12K+', label: 'Active Travelers' },
  { value: '85+', label: 'Countries' },
  { value: '50K+', label: 'Trips Matched' },
  { value: '4.9', label: 'App Rating', icon: true },
];

export default function SocialProof() {
  return (
    <section className="relative py-20 overflow-hidden" aria-label="Social Proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="reveal glass rounded-2xl p-6 text-center hover:bg-white/[0.07] transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                {stat.value}
                {stat.icon && <Star className="w-5 h-5 inline text-accent-400 ml-1" />}
              </div>
              <p className="text-sm text-white/50 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trusted By / As Seen In */}
        <div className="reveal text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="w-5 h-5 text-white/40" />
            <p className="text-sm text-white/40 font-medium tracking-widest uppercase">
              Trusted by travelers worldwide
            </p>
          </div>

          {/* Marquee */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />

            <div className="flex animate-marquee">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={`${partner}-${i}`}
                  className="flex-shrink-0 mx-8 sm:mx-12 text-white/20 font-bold text-lg sm:text-xl tracking-wide hover:text-white/40 transition-colors duration-300 whitespace-nowrap"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
