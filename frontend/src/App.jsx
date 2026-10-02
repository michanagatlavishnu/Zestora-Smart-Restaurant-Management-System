import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Kitchen from './pages/Kitchen';
import Menu from './pages/Menu';
import CustomerMenu from './pages/CustomerMenu';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import Tables from './pages/Tables';
import Billing from './pages/Billing';

import Customers from './pages/Customers';
import Staff from './pages/Staff';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Pos from './pages/Pos';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<CustomerMenu />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/pos" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'CASHIER', 'WAITER']}>
              <Pos />
            </ProtectedRoute>
          } />
          <Route path="/kitchen" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'KITCHEN']}>
              <Kitchen />
            </ProtectedRoute>
          } />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/tables" element={<Tables />} />
          <Route path="/billing" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'CASHIER']}>
              <Billing />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Staff />
            </ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'CASHIER']}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
