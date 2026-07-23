import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GuestRoute from './components/GuestRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AccountDetails from './pages/AccountDetails.jsx';
import Transfer from './pages/Transfer.jsx';
import BillPay from './pages/BillPay.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:id"
          element={
            <ProtectedRoute>
              <AccountDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billpay"
          element={
            <ProtectedRoute>
              <BillPay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
