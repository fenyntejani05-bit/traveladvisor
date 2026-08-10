import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading session...</span>
        </div>
        <h5 className="fw-bold">Authenticating session...</h5>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login preserving destination state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect non-admin users attempting to access admin routes
    return (
      <div className="container py-5 mt-5 min-vh-100 text-center">
        <div className="alert alert-danger shadow-sm p-4 rounded-4 max-w-2xl mx-auto">
          <i className="bi bi-shield-lock-fill fs-1 d-block mb-3"></i>
          <h4 className="fw-bold">403 - Access Forbidden</h4>
          <p className="mb-0">You do not have administrative privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
