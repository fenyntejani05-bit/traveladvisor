import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { destinationService, categoryService, getErrorMessage } from '../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';

const TRAVEL_PREFERENCES = [
  { value: '', label: 'All Preferences' },
  { value: 'adventure', label: '🏔️ Adventure' },
  { value: 'relaxation', label: '🌴 Relaxation' },
  { value: 'cultural', label: '🏛️ Cultural' },
  { value: 'pilgrimage', label: '🕌 Pilgrimage' },
  { value: 'wildlife', label: '🐾 Wildlife' },
  { value: 'beach', label: '🏖️ Beach' },
  { value: 'honeymoon', label: '💑 Honeymoon' },
  { value: 'family', label: '👨‍👩‍👧 Family' },
];

const DestinationListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [travelFrom, setTravelFrom] = useState('');
  const [travelTo, setTravelTo] = useState('');
  const [travelPreference, setTravelPreference] = useState('');
  
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load filter options (categories and states) on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [catRes, stateRes] = await Promise.all([
          categoryService.getAll(),
          destinationService.getStates(),
        ]);
        if (catRes.data?.data?.categories) {
          setCategories(catRes.data.data.categories);
        }
        if (stateRes.data?.data?.states) {
          setStates(stateRes.data.data.states);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };

    fetchFilterOptions();
  }, []);

  // Sync search input with URL search param changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch destinations whenever filters, page, or URL search parameters change
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };
        const activeSearch = searchParams.get('search') || '';
        if (activeSearch.trim()) params.search = activeSearch.trim();
        if (selectedCategory) params.category_id = selectedCategory;
        if (selectedState) params.state = selectedState;

        const res = await destinationService.getAll(params);
        if (res.data?.data?.destinations) {
          let results = res.data.data.destinations;
          // Client-side filter by travel preference keyword match
          if (travelPreference) {
            results = results.filter(dest => {
              const hay = `${dest.category_name || ''} ${dest.best_time_to_visit || ''} ${dest.description || ''}`.toLowerCase();
              return hay.includes(travelPreference.toLowerCase());
            });
          }
          setDestinations(results);
          if (res.data.data.pagination) {
            setPagination((prev) => ({
              ...prev,
              ...res.data.data.pagination,
            }));
          }
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, selectedCategory, selectedState, travelPreference, pagination.page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchParams(searchTerm ? { search: searchTerm } : {});
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedState('');
    setTravelFrom('');
    setTravelTo('');
    setTravelPreference('');
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedState || travelFrom || travelTo || travelPreference;

  const getImageSrc = (dest) => {
    if (!dest.image) return FALLBACK_IMAGE;
    if (dest.image.startsWith('http')) return dest.image;
    const base = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${base}/${dest.image.replace(/^\//, '')}`;
  };

  return (
    <div className="container py-5 mt-5 min-vh-100 fade-in-up">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold mb-3">Explore Destinations in India</h1>
          <p className="text-muted lead max-w-2xl mx-auto">
            Discover breathtaking places, beach resorts, hill stations, and UNESCO World Heritage sites across India.
          </p>
        </div>
      </div>
      
      {/* ── Filter Bar ── */}
      <div className="filter-bar rounded-4 shadow-sm p-4 mb-5">

        {/* Row 1: Search */}
        <div className="row g-3 mb-3">
          <div className="col-12">
            <label className="filter-label">🔍 Search Destination</label>
            <form onSubmit={handleSearchSubmit}>
              <div className="search-container shadow-none border bg-light w-100" style={{ maxWidth: '100%' }}>
                <i className="bi bi-search text-muted ms-3 fs-5"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Goa, Manali, Jaipur, Taj Mahal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-premium btn-sm rounded-pill px-3 m-1">Search</button>
              </div>
            </form>
          </div>
        </div>

        {/* Row 2: Date + Preference + Category + State */}
        <div className="row g-3 align-items-end">

          {/* Travel From */}
          <div className="col-lg-3 col-md-6">
            <label className="filter-label">📅 Travel From</label>
            <input
              type="date"
              className="form-control filter-input"
              value={travelFrom}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setTravelFrom(e.target.value)}
            />
          </div>

          {/* Travel To */}
          <div className="col-lg-3 col-md-6">
            <label className="filter-label">📅 Travel To</label>
            <input
              type="date"
              className="form-control filter-input"
              value={travelTo}
              min={travelFrom || new Date().toISOString().split('T')[0]}
              onChange={(e) => setTravelTo(e.target.value)}
            />
          </div>

          {/* Travel Preference */}
          <div className="col-lg-3 col-md-6">
            <label className="filter-label">🎯 Travel Preference</label>
            <select
              className="form-select filter-input"
              value={travelPreference}
              onChange={(e) => { setTravelPreference(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
            >
              {TRAVEL_PREFERENCES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="col-lg-3 col-md-6">
            <label className="filter-label">🗂️ Category</label>
            <select
              className="form-select filter-input"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="col-lg-3 col-md-6">
            <label className="filter-label">📍 State</label>
            <select
              className="form-select filter-input"
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
            >
              <option value="">All States</option>
              {states.map((st, idx) => (
                <option key={idx} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <div className="col-lg-3 col-md-6 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-danger rounded-pill w-100 py-2"
                onClick={handleClearFilters}
              >
                <i className="bi bi-x-circle me-2"></i>Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {travelFrom && travelTo && (
              <span className="badge filter-chip">
                <i className="bi bi-calendar-range me-1"></i>
                {travelFrom} → {travelTo}
              </span>
            )}
            {travelPreference && (
              <span className="badge filter-chip">
                {TRAVEL_PREFERENCES.find(p => p.value === travelPreference)?.label}
              </span>
            )}
            {selectedCategory && (
              <span className="badge filter-chip">
                <i className="bi bi-tag me-1"></i>
                {categories.find(c => String(c.id) === String(selectedCategory))?.category_name}
              </span>
            )}
            {selectedState && (
              <span className="badge filter-chip">
                <i className="bi bi-geo-alt me-1"></i>{selectedState}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-4 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="container py-5 text-center my-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="fw-bold">Fetching destinations from database...</h4>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="row g-4">
            {destinations.length > 0 ? (
              destinations.map(dest => (
                <div className="col-lg-4 col-md-6 fade-in-up" key={dest.id}>
                  <div className="card premium-card h-100 border-0 shadow-sm">
                    <div className="card-img-wrapper" style={{ height: '220px' }}>
                      <span className="card-badge bg-white text-dark shadow-sm">
                        <i className="bi bi-star-fill text-warning me-1"></i> {parseFloat(dest.rating || 0).toFixed(1)}
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
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h5 className="card-title fw-bold mb-0">{dest.name}</h5>
                      </div>
                      <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{dest.city}, {dest.state}</p>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {dest.category_name && (
                          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill">
                            {dest.category_name}
                          </span>
                        )}
                        {dest.best_time_to_visit && (
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill">
                            <i className="bi bi-calendar-event me-1"></i> {dest.best_time_to_visit}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-muted small mb-4 flex-grow-1 line-clamp-3">{dest.description}</p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                        <div>
                          <span className="text-muted small d-block">Est. Daily Budget</span>
                          <span className="fs-5 fw-bold text-primary">₹{dest.budget}</span>
                        </div>
                        <Link to={`/destinations/${dest.id}`} className="btn btn-premium px-4 rounded-pill">
                          Explore Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-search fs-1"></i>
                </div>
                <h4 className="fw-bold">No destinations found</h4>
                <p className="text-muted">Try adjusting your search query, category, or state filters.</p>
                <button className="btn btn-outline-premium mt-3 rounded-pill px-4" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
              <button 
                className="btn btn-outline-primary rounded-circle p-2"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="fw-bold">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button 
                className="btn btn-outline-primary rounded-circle p-2"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DestinationListingPage;