import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function Hero() {
  const navigate = useNavigate();
  const [isHoveringPrimary, setIsHoveringPrimary] = useState(false);
  const [isHoveringSecondary, setIsHoveringSecondary] = useState(false);

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen bg-[#0A0A0A] overflow-hidden flex items-center justify-center perspective-2000 noise-bg"
    >
      {/* 1. Deep Background - Large Outlined Typography */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateZ: -200,
          transformStyle: 'preserve-3d',
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 translate-y-20"
      >
        <h1 className="text-[25vw] font-black text-stroke tracking-tighter leading-none animate-text-sheen">
          ELITE
        </h1>
      </motion.div>

      {/* 2. Mid Layer - The 3D Aperture Portal */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateZ: 50,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 w-[60vh] h-[60vh] rounded-full overflow-hidden border-[12px] border-white/5 shadow-[0_0_100px_rgba(255,255,255,0.05)] cursor-pointer group translate-y-20"
      >
        {/* Internal Image with Inverse Parallax */}
        <motion.img
          src="/images/hero-best.png"
          alt="Designer Aesthetic"
          style={{
            x: useTransform(x, [-0.5, 0.5], [40, -40]),
            y: useTransform(y, [-0.5, 0.5], [40, -40]),
            scale: 1.15,
          }}
          className="w-full h-full object-cover grayscale-[0.2] transition-colors duration-700 group-hover:grayscale-0"
        />

        {/* Soft Glow inside Circle */}
        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none" />
      </motion.div>

      {/* 3. Foreground - Interactive Floating Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none translate-y-20">
        <motion.div
          style={{
            rotateX,
            rotateY,
            translateZ: 150,
            transformStyle: 'preserve-3d',
          }}
          className="text-center"
        >
          <motion.h2
            style={{ translateZ: 50 }}
            className="text-white text-6xl md:text-8xl font-black tracking-[-0.04em] mb-4 uppercase"
          >
            BE <span className="text-orange-500">ICONIC.</span>
          </motion.h2>

          <motion.div
            style={{ translateZ: 30 }}
            className="flex items-center justify-center gap-8 text-white/40 text-xs font-black tracking-[0.5em] uppercase"
          >
            <span>High Fashion</span>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <span>Digital Grade</span>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. UI Layer - Minimalist Navigation & CTA */}
      <div className="absolute bottom-12 left-0 w-full px-12 flex justify-between items-end z-30">
        <div className="space-y-4">
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase max-w-[150px]">
            Redefining the digital wardrobe for the next generation of
            trendsetters.
          </p>
          <div className="flex gap-4">
            <div className="w-12 h-[1px] bg-white/20 mt-2"></div>
            <span className="text-white text-[10px] font-black uppercase">
              Est. 2026
            </span>
          </div>
        </div>

        <motion.button
          onClick={() => navigate('/products')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto px-12 py-4 bg-white text-black font-black text-sm rounded-full flex items-center gap-3 hover:bg-orange-500 hover:text-white transition-colors duration-500"
        >
          DISCOVER COLLECTION
          <FiArrowRight size={20} />
        </motion.button>
      </div>

      {/* Side Label - 3D Floating */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateZ: 80,
          transformStyle: 'preserve-3d',
        }}
        className="absolute top-1/2 left-12 -translate-y-1/2 hidden lg:block select-none pointer-events-none"
      >
        <p className="origin-left -rotate-90 text-white/10 text-4xl font-black uppercase tracking-tighter">
          AESTHETIC NOIR
        </p>
      </motion.div>
    </section>
  );
}
