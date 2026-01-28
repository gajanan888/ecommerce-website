import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiArrowRight, FiMail, FiFeather } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0A0A0A] text-white/40 border-t border-white/5 font-light overflow-hidden">
      {/* Editorial Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden w-full flex justify-center opacity-[0.02]">
        <span className="text-[20vw] font-black tracking-tighter text-white uppercase leading-none">
          ELITE
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Brand Manifesto */}
          <div className="col-span-2 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3 text-3xl font-black text-white tracking-tighter uppercase mb-8">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <FiFeather className="text-white" size={24} />
              </div>
              EliteWear
            </Link>
            <p className="max-w-sm text-sm leading-relaxed mb-12 uppercase tracking-widest font-bold text-white/20">
              Curated architectural silhouettes for the modern individual. We define style as a medium of empowerment and sustainable expression.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook, FiLinkedin].map((Icon, i) => (
                <button key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black transition-all duration-700">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Architecture */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8">Collections</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link to="/products?tag=new" className="hover:text-white transition-colors">New Specimens</Link></li>
              <li><Link to="/products?tag=bestsellers" className="hover:text-white transition-colors">Archive</Link></li>
              <li><Link to="/products?gender=women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/products?gender=men" className="hover:text-white transition-colors">Men</Link></li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8">Identity</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link to="/about" className="hover:text-white transition-colors">Manifesto</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Studio</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Ethics</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Lounge</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3">
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8">Protocol</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link to="/help" className="hover:text-white transition-colors">Assistance</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Logistics</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Closing Bar */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">
            &copy; {currentYear} EliteWear Lab. Architectural Fashion.
          </p>
          <div className="flex gap-8 items-center opacity-20 filter grayscale">
            <span className="text-[10px] font-black tracking-widest">AMEX</span>
            <span className="text-[10px] font-black tracking-widest">VISA</span>
            <span className="text-[10px] font-black tracking-widest">MASTERCARD</span>
            <span className="text-[10px] font-black tracking-widest">PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
