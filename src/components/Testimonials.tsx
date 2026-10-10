import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    avatar: 'from-orange-400 to-amber-600',
    role: 'Solo Traveller',
    rating: 5,
    text: 'Maine Goa trip ke liye TravelTogether use kiya aur itne amazing log mile! We split the cost of a beach villa and saved almost ₹8,000 each. Best experience ever. Ab har trip yahi se plan karti hoon! 🇮🇳',
    trip: 'Goa Beach Trip',
  },
  {
    name: 'Rahul Verma',
    location: 'Delhi, India',
    avatar: 'from-blue-400 to-indigo-600',
    role: 'Adventure Enthusiast',
    rating: 5,
    text: 'Ladakh bike trip was on my bucket list for years. Through this app, I found 5 riders who shared the same dates. We rode from Manali to Leh together — unforgettable! Cost was only ₹22,000 per person including bike rental. 🏍️',
    trip: 'Ladakh Bike Expedition',
  },
  {
    name: 'Ananya Iyer',
    location: 'Bangalore, India',
    avatar: 'from-green-400 to-emerald-600',
    role: 'Food Blogger',
    rating: 5,
    text: 'As a food blogger, Kerala backwaters trip was a dream. Found 3 other foodies on the app and we did an amazing houseboat experience + local food trail. Split the houseboat cost — just ₹4,500 per person! 🍛',
    trip: 'Kerala Backwaters',
  },
  {
    name: 'Marcus Chen',
    location: 'San Francisco, USA',
    avatar: 'from-sky-400 to-sky-600',
    role: 'Adventure Enthusiast',
    rating: 5,
    text: 'The cost savings alone are incredible — I saved over ₹1,50,000 on my Bali trip. But the real value? Finding people who push me to try things I never would have done solo. Best decision I ever made.',
    trip: 'Bali Adventure',
  },
  {
    name: 'Arjun Reddy',
    location: 'Hyderabad, India',
    avatar: 'from-red-400 to-rose-600',
    role: 'Tech Professional',
    rating: 5,
    text: 'Weekend trip to Rishikesh with strangers turned into the best weekend of my life! River rafting, Beatles Ashram, and amazing Maggi at the campsite. Total cost was just ₹6,500 including transport from Delhi. 🧘‍♂️',
    trip: 'Rishikesh Weekend',
  },
  {
    name: 'Elena Rodriguez',
    location: 'Barcelona, Spain',
    avatar: 'from-violet-400 to-violet-600',
    role: 'Solo Traveler',
    rating: 5,
    text: 'I was nervous about traveling to Japan alone. Through TravelTogether, I found three amazing people who shared my love of food and temples. We became best friends and planned a trip to Korea together!',
    trip: 'Japan & Korea Trip',
  },
  {
    name: 'Sneha Patel',
    location: 'Ahmedabad, India',
    avatar: 'from-pink-400 to-pink-600',
    role: 'Photographer',
    rating: 5,
    text: 'Jaipur heritage trip with 4 other women was absolutely magical! We explored Amer Fort, haggled in Johari Bazaar, and ate the best dal baati. Each spent just ₹9,000 for 3 days. Perfect girls trip! 📸',
    trip: 'Jaipur Heritage Tour',
  },
  {
    name: 'Vikram Singh',
    location: 'Chandigarh, India',
    avatar: 'from-teal-400 to-teal-600',
    role: 'Corporate Professional',
    rating: 5,
    text: 'Used this app for my first international trip — Bangkok with 6 other Indians! We had Indian vegetarian food available, split the hotel, and explored together. Total budget was ₹35,000 for 5 days including flights! 🛕',
    trip: 'Bangkok Explorer',
  },
  {
    name: 'Sarah & Tom',
    location: 'London, UK',
    avatar: 'from-rose-400 to-rose-600',
    role: 'Couple Travelers',
    rating: 5,
    text: 'As a couple, we worried about fitting in with groups. The platform matched us with another couple who shared our love of slow travel and local experiences. Two years later, we\'re still in touch!',
    trip: 'Italian Countryside',
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-500 hover:scale-[1.02]">
      <Quote className="w-8 h-8 text-brand-500/20 mb-4" />
      <p className="text-white/70 text-sm leading-relaxed mb-6">"{testimonial.text}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.avatar}`} />
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-white/40">{testimonial.location} • {testimonial.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
        <div className="flex">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <span className="text-xs text-white/30">{testimonial.trip}</span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden" aria-label="Testimonials">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-white/70">Loved by Travelers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Stories from our{' '}
            <span className="gradient-text">travel community</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Real experiences from real travelers — from Indian backpackers to global adventurers — 
            who found their perfect companions and created memories that last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, i) => (
            <div key={testimonial.name} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
