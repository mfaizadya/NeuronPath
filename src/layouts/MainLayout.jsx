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
  ChevronRight,
  MessageSquare,
  Sun,
  Moon,
  Crown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import UpgradeModal from '../components/UpgradeModal';
import ChatWidget from '../components/ChatWidget';
import logoSvg from '../assets/logo.svg';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Tutup sidebar saat navigasi hanya di mobile
  const handleNavClick = () => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`main-layout ${sidebarOpen ? 'main-layout--sidebar-open' : ''}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Tutup sidebar" />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <button className="sidebar__logo" onClick={() => navigate('/dashboard')} aria-label="Ke Dashboard">
            <div className="sidebar__logo-icon">
              <img src={logoSvg} alt="NeuronPath Logo" className="logo-icon-img" />
            </div>
            <div className="sidebar__logo-text">
              <span className="sidebar__brand">NeuronPath</span>
              <span className="sidebar__tagline">Smart Learning</span>
            </div>
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
              onClick={handleNavClick}
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
                  <button className="badge badge--free" onClick={() => setShowUpgradeModal(true)} type="button">FREE</button>
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
          <button className="topbar__menu" onClick={() => setSidebarOpen(prev => !prev)} aria-label="Toggle sidebar">
            <Menu size={22} />
          </button>
          
          <div className="topbar__right">
            <button className="topbar__theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {!user?.isPremium && (
              <button
                className="topbar__upgrade-btn"
                onClick={() => setShowUpgradeModal(true)}
                aria-label="Upgrade ke Premium"
              >
                <Crown size={15} />
                <span>Upgrade</span>
              </button>
            )}
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

      {/* Floating AI Chat Widget */}
      <ChatWidget onUpgrade={() => setShowUpgradeModal(true)} />
    </div>
  );
}
