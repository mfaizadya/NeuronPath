import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Brain,
  ClipboardList,
  History,
  UserCircle,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
  MessageSquare,
  Sun,
  Moon,
  Crown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import UpgradeModal from '../components/UpgradeModal';
import './MainLayout.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pretest', icon: Brain, label: 'Pretest' },
  { to: '/history', icon: History, label: 'Riwayat Tes' },
  { to: '/consultation', icon: MessageSquare, label: 'Konsultasi AI' },
  { to: '/account', icon: UserCircle, label: 'Profil' },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo" onClick={() => navigate('/dashboard')}>
            <div className="sidebar__logo-icon">
              <Zap size={24} />
            </div>
            <div className="sidebar__logo-text">
              <span className="sidebar__brand">NeuronPath</span>
              <span className="sidebar__tagline">Smart Learning</span>
            </div>
          </div>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__nav-label">Menu Utama</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="sidebar__link-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__username">
                {user?.username || 'User'}
                {user?.isPremium ? (
                  <span className="badge badge--premium" title="Premium User"><Crown size={12} /> PRO</span>
                ) : (
                  <span className="badge badge--free" onClick={() => setShowUpgradeModal(true)}>FREE</span>
                )}
              </span>
              <span className="sidebar__email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <button className="topbar__menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          
          <div className="topbar__right">
            <button className="topbar__theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="topbar__greeting">
              Halo, <strong>{user?.username || 'User'}</strong>! 👋
            </div>
          </div>
        </header>

        <main className="main-page">
          <Outlet context={{ setShowUpgradeModal }} />
        </main>
      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}
