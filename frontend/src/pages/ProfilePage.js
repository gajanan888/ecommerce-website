import React, { useState, useContext, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiSave,
  FiX,
  FiLogOut,
  FiMapPin,
  FiLock,
  FiShoppingBag,
  FiCamera,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiPackage,
  FiClock,
  FiDollarSign,
  FiChevronRight,
  FiCreditCard,
  FiShield,
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import { userAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  useTitle('My Profile | EliteWear');
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isDefault: true,
    },
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  // Mock order statistics
  const orderStats = {
    total: 24,
    pending: 2,
    completed: 20,
    totalSpent: 2450.5,
  };

  useEffect(() => {
    if (!user) {
      if (!authLoading) navigate('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
  }, [user, authLoading, navigate]);

  if (!user || authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white/40 text-sm font-black uppercase tracking-widest">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (e) => {
    setNewAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveProfile = async () => {
    try {
      await userAPI.updateProfile(user.id, formData);
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showNotification('✓ Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showNotification(
        `❌ ${error.response?.data?.message || 'Update failed'}`
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('❌ Passwords do not match');
      return;
    }
    try {
      await userAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showNotification('✓ Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showNotification(
        `❌ ${error.response?.data?.message || 'Password change failed'}`
      );
    }
  };

  const handleSaveAddress = async () => {
    try {
      let updatedAddresses;
      if (editingAddress) {
        updatedAddresses = addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...newAddress, id: addr.id } : addr
        );
      } else {
        updatedAddresses = [
          ...addresses,
          { ...newAddress, id: Date.now(), isDefault: addresses.length === 0 },
        ];
      }

      setAddresses(updatedAddresses);
      showNotification(
        editingAddress ? '✓ Address updated' : '✓ New address added'
      );
      setShowAddressForm(false);
      setEditingAddress(null);
      setNewAddress({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      });
    } catch (error) {
      showNotification('❌ Failed to save address');
    }
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Delete this address?')) {
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      setAddresses(updatedAddresses);
      showNotification('✓ Address deleted');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Overview', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20 pb-12 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs / Header */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            Account Settings
          </h1>
          <p className="text-white/40 font-black text-xs uppercase tracking-[0.2em] mt-2">
            Manage your details, preferences, and orders.
          </p>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/10 ${
                message.includes('❌')
                  ? 'bg-red-500/90 text-white'
                  : 'bg-[#0A0A0A]/90 text-white shadow-orange-500/10'
              }`}
            >
              {message.includes('❌') ? (
                <FiX size={18} />
              ) : (
                <FiCheck size={18} className="text-green-400" />
              )}
              <span className="font-bold text-xs uppercase tracking-wider">
                {message.replace(/^. /, '')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-6">
            {/* User Card */}
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center backdrop-blur-sm">
              <div className="relative mb-6 group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 ring-2 ring-white/10 shadow-2xl group-hover:ring-orange-500 transition-all duration-500">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <FiUser size={40} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-orange-600 transition-transform hover:scale-110">
                  <FiCamera size={14} />
                  <input
                    type="file"
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                {user.email}
              </p>
              <div
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === 'admin'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {user.role === 'admin' ? 'Admin Access' : 'Member'}
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white/5 p-3 rounded-[2rem] border border-white/5 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-black shadow-lg shadow-white/10 translate-x-1'
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon
                      size={16}
                      className={
                        activeTab === tab.id ? 'text-black' : 'text-white/40'
                      }
                    />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && <FiChevronRight size={14} />}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <FiLogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 rounded-[2.5rem] border border-white/5 p-8 lg:p-10 backdrop-blur-sm"
              >
                {/* Profile Overview */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                          Personal Data
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">
                          Identity Specifications
                        </p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                          <FiEdit2 size={14} /> Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveProfile();
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/60 ml-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder-white/20 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/60 ml-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder-white/20 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/60 ml-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder-white/20 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div className="md:col-span-2 flex gap-4 pt-4">
                          <button
                            type="submit"
                            className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors duration-300 group">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FiUser size={18} />
                          </div>
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">
                            Full Name
                          </span>
                          <span className="text-xl font-bold text-white">
                            {formData.name}
                          </span>
                        </div>
                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors duration-300 group">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FiMail size={18} />
                          </div>
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">
                            Email
                          </span>
                          <span className="text-xl font-bold text-white truncate">
                            {formData.email}
                          </span>
                        </div>
                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors duration-300 group md:col-span-2">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FiPhone size={18} />
                          </div>
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">
                            Phone
                          </span>
                          <span className="text-xl font-bold text-white">
                            {formData.phone || 'Not set'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                          Order History
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">
                          Transaction Log
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/orders')}
                        className="text-xs font-black uppercase tracking-widest text-orange-500 hover:text-orange-400"
                      >
                        View All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FiPackage size={24} />
                        </div>
                        <div className="text-4xl font-black text-white mb-1">
                          {orderStats.total}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          Total Orders
                        </div>
                      </div>
                      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                        <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FiClock size={24} />
                        </div>
                        <div className="text-4xl font-black text-white mb-1">
                          {orderStats.pending}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          In Progress
                        </div>
                      </div>
                      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FiDollarSign size={24} />
                        </div>
                        <div className="text-3xl font-black text-white mb-1 tracking-tight">
                          ₹{orderStats.totalSpent.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          Lifetime Value
                        </div>
                      </div>
                    </div>

                    <div className="p-12 bg-white/5 rounded-[2rem] border border-dashed border-white/10 text-white text-center hover:border-white/20 transition-all">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiShoppingBag size={32} className="text-white/40" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">
                        Ready for more?
                      </h4>
                      <p className="text-white/40 mb-8 max-w-sm mx-auto text-sm">
                        Explore our latest collection and find your perfect
                        style.
                      </p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl hover:-translate-y-1"
                      >
                        Browse Products
                      </button>
                    </div>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                          Shipping Locations
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">
                          Delivery Points
                        </p>
                      </div>
                      {!showAddressForm && (
                        <button
                          onClick={() => {
                            setShowAddressForm(true);
                            setEditingAddress(null);
                          }}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                          <FiPlus size={14} /> Add New
                        </button>
                      )}
                    </div>

                    {showAddressForm ? (
                      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 animate-in fade-in zoom-in-95">
                        <h4 className="font-bold text-white mb-6 text-lg">
                          {editingAddress
                            ? 'Edit Address'
                            : 'New Delivery Point'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <select
                            name="type"
                            value={newAddress.type}
                            onChange={handleAddressChange}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-orange-500"
                          >
                            <option value="Home" className="bg-black">
                              Home
                            </option>
                            <option value="Work" className="bg-black">
                              Work
                            </option>
                            <option value="Other" className="bg-black">
                              Other
                            </option>
                          </select>
                          <input
                            placeholder="Street Address"
                            name="street"
                            value={newAddress.street}
                            onChange={handleAddressChange}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500"
                          />
                          <input
                            placeholder="City"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500"
                          />
                          <input
                            placeholder="State / Region"
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressChange}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500"
                          />
                          <input
                            placeholder="Zip Code"
                            name="zipCode"
                            value={newAddress.zipCode}
                            onChange={handleAddressChange}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500"
                          />
                          <input
                            placeholder="Country"
                            name="country"
                            value={newAddress.country}
                            onChange={handleAddressChange}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div className="flex gap-4 mt-8">
                          <button
                            onClick={handleSaveAddress}
                            className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                          >
                            Save Address
                          </button>
                          <button
                            onClick={() => setShowAddressForm(false)}
                            className="px-8 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {addresses.map((addr, idx) => (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={addr.id}
                            className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all group flex items-start justify-between"
                          >
                            <div className="flex items-start gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-white group-hover:text-black transition-colors">
                                <FiMapPin size={20} />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-bold text-white text-lg">
                                    {addr.type}
                                  </h4>
                                  {addr.isDefault && (
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                                      Primary
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/60 font-medium">
                                  {addr.street}, {addr.city}
                                </p>
                                <p className="text-white/40 text-sm mt-1">
                                  {addr.state} {addr.zipCode}, {addr.country}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingAddress(addr);
                                  setNewAddress(addr);
                                  setShowAddressForm(true);
                                }}
                                className="p-3 bg-white/5 rounded-xl text-white/40 hover:bg-white hover:text-black transition-colors"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                        Security
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">
                        Privacy & Protection
                      </p>
                    </div>

                    <form
                      onSubmit={handleChangePassword}
                      className="max-w-lg space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/60 ml-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder-white/20 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/60 ml-2">
                          New Password Area
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder-white/20 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                            placeholder="New Password"
                          />
                        </div>
                        <div className="relative mt-2">
                          <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder-white/20 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                            placeholder="Confirm Password"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl hover:-translate-y-1"
                        >
                          Update Security Key
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Global Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111] rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-white/10 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiLogOut size={30} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-white/40 mb-8 font-medium">
                Are you sure you want to disconnect from this session?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => logout()}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
