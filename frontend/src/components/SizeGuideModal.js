import React from 'react';
import { FiX } from 'react-icons/fi';

const SizeGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Size Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close Size Guide"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Use the chart below to determine your size. If you are between
            sizes, we recommend ordering the larger size for a looser fit or the
            smaller size for a tighter fit.
          </p>

          {/* Size Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border border-gray-200">Size</th>
                  <th className="px-4 py-3 border border-gray-200">
                    Chest (in)
                  </th>
                  <th className="px-4 py-3 border border-gray-200">
                    Waist (in)
                  </th>
                  <th className="px-4 py-3 border border-gray-200">
                    Hips (in)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold border border-gray-200">
                    XS
                  </td>
                  <td className="px-4 py-3 border border-gray-200">32 - 34</td>
                  <td className="px-4 py-3 border border-gray-200">26 - 28</td>
                  <td className="px-4 py-3 border border-gray-200">32 - 34</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold border border-gray-200">
                    S
                  </td>
                  <td className="px-4 py-3 border border-gray-200">35 - 37</td>
                  <td className="px-4 py-3 border border-gray-200">29 - 31</td>
                  <td className="px-4 py-3 border border-gray-200">35 - 37</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold border border-gray-200">
                    M
                  </td>
                  <td className="px-4 py-3 border border-gray-200">38 - 40</td>
                  <td className="px-4 py-3 border border-gray-200">32 - 34</td>
                  <td className="px-4 py-3 border border-gray-200">38 - 40</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold border border-gray-200">
                    L
                  </td>
                  <td className="px-4 py-3 border border-gray-200">41 - 43</td>
                  <td className="px-4 py-3 border border-gray-200">35 - 37</td>
                  <td className="px-4 py-3 border border-gray-200">41 - 43</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold border border-gray-200">
                    XL
                  </td>
                  <td className="px-4 py-3 border border-gray-200">44 - 46</td>
                  <td className="px-4 py-3 border border-gray-200">38 - 40</td>
                  <td className="px-4 py-3 border border-gray-200">44 - 46</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold border border-gray-200">
                    XXL
                  </td>
                  <td className="px-4 py-3 border border-gray-200">47 - 49</td>
                  <td className="px-4 py-3 border border-gray-200">41 - 43</td>
                  <td className="px-4 py-3 border border-gray-200">47 - 49</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measurement Instructions */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-4">How to Measure</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>1. Chest:</strong> Measure around the fullest part of
                your chest, keeping the tape horizontal.
              </p>
              <p>
                <strong>2. Waist:</strong> Measure around the narrowest part
                (typically where your body bends side to side), keeping the tape
                horizontal.
              </p>
              <p>
                <strong>3. Hips:</strong> Measure around the fullest part of
                your hips, keeping the tape horizontal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
