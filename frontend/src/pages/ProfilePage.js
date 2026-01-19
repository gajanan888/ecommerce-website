import React, { useState, useContext, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiSave,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';

const ProfilePage = () => {
  useTitle('My Profile | StyleHub');
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
  }, [user, navigate]);

  if (!user || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16 md:pt-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full animate-spin mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
          </div>
          <p className="text-center text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setMessage(' Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-2 md:pt-3 pb-12">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            View and manage your account details
          </p>
        </div>
      </div>

      {/* Main Content - Single View */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm">
            <span className="font-semibold text-sm">{message}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
          {/* Header with Avatar and Edit Button */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0 shadow-md">
                <FiUser size={56} className="text-gray-700" />
              </div>
              {/* User Basic Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4 font-medium">
                  {user.email}
                </p>
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
                    user.role === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </div>
            </div>

            {/* Edit/Cancel Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex-shrink-0 shadow-sm hover:shadow-md ${
                isEditing
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isEditing ? (
                <>
                  <FiX size={16} /> Cancel
                </>
              ) : (
                <>
                  <FiEdit2 size={16} /> Edit
                </>
              )}
            </button>
          </div>

          {/* Profile Information - Two Column Grid */}
          {isEditing ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(Optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <FiSave size={16} /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Discard
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Name */}
              <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <p className="text-gray-600 text-xs font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <FiUser size={14} className="text-gray-500" /> Full Name
                </p>
                <p className="text-gray-900 font-bold text-lg leading-tight">
                  {formData.name}
                </p>
              </div>

              {/* Email */}
              <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <p className="text-gray-600 text-xs font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <FiMail size={14} className="text-gray-500" /> Email
                </p>
                <p className="text-gray-900 font-bold text-lg break-words leading-tight">
                  {formData.email}
                </p>
              </div>

              {/* Phone */}
              <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <p className="text-gray-600 text-xs font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <FiPhone size={14} className="text-gray-500" /> Phone
                </p>
                <p className="text-gray-900 font-bold text-lg leading-tight">
                  {formData.phone || 'Not provided'}
                </p>
              </div>
            </div>
          )}

          {/* Account Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account</h3>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <FiLogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                <FiLogOut size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm Logout
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Are you sure you want to logout? You'll need to login again to
                access your account.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogoutClick}
                className="w-full py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-sm hover:shadow-md"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
