import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/reviews/product/${productId}?page=1&limit=10`
      );
      setReviews(response.data.data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [productId, fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/reviews',
        { productId, ...newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewReview({ rating: 5, title: '', comment: '' });
      setSubmitted(true);
      fetchReviews();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-bold">Customer Reviews</h3>

        {submitted && (
          <div className="p-4 mb-4 text-orange-800 bg-orange-100 rounded">
            Review submitted successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-4 mb-8 rounded-lg bg-gray-50"
        >
          <h4 className="mb-4 font-bold">Write a Review</h4>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              placeholder="Brief review title"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Your detailed review"
              rows="4"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 text-white bg-orange-600 rounded hover:bg-orange-700"
          >
            Submit Review
          </button>
        </form>
      </div>

      <div>
        <h4 className="mb-4 font-bold">All Reviews ({reviews.length})</h4>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.user.name}</p>
                    <p className="text-sm text-gray-600">{review.title}</p>
                  </div>
                  <span className="text-lg">{renderStars(review.rating)}</span>
                </div>
                <p className="mb-2 text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
