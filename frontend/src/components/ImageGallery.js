import React, { useState } from 'react';
import { FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ImageGallery = ({ images, productName, discount }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState(null);

  const handleMouseMove = (e) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setZoomPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setZoomPosition(null);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage =
    images[selectedImage] || 'https://via.placeholder.com/500?text=No+Image';

  return (
    <div className="w-full">
      {/* Main Image with Zoom */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden mb-6 h-96 md:h-96 flex items-center justify-center group shadow-xl border-2 border-white border-opacity-50">
        <div
          className="relative w-full h-full overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={currentImage}
            alt={productName}
            className={`w-full h-full object-cover transition-transform duration-300 ease-out ${
              zoomPosition
                ? 'cursor-zoom-in scale-150'
                : 'cursor-zoom-out scale-100'
            }`}
            style={
              zoomPosition
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
          />
        </div>

        {/* Zoom Icon Indicator */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110">
          <FiZoomIn className="text-orange-600 font-bold" size={22} />
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-6 left-6 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-lg shadow-md border border-orange-500 border-opacity-20">
            -{discount}%
          </div>
        )}

        {/* Navigation Arrows (visible on hover if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg transform hover:scale-110 active:scale-95"
            >
              <FiChevronLeft className="text-orange-600 font-bold" size={26} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg transform hover:scale-110 active:scale-95"
            >
              <FiChevronRight className="text-orange-600 font-bold" size={26} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white border-opacity-20">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                selectedImage === idx
                  ? 'border-orange-600 ring-2 ring-orange-300 ring-offset-2 scale-102'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <img
                src={image}
                alt={`View ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
