import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAccounts } from '../context/AccountsContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { clear } = useAccounts();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    clear();
    navigate('/login');
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">&#9660;</span> Bank of Hamed_SDET
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" data-testid="nav-dashboard">Dashboard</Link>
        <Link to="/transfer" data-testid="nav-transfer">Transfer</Link>
        <Link to="/billpay" data-testid="nav-billpay">Bill Pay</Link>
        <Link to="/profile" data-testid="nav-profile">Profile</Link>
      </div>
      <div className="navbar-user">
        <span data-testid="nav-username">{user.fullName}</span>
        <button onClick={handleLogout} data-testid="logout-button">Log Out</button>
      </div>
    </nav>
  );
}
