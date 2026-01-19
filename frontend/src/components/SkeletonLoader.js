import React from 'react';

// Individual Skeleton Card with Shimmer Effect
export const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 animate-fadeInUp"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Image Skeleton with Shimmer */}
    <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 h-56 skeleton-shimmer"></div>

    {/* Discount Badge Skeleton */}
    <div className="absolute top-6 left-6 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-16 skeleton-shimmer"></div>

    {/* Title Skeleton */}
    <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-4/5 mb-3 skeleton-shimmer"></div>

    {/* Description Skeleton */}
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded skeleton-shimmer"></div>
      <div
        className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6 skeleton-shimmer"
        style={{ animationDelay: '100ms' }}
      ></div>
    </div>

    {/* Rating Skeleton */}
    <div className="flex items-center gap-2 mb-3">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4 skeleton-shimmer"
            style={{ animationDelay: `${50 + i * 50}ms` }}
          ></div>
        ))}
      </div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-12 skeleton-shimmer"></div>
    </div>

    {/* Price Skeleton */}
    <div className="mb-4 flex items-center gap-3">
      <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-24 skeleton-shimmer"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 skeleton-shimmer"></div>
    </div>

    {/* Button Skeleton */}
    <div className="flex gap-2">
      <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg skeleton-shimmer"></div>
      <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg skeleton-shimmer"></div>
    </div>
  </div>
);

// Skeleton Grid for multiple cards
export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, idx) => (
      <SkeletonCard key={idx} delay={idx * 50} />
    ))}
  </div>
);

// Product Detail Page Skeleton
export const SkeletonProductDetail = () => (
  <div className="animate-fadeInUp">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="w-full h-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl skeleton-shimmer"></div>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg skeleton-shimmer"
              style={{ animationDelay: `${i * 50}ms` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-3">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-3/4 skeleton-shimmer"></div>
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-1/2 skeleton-shimmer"></div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded skeleton-shimmer"
                style={{ animationDelay: `${i * 50}ms` }}
              ></div>
            ))}
          </div>
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 skeleton-shimmer"></div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-32 skeleton-shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-24 skeleton-shimmer"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg skeleton-shimmer"
              style={{ animationDelay: `${i * 50}ms` }}
            ></div>
          ))}
        </div>

        {/* Specifications */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-1/4 skeleton-shimmer"
                style={{ animationDelay: `${i * 50}ms` }}
              ></div>
              <div
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-1/3 skeleton-shimmer"
                style={{ animationDelay: `${100 + i * 50}ms` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg skeleton-shimmer"></div>
          <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg skeleton-shimmer"></div>
        </div>
      </div>
    </div>

    {/* Reviews Section Skeleton */}
    <div className="mt-16">
      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-32 mb-6 skeleton-shimmer"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg space-y-3">
            <div
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 skeleton-shimmer"
              style={{ animationDelay: `${i * 50}ms` }}
            ></div>
            <div className="space-y-2">
              <div
                className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded skeleton-shimmer"
                style={{ animationDelay: `${100 + i * 50}ms` }}
              ></div>
              <div
                className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/5 skeleton-shimmer"
                style={{ animationDelay: `${150 + i * 50}ms` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Cart Item Skeleton
export const SkeletonCartItem = () => (
  <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
    <div className="flex gap-6">
      {/* Image */}
      <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>

      {/* Content */}
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Delete button */}
      <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
    </div>
  </div>
);

export default SkeletonCard;
