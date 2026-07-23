import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ShieldCheck, Smartphone, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
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

        <form className="auth-card" onSubmit={handleSubmit} data-testid="register-form">
          <h1 className="auth-card-title">Open Your Account</h1>
          <p className="auth-subtitle">It only takes a minute</p>

          {error && (
            <div className="alert alert-error" data-testid="register-error">
              {error}
            </div>
          )}

          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" data-testid="register-fullname" value={form.fullName} onChange={update('fullName')} required />

          <label htmlFor="reg-username">Username</label>
          <input id="reg-username" data-testid="register-username" value={form.username} onChange={update('username')} required />

          <label htmlFor="reg-email">Email</label>
          <input id="reg-email" data-testid="register-email" type="email" value={form.email} onChange={update('email')} required />

          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            data-testid="register-password"
            type="password"
            value={form.password}
            onChange={update('password')}
            required
            minLength={8}
          />
          <p className="field-hint">Minimum 8 characters</p>

          <button type="submit" data-testid="register-submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="auth-footer">
            <span>
              Already have an account? <Link to="/login" data-testid="link-login">Sign in</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
