import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#0A0A0A] overflow-hidden isolate">
      {/* Background Image with Parallax-like fixed attachment */}
      <div
        className="absolute inset-0 -z-10 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2671&auto=format&fit=crop')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed"
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-orange-500 uppercase mb-6">
            Our Philosophy
          </h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl mb-8">
            Fashion is more than just clothing.<br />
            <span className="text-gray-400 italic font-serif">It's a form of self-expression.</span>
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            We curate pieces that transcend seasons. Born from a love for timeless design and a commitment to sustainable quality,
            EliteWear is for those who dress to tell their own story.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-orange-500 hover:border-orange-500 transition-all duration-300 uppercase tracking-widest text-xs font-bold"
          >
            Read Full Story
          </Link>
        </motion.div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-white/10 hidden lg:block" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-white/10 hidden lg:block" />
    </section>
  );
}
