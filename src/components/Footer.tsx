import { Compass, Send, Heart, Briefcase, AtSign, Code } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'How It Works', 'Mobile App', 'API'],
  Community: ['Blog', 'Forum', 'Events', 'Ambassadors', 'Success Stories'],
  Company: ['About Us', 'Careers', 'Press Kit', 'Contact', 'Partners'],
  Support: ['Help Center', 'Safety', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

const socialLinks = [
  { icon: Send, label: 'Twitter / X', href: '#' },
  { icon: Heart, label: 'Instagram', href: '#' },
  { icon: Briefcase, label: 'LinkedIn', href: '#' },
  { icon: AtSign, label: 'Email', href: '#' },
  { icon: Code, label: 'GitHub', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-500/30 transition-all duration-300">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Travel<span className="text-brand-400">Together</span>
              </span>
            </a>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Find your perfect travel companions and explore the world together.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white/70 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white/70 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} TravelTogether. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/30">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
