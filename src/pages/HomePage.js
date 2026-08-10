import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationService } from '../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';

const getImageSrc = (dest) => {
  if (!dest.image) return FALLBACK_IMAGE;
  if (dest.image.startsWith('http')) return dest.image;
  const base = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace('/api', '')
    : 'http://localhost:5000';
  return `${base}/${dest.image.replace(/^\//, '')}`;
};

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingDestinations = async () => {
      try {
        setLoading(true);
        const response = await destinationService.getAll({ limit: 3, page: 1 });
        if (response.data && response.data.data && response.data.data.destinations) {
          setFeaturedDestinations(response.data.data.destinations);
        }
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
        setError('Unable to load trending destinations. Please check API server.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingDestinations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="home-page fade-in-up">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title fw-bold">
                Discover Your <span style={{ color: 'var(--primary)' }}>Next Adventure</span>
              </h1>
              <p className="hero-subtitle">
                Explore India's most breathtaking destinations. Curated travel guides, verified hotels, and real traveler reviews.
              </p>
              
              <form onSubmit={handleSearch} className="search-container mt-4 mb-5">
                <i className="bi bi-search text-muted ms-2 fs-5"></i>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search Goa, Manali, Jaipur, Taj Mahal..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-premium rounded-pill px-4 m-1">Search</button>
              </form>
              

            </div>
            
            <div className="col-lg-6 mt-5 mt-lg-0 position-relative d-none d-lg-block">
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80" 
                  alt="India Tourism" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ transform: 'rotate(2deg)', transition: 'all 0.3s ease' }}
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold mb-2">Trending Destinations in India</h2>
              <p className="text-muted mb-0">Most popular choices for travelers from our database.</p>
            </div>
            <Link to="/destinations" className="btn btn-outline-premium rounded-pill px-4 d-none d-md-block">
              View All <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading destinations...</span>
              </div>
              <p className="mt-2 text-muted">Fetching latest destinations from API...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning rounded-4 text-center p-4">
              <i className="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
              {error}
            </div>
          ) : (
            <div className="row g-4">
              {featuredDestinations.map(dest => (
                <div className="col-lg-4 col-md-6" key={dest.id}>
                  <div className="card premium-card h-100">
                    <div className="card-img-wrapper" style={{ height: '220px' }}>
                      <span className="card-badge">
                        <i className="bi bi-star-fill text-warning me-1"></i> 
                        {parseFloat(dest.rating || 0).toFixed(1)}
                      </span>
                      <img 
                        src={getImageSrc(dest)}
                        alt={dest.name} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                      />
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold mb-0">{dest.name}</h5>
                      </div>
                      <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{dest.city}, {dest.state}</p>
                      <p className="text-muted small mb-4 line-clamp-2">{dest.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                        <div>
                          <span className="text-muted small d-block">Est. Daily Budget</span>
                          <span className="fs-5 fw-bold text-primary">₹{dest.budget}</span>
                        </div>
                        <Link to={`/destinations/${dest.id}`} className="btn btn-premium rounded-circle p-2" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4 d-md-none">
            <Link to="/destinations" className="btn btn-outline-premium rounded-pill px-4 w-100">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-white py-5">
        <div className="container py-5">
          <div className="text-center mb-5 max-w-2xl mx-auto">
            <h2 className="fw-bold">Why Choose TravelAdvisor</h2>
            <p className="text-muted">We provide verified listings and community reviews across major Indian tourist hubs.</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4 text-center p-4">
              <div className="d-inline-flex bg-primary bg-opacity-10 text-primary p-4 rounded-circle mb-4">
                <i className="bi bi-shield-check fs-1"></i>
              </div>
              <h5 className="fw-bold">Verified Hotel Listings</h5>
              <p className="text-muted">Browse top rated luxury and budget hotels linked directly to destination guides.</p>
            </div>
            <div className="col-md-4 text-center p-4">
              <div className="d-inline-flex bg-danger bg-opacity-10 text-danger p-4 rounded-circle mb-4">
                <i className="bi bi-compass fs-1"></i>
              </div>
              <h5 className="fw-bold">State & Category Filters</h5>
              <p className="text-muted">Easily filter by Beaches, Hill Stations, Heritage, Wildlife, and Pilgrimage destinations.</p>
            </div>
            <div className="col-md-4 text-center p-4">
              <div className="d-inline-flex bg-success bg-opacity-10 text-success p-4 rounded-circle mb-4">
                <i className="bi bi-chat-left-quote fs-1"></i>
              </div>
              <h5 className="fw-bold">Real Traveler Reviews</h5>
              <p className="text-muted">Share experiences and read honest reviews from authenticated users.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;