import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { productAPI } from '../services/api';
import ProductCard from './ProductCard';

const NewArrivals = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await productAPI.getFeatured();
        const data = response.data.data || [];
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch new arrivals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      showSuccess('Added to cart');
    } catch (error) {
      showError('Failed to add to cart');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return null;

  return (
    <section className="py-24 bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
              NEW DROPS
            </h2>
            <p className="text-xl text-white/40 font-bold max-w-md uppercase tracking-widest text-xs mt-4">
              Fresh digital artifacts for the next generation.
            </p>
          </div>

          <button
            onClick={() => navigate('/products?tag=new')}
            className="hidden md:flex items-center gap-2 font-black text-white/60 hover:text-white transition-all uppercase tracking-widest text-xs"
          >
            VIEW COLLECTION <FiArrowRight className="ml-2" />
          </button>
        </div>

        {/* Grid using unified ProductCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
