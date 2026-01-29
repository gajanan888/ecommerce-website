import React, { useState, useEffect } from 'react';

const PriceRangeSlider = ({
  minPrice = 0,
  maxPrice = 1000,
  onPriceChange,
  currentMin,
  currentMax,
}) => {
  const [localMin, setLocalMin] = useState(currentMin || minPrice);
  const [localMax, setLocalMax] = useState(currentMax || maxPrice);

  useEffect(() => {
    setLocalMin(currentMin || minPrice);
    setLocalMax(currentMax || maxPrice);
  }, [currentMin, currentMax, minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(value);
    onPriceChange(value, localMax);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(value);
    onPriceChange(localMin, value);
  };

  const percentage1 = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
  const percentage2 = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className="price-range-container space-y-4">
      <div className="space-y-2">
        <h3 className="text-gray-700 font-semibold mb-4">💰 Price Range</h3>

        {/* Price Display */}
        <div className="flex justify-between items-center mb-3 px-1">
          <div className="text-sm">
            <span className="font-semibold text-orange-600">${localMin}</span>
            <span className="text-gray-500"> - </span>
            <span className="font-semibold text-orange-600">${localMax}</span>
          </div>
        </div>

        {/* Slider Track */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Filled Range */}
          <div
            className="absolute h-full bg-orange-500"
            style={{
              left: `${percentage1}%`,
              right: `${100 - percentage2}%`,
            }}
          />
        </div>

        {/* Input Sliders */}
        <div className="relative h-6">
          {/* Min Slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localMin}
            onChange={handleMinChange}
            className="absolute w-full h-2 top-2 left-0 appearance-none bg-transparent pointer-events-none z-5"
            style={{
              WebkitAppearance: 'slider-horizontal',
              zIndex: localMin > maxPrice - (maxPrice - minPrice) / 2 ? 5 : 3,
            }}
          />
          {/* Max Slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localMax}
            onChange={handleMaxChange}
            className="absolute w-full h-2 top-2 left-0 appearance-none bg-transparent pointer-events-none z-4"
          />

          {/* Custom Slider Thumbs with CSS */}
          <style>{`
            input[type='range'] {
              -webkit-appearance: none;
              width: 100%;
              height: 6px;
              border-radius: 3px;
              background: transparent;
              outline: none;
              cursor: pointer;
            }

            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #FF8A00;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(255, 138, 0, 0.3);
              transition: all 0.2s ease;
            }

            input[type='range']::-webkit-slider-thumb:hover {
              width: 20px;
              height: 20px;
              box-shadow: 0 4px 12px rgba(255, 138, 0, 0.4);
              background: #E67E00;
            }

            input[type='range']::-webkit-slider-thumb:active {
              transform: scale(1.1);
            }

            input[type='range']::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #FF8A00;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(255, 138, 0, 0.3);
              transition: all 0.2s ease;
            }

            input[type='range']::-moz-range-thumb:hover {
              width: 20px;
              height: 20px;
              box-shadow: 0 4px 12px rgba(255, 138, 0, 0.4);
              background: #E67E00;
            }
          `}</style>
        </div>

        {/* Min/Max Buttons */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Min
            </label>
            <input
              type="number"
              min={minPrice}
              max={localMax - 1}
              value={localMin}
              onChange={(e) => {
                const value = Math.max(
                  minPrice,
                  Math.min(Number(e.target.value), localMax - 1)
                );
                setLocalMin(value);
                onPriceChange(value, localMax);
              }}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Max
            </label>
            <input
              type="number"
              min={localMin + 1}
              max={maxPrice}
              value={localMax}
              onChange={(e) => {
                const value = Math.max(
                  localMin + 1,
                  Math.min(Number(e.target.value), maxPrice)
                );
                setLocalMax(value);
                onPriceChange(localMin, value);
              }}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
