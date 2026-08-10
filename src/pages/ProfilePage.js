import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff&size=120`;

  return (
    <div className="profile-page fade-in-up bg-light min-vh-100 pb-5">
      {/* Dashboard Header */}
      <div className="dashboard-header bg-primary py-5 text-white">
        <div className="container py-4">
          <div className="d-flex flex-wrap align-items-center gap-4">
            <img 
              src={avatarUrl} 
              alt="Profile Avatar" 
              className="rounded-circle border border-4 border-white shadow"
              style={{ width: '100px', height: '100px' }}
            />
            <div>
              <div className="d-flex align-items-center gap-2">
                <h1 className="fw-bold mb-0 text-white">{user?.name || 'Traveler'}</h1>
                <span className={`badge ${isAdmin ? 'bg-warning text-dark' : 'bg-info text-white'} px-3 py-2 rounded-pill`}>
                  {isAdmin ? 'System Admin' : 'Registered Member'}
                </span>
              </div>
              <p className="text-light opacity-90 mb-1 mt-2">
                <i className="bi bi-envelope me-2"></i>{user?.email}
              </p>
              <p className="text-light opacity-75 mb-0 small">
                <i className="bi bi-calendar3 me-2"></i>Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
            <div className="ms-auto d-flex gap-2 mt-3 mt-md-0">
              {isAdmin && (
                <Link to="/admin" className="btn btn-warning fw-bold rounded-pill px-4">
                  <i className="bi bi-shield-lock me-1"></i> Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline-light rounded-pill px-4">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        {/* Stats Row */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="stat-card bg-white p-4 rounded-4 shadow-sm d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-3">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">50+</h3>
                <p className="text-muted small mb-0">Explore Destinations</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card bg-white p-4 rounded-4 shadow-sm d-flex align-items-center gap-3">
              <div className="stat-icon bg-success bg-opacity-10 text-success p-3 rounded-circle fs-3">
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">JWT Active</h3>
                <p className="text-muted small mb-0">Secure Authenticated Session</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card bg-white p-4 rounded-4 shadow-sm d-flex align-items-center gap-3">
              <div className="stat-icon bg-warning bg-opacity-10 text-warning p-3 rounded-circle fs-3">
                <i className="bi bi-star-fill"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">Community Reviews</h3>
                <p className="text-muted small mb-0">Post & Edit Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Account Overview */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Account Details</h5>
                <Link to="/destinations" className="text-primary text-decoration-none small fw-bold">
                  Browse All Destinations <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              <div className="card-body p-4">
                <div className="bg-light p-4 rounded-4 mb-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">User ID</small>
                      <span className="fw-bold">#{user?.id}</span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Full Name</small>
                      <span className="fw-bold">{user?.name}</span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Email Address</small>
                      <span className="fw-bold">{user?.email}</span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Role Permissions</small>
                      <span className="fw-bold text-uppercase">{user?.role}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary bg-opacity-10 rounded-4 text-primary d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-1">Ready for your next trip?</h6>
                    <p className="mb-0 small">Explore destinations, check hotels, and read ratings from travelers across India.</p>
                  </div>
                  <Link to="/destinations" className="btn btn-primary rounded-pill px-4">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold mb-0">System Security Notice</h5>
              </div>
              <div className="card-body p-4">
                <div className="alert alert-success rounded-3 mb-3">
                  <i className="bi bi-lock-fill me-2"></i>
                  Stateless JWT Token verified with 7-day expiration policy.
                </div>
                <div className="alert alert-info rounded-3 mb-0">
                  <i className="bi bi-shield-check me-2"></i>
                  Password stored as a 10-round salted bcrypt hash in MySQL.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;