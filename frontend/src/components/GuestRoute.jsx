import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading" data-testid="app-loading">Loading...</div>;
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
