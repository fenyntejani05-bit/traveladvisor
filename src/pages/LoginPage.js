import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in or if session expired
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }

    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('expired')) {
      setInfoMessage('Your session has expired. Please log in again.');
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfoMessage('');
    
    const result = await login({ email, password });
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 fade-in-up">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                     style={{width: '70px', height: '70px'}}>
                  <i className="bi bi-person-fill text-white fs-1"></i>
                </div>
                <h2 className="h4 fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted small">Sign in to your TravelAdvisor account</p>
              </div>
              
              {infoMessage && (
                <div className="alert alert-info alert-dismissible fade show rounded-3" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  {infoMessage}
                  <button type="button" className="btn-close" onClick={() => setInfoMessage('')}></button>
                </div>
              )}

              {error && (
                <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 bg-light"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@traveladvisor.com or priya@example.com"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold small">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 bg-light"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg rounded-pill fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Authenticating...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>
              
              <hr className="my-4" />

              <div className="bg-light p-3 rounded-3 mb-4 text-center">
                <small className="text-muted d-block fw-bold mb-1">Demo Credentials:</small>
                <small className="text-muted d-block">Admin: <code>admin@traveladvisor.com</code> / <code>Admin@123</code></small>
                <small className="text-muted d-block">User: <code>priya@example.com</code> / <code>User@1234</code></small>
              </div>

              <div className="text-center">
                <p className="mb-0 text-muted small">Don't have an account?</p>
                <Link to="/register" className="btn btn-outline-primary rounded-pill mt-2 px-4">
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;