import React, { useState, useEffect } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiTruck,
  FiLock,
  FiArrowRight,
} from 'react-icons/fi';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      avatar: '👩‍💼',
      rating: 5,
      text: 'ShopHub offers an exceptional shopping experience. Fast delivery, quality products, and amazing customer service!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Tech Enthusiast',
      avatar: '👨‍💻',
      rating: 5,
      text: "The best online store I've found. Great selection, competitive prices, and the checkout process is super smooth.",
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Fashion Blogger',
      avatar: '👩‍🎨',
      rating: 5,
      text: 'Absolutely love the product variety and quality. My orders always arrive on time and perfectly packaged!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    {
      id: 4,
      name: 'James Rodriguez',
      role: 'Business Owner',
      avatar: '👨‍💼',
      rating: 5,
      text: 'Reliable, trustworthy, and professional. ShopHub has become my go-to platform for all my shopping needs.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
  ];

  const brands = [
    { id: 1, name: 'Apple', logo: '🍎' },
    { id: 2, name: 'Samsung', logo: '📱' },
    { id: 3, name: 'Nike', logo: '👟' },
    { id: 4, name: 'Sony', logo: '🎧' },
    { id: 5, name: 'Canon', logo: '📷' },
    { id: 6, name: 'Adidas', logo: '⚽' },
  ];

  const trustMessages = [
    {
      id: 1,
      icon: '🚚',
      title: 'Fast Delivery',
      description: '24-48 hour delivery to most areas',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
    },
    {
      id: 2,
      icon: '🔐',
      title: 'Secure Payment',
      description: '256-bit SSL encryption for all transactions',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
    },
    {
      id: 3,
      icon: '↩️',
      title: '30-Day Returns',
      description: 'Hassle-free returns and exchanges',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
    },
    {
      id: 4,
      icon: '💬',
      title: '24/7 Support',
      description: 'Always here to help with any questions',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setAutoPlay(false);
  };

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Trust Messages Section - Top */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
              Why Choose ShopHub?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering excellence in every aspect of your
              shopping journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustMessages.map((trust, idx) => (
              <div
                key={trust.id}
                className={`p-6 rounded-xl border border-gray-200 transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1 animate-fadeInUp bg-white`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`text-4xl mb-3 inline-block p-3 rounded-xl bg-orange-50`}
                >
                  {trust.icon}
                </div>
                <h3 className={`font-bold text-lg mb-2 ${trust.textColor}`}>
                  {trust.title}
                </h3>
                <p className="text-sm text-gray-700">{trust.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Loved by{' '}
            <span className="gradient-text-animated">10,000+ Customers</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ShopHub for quality
            products and exceptional service.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div>
          <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 overflow-hidden">
            {/* Decorative Quote Icon */}
            <div className="absolute -top-4 -left-4 text-8xl opacity-5 pointer-events-none text-orange-600">
              "
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center text-2xl overflow-hidden shadow-md">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Text - Fade Transition */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8 testimonial-slide italic">
                "{testimonials[currentIndex].text}"
              </p>

              {/* Carousel Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setAutoPlay(false);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-8 bg-orange-600'
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2.5 hover:bg-orange-50 rounded-full transition-colors border border-gray-200 text-gray-700 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    aria-label="Previous testimonial"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2.5 hover:bg-orange-50 rounded-full transition-colors border border-gray-200 text-gray-700 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    aria-label="Next testimonial"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Brands Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Trusted by Top Brands
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop from the world's most trusted and recognized brands
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand, idx) => (
              <div
                key={brand.id}
                className="flex items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 group animate-fadeInUp cursor-pointer"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="text-5xl group-hover:scale-110 duration-300 ease-out filter group-hover:grayscale-0 grayscale opacity-70 group-hover:opacity-100 transition-all">
                  {brand.logo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
