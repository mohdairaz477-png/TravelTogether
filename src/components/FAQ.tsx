import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How does the matching algorithm work?',
    answer: 'Our AI analyzes your travel preferences, interests, budget, pace, and personality traits to find compatible travel companions. We consider factors like activity level, accommodation style, dining preferences, and social energy. The more detailed your profile, the better the matches.',
  },
  {
    question: 'Is TravelTogether safe for solo travelers?',
    answer: 'Safety is our top priority. All profiles go through identity verification. We offer 24/7 in-app support, real-time location sharing with trusted contacts, SOS emergency features, and comprehensive insurance partnerships. Plus, you can read reviews from other travelers before committing.',
  },
  {
    question: 'What happens if I don\'t get along with my travel group?',
    answer: 'We encourage video introductions before trips so you can get a feel for the group. If things don\'t work out, our support team can help mediate or find alternative arrangements. We also have a flexible trip-switching policy for premium members.',
  },
  {
    question: 'Can I create my own trip and invite others?',
    answer: 'Absolutely! You can create custom trips, set your preferences, budget, and timeline, then invite others to join or let the matching algorithm find compatible travelers for you. You have full control over who joins.',
  },
  {
    question: 'How does expense splitting work?',
    answer: 'Our built-in expense tracker automatically logs shared costs and calculates each person\'s fair share. You can split evenly, proportionally, or by custom amounts. Settlements can be handled through the app or externally — it\'s your choice.',
  },
  {
    question: 'Do you organize group trips or just help people connect?',
    answer: 'Both! While our core service is connecting independent travelers, we also curate exclusive group trips with vetted local guides. These premium experiences include pre-planned itineraries, group discounts, and on-ground support.',
  },
  {
    question: 'Is there a free version?',
    answer: 'Yes! Our Explorer plan is completely free and lets you browse trips, create a profile, and use basic matching. Upgrade to Voyager or Nomad for unlimited access, advanced features, and premium tools.',
  },
  {
    question: 'Can I use TravelTogether for business travel?',
    answer: 'While our primary focus is leisure travel, many digital nomads and remote workers use our Nomad plan to find co-working companions and extend their work trips into adventures. We\'re also developing corporate travel features.',
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="reveal border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 py-5 sm:py-6 text-left group"
        aria-expanded={isOpen}
      >
        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-brand-500/20' : 'bg-white/5 group-hover:bg-white/10'
        }`}>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-400' : 'text-white/40'}`} />
        </div>
        <div className="flex-1 pr-4">
          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-brand-200 transition-colors">
            {faq.question}
          </h3>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-white/50 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden" aria-label="FAQ">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-brand-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <HelpCircle className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-white/70">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Common{' '}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Everything you need to know about TravelTogether. Can't find what you're looking for? 
            Reach out to our support team.
          </p>
        </div>

        {/* FAQ List */}
        <div className="reveal glass rounded-2xl px-6 sm:px-8">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
