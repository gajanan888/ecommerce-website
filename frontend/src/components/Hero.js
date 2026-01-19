import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [isHoveringPrimary, setIsHoveringPrimary] = useState(false);
  const [isHoveringSecondary, setIsHoveringSecondary] = useState(false);

  const handleFloatingCardClick = () => {
    const newArrivalsSection = document.getElementById('new-arrivals');
    if (newArrivalsSection) {
      newArrivalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full h-screen md:h-[90vh] bg-white overflow-hidden flex flex-col">
      {/* Background Gradient Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-gray-50 blur-3xl opacity-40 will-change-transform"></div>
      </div>

      {/* Main Container - Stable flex layout */}
      <div className="relative flex flex-col items-stretch justify-between flex-1 min-h-0 md:flex-row">
        {/* Mobile Image - Visible only on mobile */}
        <div className="flex-shrink-0 w-full h-64 overflow-hidden bg-gray-200 md:hidden">
          <img
            src="https://images.unsplash.com/photo-1485527073994-bc71cbf266f7?w=600&h=400&fit=crop"
            alt="Fashion Model"
            className="object-cover w-full h-full will-change-transform"
          />
        </div>

        {/* Left Column - Content */}
        <div className="flex flex-col justify-center flex-1 w-full min-h-0 px-6 py-8 md:w-1/2 sm:px-8 md:px-12 lg:px-16 md:py-0 md:h-full">
          {/* Badge */}
          <div className="inline-flex items-center flex-shrink-0 gap-2 mb-6 md:mb-8 w-fit">
            <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase whitespace-nowrap">
              New Season Collection
            </span>
            <div className="flex-shrink-0 w-1 h-1 bg-gray-800 rounded-full"></div>
          </div>

          {/* Headline */}
          <h1 className="flex-shrink-0 mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl md:mb-8">
            Redefine Your
            <br />
            Style
          </h1>

          {/* Subheading */}
          <p className="flex-shrink-0 max-w-lg mb-8 text-lg font-light leading-relaxed text-gray-600 sm:text-xl md:mb-12">
            Discover trend-forward fashion crafted for confidence and comfort.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col flex-shrink-0 gap-4 mb-6 sm:flex-row md:gap-6 md:mb-8">
            {/* Primary CTA */}
            <button
              onClick={() => navigate('/products')}
              onMouseEnter={() => setIsHoveringPrimary(true)}
              onMouseLeave={() => setIsHoveringPrimary(false)}
              className={`
                px-8 md:px-10 py-4 md:py-5 
                bg-gray-900 text-white font-semibold text-base md:text-lg
                rounded-none md:rounded-sm
                transition-all duration-300 ease-out
                flex items-center justify-center gap-2
                hover:shadow-lg hover:bg-gray-800 hover:-translate-y-1
                active:scale-95 active:translate-y-0
                relative overflow-hidden group
              `}
            >
              <span className="relative z-10">Shop New Arrivals</span>
              <svg
                className={`w-5 h-5 transition-all duration-300 ease-out ${
                  isHoveringPrimary ? 'translate-x-1.5' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => navigate('/products')}
              onMouseEnter={() => setIsHoveringSecondary(true)}
              onMouseLeave={() => setIsHoveringSecondary(false)}
              className={`
                px-8 md:px-10 py-4 md:py-5
                bg-white border-2 border-gray-900 text-gray-900 
                font-semibold text-base md:text-lg
                rounded-none md:rounded-sm
                transition-all duration-300 ease-out
                flex items-center justify-center gap-2
                hover:shadow-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:-translate-y-1
                active:scale-95 active:translate-y-0
                relative overflow-hidden group
              `}
            >
              <span>View Collection</span>
              <svg
                className={`w-5 h-5 transition-all duration-300 ease-out ${
                  isHoveringSecondary ? 'translate-x-1.5' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {/* Trust Indicators */}
          <p className="text-sm md:text-base font-light tracking-wide text-gray-600 uppercase">
            Free Shipping · Easy Returns · Authentic Products
          </p>
        </div>

        {/* Right Column - Image (Desktop Only) */}
        <div className="relative items-start justify-center flex-1 hidden w-full h-full min-h-0 px-8 md:flex md:w-1/2 lg:px-16 pt-2 lg:pt-4">
          <div className="relative max-w-sm w-full aspect-[3/4] flex-shrink-0">
            {/* Image Container */}
            <div className="relative w-full h-full overflow-hidden transition-all shadow-2xl duration-600 rounded-3xl hover:shadow-3xl group will-change-transform border border-gray-100 hover:border-orange-200">
              <img
                src="https://i.pinimg.com/736x/bf/c8/29/bfc829f8b58cf994a843d36b9c095ca6.jpg"
                alt="Redefine Your Style"
                className="object-cover w-full h-full transition-transform ease-out duration-600 group-hover:scale-105 will-change-transform saturate-75 contrast-110"
              />
            </div>

            {/* Subtle Depth Effect - Layered Shadows */}
            <div className="absolute inset-0 translate-y-2 bg-gray-900 rounded-3xl -z-10 opacity-10 blur-lg"></div>
            <div className="absolute inset-0 translate-y-4 bg-gray-900 rounded-3xl -z-20 opacity-5 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <style>{`
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(4px); opacity: 0.6; }
        }
        .animate-subtle-bounce {
          animation: subtle-bounce 2.8s ease-in-out infinite;
        }
      `}</style>
      <div className="absolute flex flex-col items-center gap-2 transform -translate-x-1/2 pointer-events-none bottom-8 left-1/2 md:bottom-12 animate-subtle-bounce will-change-transform">
        <p className="text-xs font-semibold tracking-widest text-gray-300 uppercase whitespace-nowrap">
          Scroll
        </p>
        <svg
          className="flex-shrink-0 w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
