import React, { useState, useEffect, useContext } from 'react';
import { productAPI } from '../services/api';
import ProductCard from './ProductCard';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ currentProductId, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        // Fetch products in the same category
        // Note: getAll accepts params object directly
        const response = await productAPI.getAll({
          category: category,
          limit: 10,
        });

        let allProducts = [];
        // Handle different response structures if necessary, but typically response.data.data or response.data.products
        if (response.data && Array.isArray(response.data.data)) {
          allProducts = response.data.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          allProducts = response.data.products;
        } else if (Array.isArray(response.data)) {
          allProducts = response.data;
        }

        // Filter out the current product and take top 4
        const related = allProducts
          .filter((p) => p._id !== currentProductId)
          .slice(0, 4);

        setProducts(related);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className="py-8 mt-12 border-t border-gray-100">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[450px] bg-gray-200 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100 mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
            onViewDetails={(id) => navigate(`/product/${id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
