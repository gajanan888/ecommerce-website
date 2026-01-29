import React from 'react';
import { FiTruck, FiRefreshCw, FiShield, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const trustItems = [
  { icon: FiTruck, text: 'Free Worldwide Shipping' },
  { icon: FiRefreshCw, text: '30-Day Easy Returns' },
  { icon: FiShield, text: 'Secure Payment Processing' },
  { icon: FiCheckCircle, text: 'Authentic Luxury Brands' },
];

export default function TrustSection() {
  return (
    <section className="w-full bg-[#0A0A0A] py-8 overflow-hidden relative">
      <div className="flex select-none">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 20,
          }}
          className="flex gap-16 items-center whitespace-nowrap text-gray-400 text-xs font-medium tracking-[0.2em] uppercase px-8"
        >
          {[...trustItems, ...trustItems, ...trustItems, ...trustItems].map(
            (item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <item.icon size={14} className="text-white" />
                <span>{item.text}</span>
              </div>
            )
          )}
        </motion.div>
        {/* Duplicate for seamless loop if needed, though the map above handles repeat */}
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 20,
          }}
          className="flex gap-16 items-center whitespace-nowrap text-gray-400 text-xs font-medium tracking-[0.2em] uppercase px-8"
        >
          {[...trustItems, ...trustItems, ...trustItems, ...trustItems].map(
            (item, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-3">
                <item.icon size={14} className="text-white" />
                <span>{item.text}</span>
              </div>
            )
          )}
        </motion.div>
      </div>
      {/* Gradient masks for smooth fade */}
      <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
    </section>
  );
}
