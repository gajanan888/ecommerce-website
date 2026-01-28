import React from 'react';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import BrandStory from '../components/BrandStory';
import CategoryHighlights from '../components/CategoryHighlights';
import NewArrivals from '../components/NewArrivals';
import { useTitle } from '../hooks/useTitle';

export default function HomePage() {
  useTitle('EliteWear - Premium Fashion Store | Shop Latest Collections');

  return (
    <main className="bg-[#0A0A0A]">
      <Hero />

      <div className="reveal">
        <TrustSection />
      </div>

      <div className="reveal">
        <CategoryHighlights />
      </div>

      <div className="reveal">
        <NewArrivals />
      </div>

      <div className="reveal">
        <BrandStory />
      </div>
    </main>
  );
}
