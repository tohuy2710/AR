import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'customer' | 'seller';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    // Save the page they wanted to visit in router state to allow late redirection!
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== allowedRole) {
    // If a seller tries to access customer routes, redirect to seller dashboard.
    // If a customer tries to access seller routes, redirect to customer marketplace.
    if (user.role === 'seller') {
      return <Navigate to="/seller" replace />;
    } else {
      return <Navigate to="/customer" replace />;
    }
  }

  return <>{children}</>;
}
