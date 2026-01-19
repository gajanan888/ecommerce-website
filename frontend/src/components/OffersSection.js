import React, { useState } from 'react';
import { FiArrowRight, FiStar, FiTrendingUp } from 'react-icons/fi';

const OffersSection = ({ onNavigate }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const exclusiveOffers = [
    {
      id: 1,
      title: 'Summer Collection',
      discount: '50% OFF',
      description: 'Premium summer outfits',
      image:
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=400&fit=crop',
      tag: 'LIMITED TIME',
    },
    {
      id: 2,
      title: 'Flash Sale',
      discount: '70% OFF',
      description: 'Selected items only',
      image:
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=400&fit=crop',
      tag: 'ENDING SOON',
    },
    {
      id: 3,
      title: 'Bundle Deal',
      discount: 'Buy 2 Get 1',
      description: 'On selected categories',
      image:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=400&fit=crop',
      tag: 'EXCLUSIVE',
    },
  ];

  return (
    <div
      className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-8"
      style={{
        background: 'linear-gradient(135deg, #F5F5F5 0%, #ECECEC 100%)',
      }}
    >
      {/* Section Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ color: '#1a1a1a' }}
          >
            Exclusive Offers
          </h2>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div
            className="h-1 w-16 rounded-full"
            style={{ backgroundColor: '#FF8A00' }}
          ></div>
          <p className="text-gray-700 font-semibold text-lg">
            Limited time deals just for you
          </p>
          <div
            className="h-1 w-16 rounded-full"
            style={{ backgroundColor: '#FF8A00' }}
          ></div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {exclusiveOffers.map((offer) => (
          <div
            key={offer.id}
            className="relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 transform hover:shadow-md hover:scale-102 active:scale-95 group cursor-pointer"
            onMouseEnter={() => setHoveredCard(offer.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${offer.image})` }}
            ></div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Background Color Overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                backgroundColor:
                  hoveredCard === offer.id
                    ? 'rgba(255, 138, 0, 0.2)'
                    : 'rgba(0, 0, 0, 0)',
              }}
            ></div>

            {/* Content */}
            <div className="relative z-10 h-80 flex flex-col justify-between p-6 text-white">
              {/* Top - Tag and Icon */}
              <div className="flex items-center justify-between">
                <span
                  className="px-4 py-2 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#FF8A00' }}
                >
                  {offer.tag}
                </span>
                <FiTrendingUp
                  size={24}
                  className="text-yellow-300 animate-bounce"
                />
              </div>

              {/* Middle - Empty space */}
              <div></div>

              {/* Bottom - Offer Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-2">
                    {offer.description}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                    {offer.title}
                  </h3>
                  <div
                    className="text-4xl sm:text-5xl font-black"
                    style={{ color: '#FFD700' }}
                  >
                    {offer.discount}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3 group/btn"
                  style={{
                    backgroundColor:
                      hoveredCard === offer.id ? '#FFD700' : '#FFFFFF',
                    transform:
                      hoveredCard === offer.id
                        ? 'translateY(-2px)'
                        : 'translateY(0)',
                  }}
                >
                  <span>Shop Now</span>
                  <FiArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover/btn:translate-x-2"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FiStar size={28} style={{ color: '#FF1493' }} />
          <h3
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#1a1a1a' }}
          >
            Don't Miss Out!
          </h3>
          <FiStar size={28} style={{ color: '#FF1493' }} />
        </div>
        <p className="text-gray-600 mb-6 text-lg font-medium">
          Our exclusive offers are live for a limited time only. Grab your
          favorites before they're gone!
        </p>
        <button
          onClick={onNavigate}
          className="px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto hover:gap-4 group"
          style={{
            backgroundColor: '#FF8A00',
            color: '#FFFFFF',
            transform: 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.backgroundColor = '#E67E00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.backgroundColor = '#FF8A00';
          }}
        >
          <span>View All Deals</span>
          <FiArrowRight
            size={22}
            className="transition-transform duration-300 group-hover:translate-x-2"
          />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-12 right-0 text-6xl opacity-20 pointer-events-none">
        🎁
      </div>
      <div className="absolute -bottom-12 left-0 text-6xl opacity-20 pointer-events-none">
        💝
      </div>
    </div>
  );
};

export default OffersSection;
