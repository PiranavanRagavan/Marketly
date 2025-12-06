import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireManager?: boolean;
  requireStaff?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireManager = false,
  requireStaff = false,
}) => {
  const { user, isManager, isStaff, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireManager && !isManager) {
    return <Navigate to="/" replace />;
  }

  if (requireStaff && !(isManager || isStaff)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
