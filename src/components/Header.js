import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-glass shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <span className="me-2 fs-4">🌍</span> TravelAdvisor
        </Link>
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-3">
              <Link className={`nav-link ${isHome ? 'active fw-bold' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link className={`nav-link ${location.pathname === '/destinations' ? 'active fw-bold' : ''}`} to="/destinations">Destinations</Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item me-3">
                  <Link className={`nav-link ${location.pathname === '/profile' ? 'active fw-bold' : ''}`} to="/profile">
                    Dashboard
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item me-3">
                    <Link className={`nav-link text-warning fw-bold ${location.pathname === '/admin' ? 'active' : ''}`} to="/admin">
                      <i className="bi bi-shield-lock me-1"></i>Admin Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item dropdown me-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary rounded-pill px-3 py-2">
                      <i className="bi bi-person-fill me-1"></i>
                      {user?.name || 'User'} {isAdmin && '(Admin)'}
                    </span>
                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3 ms-2">
                      Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2 mt-2 mt-lg-0">
                  <Link className="btn btn-outline-premium w-100" to="/login">Log In</Link>
                </li>
                <li className="nav-item mt-2 mt-lg-0">
                  <Link className="btn btn-premium w-100" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;