import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <form className="auth-card" onSubmit={handleSubmit} data-testid="register-form">
        <div className="auth-brand">
          <span className="navbar-logo">&#9660;</span>
          <h1>Bank of Hamed_SDET</h1>
        </div>
        <p className="auth-subtitle">Open your account</p>

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
  );
}
