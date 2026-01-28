import React, { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const ProductSpecifications = ({ product }) => {
  const [expandedTab, setExpandedTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FiCheckCircle,
    },
    {
      id: 'specifications',
      label: 'Specifications',
      icon: FiCheckCircle,
    },
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      icon: FiCheckCircle,
    },
  ];

  const specifications = [
    { label: 'Brand', value: product.brand || 'N/A' },
    { label: 'Model', value: product.model || 'N/A' },
    { label: 'Dimensions', value: product.dimensions || 'N/A' },
    { label: 'Weight', value: product.weight || 'N/A' },
    { label: 'Material', value: product.material || 'N/A' },
    { label: 'Color', value: product.color || 'N/A' },
    { label: 'Warranty', value: '1 Year Manufacturer Warranty' },
    { label: 'SKU', value: product.sku || 'N/A' },
  ];

  const shippingInfo = [
    {
      title: 'Free Worldwide Shipping',
      description:
        'Orders over ₹500 ship free. Standard delivery 5-10 business days.',
    },
    {
      title: '30-Day Easy Returns',
      description: 'Not satisfied? Return within 30 days for a full refund.',
    },
    {
      title: 'Secure Packaging',
      description:
        'All items are carefully packaged to ensure they arrive in perfect condition.',
    },
    {
      title: 'Real-Time Tracking',
      description: 'Track your order from warehouse to your doorstep.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setExpandedTab(tab.id)}
            className={`py-4 px-6 font-semibold transition-colors border-b-2 flex items-center gap-2 ${expandedTab === tab.id
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="py-6">
        {expandedTab === 'overview' && (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              {product.description}
            </p>
            {product.highlights && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Key Highlights
                </h4>
                <ul className="space-y-2">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FiCheckCircle
                        className="text-orange-600 flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {expandedTab === 'specifications' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specifications.map((spec, idx) => (
                <div key={idx} className="pb-4 border-b border-gray-200">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    {spec.label}
                  </p>
                  <p className="text-gray-900 font-semibold">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedTab === 'shipping' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingInfo.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-orange-50 rounded-lg border border-orange-100"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;
