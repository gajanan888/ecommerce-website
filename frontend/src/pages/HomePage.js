import React from 'react';
import Hero from '../components/Hero';
import CategoryHighlights from '../components/CategoryHighlights';
import NewArrivals from '../components/NewArrivals';
import { useTitle } from '../hooks/useTitle';

export default function HomePage() {
  useTitle('StyleHub - Premium Fashion Store | Shop Latest Collections');

  return (
    <main className="bg-white">
      <Hero />
      <CategoryHighlights />
      <NewArrivals />
    </main>
  );
}
