import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, ShieldCheck, Smartphone, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-brand-panel">
          <div className="auth-brand-mark">
            <Landmark size={26} strokeWidth={2.25} />
            <span>Bank of Hamed_SDET</span>
          </div>
          <h2 className="auth-tagline">Banking built for practicing test automation.</h2>
          <ul className="auth-feature-list">
            <li>
              <ShieldCheck size={18} /> Realistic auth, transfers &amp; bill pay flows
            </li>
            <li>
              <TrendingUp size={18} /> Live account dashboards &amp; spending insights
            </li>
            <li>
              <Smartphone size={18} /> Stable selectors on every interactive element
            </li>
          </ul>
        </div>

        <form className="auth-card" onSubmit={handleSubmit} data-testid="login-form">
          <h1 className="auth-card-title">Sign In</h1>
          <p className="auth-subtitle">Welcome back — sign in to manage your accounts</p>

          {error && (
            <div className="alert alert-error" data-testid="login-error">
              {error}
            </div>
          )}

          <label htmlFor="username">Username</label>
          <input
            id="username"
            data-testid="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            data-testid="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit" data-testid="login-submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-footer">
            <span>
              Demo login: <code>jdoe</code> / <code>Password123!</code>
            </span>
            <span>
              New here? <Link to="/register" data-testid="link-register">Create an account</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
