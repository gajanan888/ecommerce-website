import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <nav
      className="flex items-center gap-2 text-sm mb-6"
      aria-label="Breadcrumb"
    >
      <button
        onClick={() => navigate('/')}
        className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
      >
        Home
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FiChevronRight className="text-gray-400" size={16} />
          {item.href ? (
            <button
              onClick={() => navigate(item.href)}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
