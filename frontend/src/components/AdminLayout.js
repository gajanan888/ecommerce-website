import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-orange-600">
            Access Denied
          </h1>
          <p className="mb-6 text-gray-600">
            You need admin privileges to access this area.
          </p>
          <Link to="/" className="text-orange-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-orange-500/30">
      {/* Cinematic Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-72' : 'w-24'
          } bg-[#0A0A0A] border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative z-20`}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/5">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter uppercase text-white">
                ELITE<span className="text-orange-500">CTRL</span>
              </span>
            </div>
          ) : (
            <span className="text-xl font-black text-orange-500 mx-auto">E</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            {sidebarOpen && 'Main Module'}
          </div>
          <SidebarLink
            to="/admin/dashboard"
            label="Command Center"
            icon="⚡"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/products"
            label="Inventory"
            icon="📦"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/orders"
            label="Transactions"
            icon="💳"
            open={sidebarOpen}
          />

          <div className="mt-8 mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            {sidebarOpen && 'Management'}
          </div>
          <SidebarLink
            to="/admin/users"
            label="User Grid"
            icon="👥"
            open={sidebarOpen}
          />
          <SidebarLink
            to="/admin/discounts"
            label="Promotions"
            icon="🏷️"
            open={sidebarOpen}
          />
        </nav>

        {/* Admin User Footer */}
        <div className="p-6 border-t border-white/5 bg-white/5backdrop-blur-md">
          {sidebarOpen && (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-white truncate">{user?.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${sidebarOpen
                ? 'bg-white/5 hover:bg-red-500/10 text-white hover:text-red-500 border border-white/5 hover:border-red-500/50'
                : 'text-white/40 hover:text-red-500'
              }`}
          >
            {sidebarOpen ? 'Terminate Session' : '⏻'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 bg-[#050505]">
        {/* Top Header */}
        <header className="h-24 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-xl flex items-center justify-between px-8 lg:px-12">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
              {window.location.pathname.split('/').pop() === 'dashboard' ? 'Overview' : window.location.pathname.split('/').pop()}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">
              System Operational • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-8 lg:p-12 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, label, icon, open }) {
  const isActive =
    window.location.pathname === to ||
    window.location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group ${isActive
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
          : 'text-white/40 hover:bg-white/5 hover:text-white'
        }`}
    >
      <span className={`text-xl transition-transform duration-300 ${!isActive && 'group-hover:scale-110 grayscale group-hover:grayscale-0'}`}>{icon}</span>
      {open && (
        <span className="font-bold text-[10px] uppercase tracking-[0.15em]">{label}</span>
      )}
      {isActive && open && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
    </Link>
  );
}
