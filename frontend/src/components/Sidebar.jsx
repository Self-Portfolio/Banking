import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Receipt, User, LogOut, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAccounts } from '../context/AccountsContext.jsx';

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { clear } = useAccounts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clear();
    navigate('/login');
  };

  const navItem = (to, testId, Icon, label) => (
    <NavLink
      to={to}
      data-testid={testId}
      className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
    >
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className="sidebar" data-testid="navbar">
      <div className="sidebar-brand">
        <span className="brand-mark">
          <Landmark size={20} strokeWidth={2.25} />
        </span>
        <span className="brand-name">Bank of Hamed_SDET</span>
      </div>

      <nav className="sidebar-nav">
        {navItem('/dashboard', 'nav-dashboard', LayoutDashboard, 'Dashboard')}
        {navItem('/transfer', 'nav-transfer', ArrowLeftRight, 'Transfer')}
        {navItem('/billpay', 'nav-billpay', Receipt, 'Bill Pay')}
        {navItem('/profile', 'nav-profile', User, 'Profile')}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="avatar-circle">{initials(user.fullName)}</span>
          <span className="sidebar-user-name" data-testid="nav-username">
            {user.fullName}
          </span>
        </div>
        <button onClick={handleLogout} className="sidebar-logout" data-testid="logout-button">
          <LogOut size={16} strokeWidth={2} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
