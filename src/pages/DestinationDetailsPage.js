import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { destinationService, hotelService, reviewService, getErrorMessage } from '../services/api';

function DestinationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useAuth();

  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Form state (Add / Edit)
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Load destination, hotels, and reviews on mount or id change
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [destRes, hotelsRes, reviewsRes] = await Promise.all([
        destinationService.getById(id),
        hotelService.getByDestination(id).catch(() => ({ data: { data: { hotels: [] } } })),
        reviewService.getByDestination(id).catch(() => ({ data: { data: { reviews: [] } } })),
      ]);

      if (destRes.data?.data?.destination) {
        setDestination(destRes.data.data.destination);
      }
      if (hotelsRes.data?.data?.hotels) {
        setHotels(hotelsRes.data.data.hotels);
      }
      if (reviewsRes.data?.data?.reviews) {
        setReviews(reviewsRes.data.data.reviews);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle Review Submission (Create or Update)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      if (editingReviewId) {
        // Update existing review
        await reviewService.update(editingReviewId, {
          rating: parseInt(reviewRating, 10),
          review: reviewText,
        });
        setReviewSuccess('Review updated successfully!');
      } else {
        // Create new review
        await reviewService.create({
          destination_id: parseInt(id, 10),
          rating: parseInt(reviewRating, 10),
          review: reviewText,
        });
        setReviewSuccess('Review posted successfully!');
      }

      // Reset form & reload data to sync rating
      setReviewText('');
      setReviewRating(5);
      setEditingReviewId(null);
      await loadData();
    } catch (err) {
      setReviewError(getErrorMessage(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  // Start editing a review
  const handleEditClick = (rev) => {
    setEditingReviewId(rev.id);
    setReviewRating(rev.rating);
    setReviewText(rev.review);
    setReviewError('');
    setReviewSuccess('');
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setReviewRating(5);
    setReviewText('');
    setReviewError('');
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewService.delete(reviewId);
      setReviewSuccess('Review deleted successfully!');
      await loadData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading destination...</span>
        </div>
        <h4 className="fw-bold">Loading destination details...</h4>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container py-5 mt-5 min-vh-100 text-center">
        <div className="alert alert-danger shadow-sm p-4 rounded-4 max-w-2xl mx-auto">
          <i className="bi bi-exclamation-octagon-fill fs-1 d-block mb-3"></i>
          <h4 className="fw-bold">Destination Not Found</h4>
          <p>{error || 'The requested destination could not be loaded.'}</p>
          <Link to="/destinations" className="btn btn-primary rounded-pill px-4 mt-2">
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  const bgImage = destination.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="destination-details fade-in-up pb-5 bg-light">
      {/* Hero Header */}
      <div 
        className="detail-hero position-relative"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }}
      >
        <div className="detail-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>
        <div className="detail-content container position-relative d-flex justify-content-between align-items-end pb-5 pt-5 min-vh-50 text-white">
          <div>
            <span className="badge bg-primary px-3 py-2 rounded-pill mb-3">
              {destination.category_name || 'Destination'}
            </span>
            <h1 className="detail-title fw-bold text-white display-4">{destination.name}</h1>
            <div className="d-flex align-items-center gap-3 text-light">
              <span className="bg-warning text-dark px-3 py-1 rounded-pill fw-bold">
                <i className="bi bi-star-fill me-1"></i> {parseFloat(destination.rating || 0).toFixed(1)} / 5.0
              </span>
              <span>({reviews.length} community reviews)</span>
              <span><i className="bi bi-geo-alt me-1"></i>{destination.city}, {destination.state}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row g-4">
          {/* Main Destination Info */}
          <div className="col-lg-8">
            <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Overview & Culture</h3>
                <div className="text-end">
                  <span className="text-muted d-block small">Est. Daily Budget</span>
                  <span className="fs-3 fw-bold text-primary">₹{destination.budget}</span>
                </div>
              </div>
              <p className="text-muted lh-lg mb-4 fs-5">{destination.description}</p>
              
              <div className="row g-3 mt-4 pt-4 border-top">
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3 bg-light p-3 rounded-4 h-100">
                    <i className="bi bi-geo-fill text-primary fs-3"></i>
                    <div>
                      <small className="text-muted d-block">City & State</small>
                      <span className="fw-bold">{destination.city}, {destination.state}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3 bg-light p-3 rounded-4 h-100">
                    <i className="bi bi-tag-fill text-success fs-3"></i>
                    <div>
                      <small className="text-muted d-block">Category</small>
                      <span className="fw-bold">{destination.category_name}</span>
                    </div>
                  </div>
                </div>
                {destination.best_time_to_visit && (
                  <div className="col-md-4">
                    <div className="d-flex align-items-center gap-3 bg-light p-3 rounded-4 h-100">
                      <i className="bi bi-calendar-event-fill text-warning fs-3"></i>
                      <div>
                        <small className="text-muted d-block">Best Time to Visit</small>
                        <span className="fw-bold">{destination.best_time_to_visit}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hotels Section */}
            <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Nearby Hotels & Resorts</h3>
                <span className="badge bg-secondary px-3 py-2 rounded-pill">{hotels.length} Available</span>
              </div>

              {hotels.length > 0 ? (
                <div className="row g-4">
                  {hotels.map((hotel) => (
                    <div className="col-md-6" key={hotel.id}>
                      <div className="card h-100 border-0 bg-light rounded-4 overflow-hidden">
                        <div style={{ height: '160px', overflow: 'hidden' }}>
                          <img 
                            src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'} 
                            alt={hotel.hotel_name} 
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="fw-bold mb-1">{hotel.hotel_name}</h6>
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-star-fill me-1"></i>{hotel.rating}
                            </span>
                          </div>
                          <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{hotel.location}</p>
                          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                            <span className="fw-bold text-primary">₹{hotel.price_per_night} / night</span>
                            <span className="badge bg-success bg-opacity-10 text-success">Verified Partner</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-light rounded-4">
                  <p className="text-muted mb-0">No hotel listings added for this destination yet.</p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm mb-4">
              <h3 className="fw-bold mb-4">Community Reviews ({reviews.length})</h3>

              {/* Add / Edit Review Form */}
              <div className="bg-light p-4 rounded-4 mb-5 border">
                <h5 className="fw-bold mb-3">
                  {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
                </h5>

                {!isAuthenticated ? (
                  <div className="alert alert-info mb-0 rounded-3">
                    Please <Link to="/login" className="fw-bold text-decoration-underline">log in</Link> to post or edit a review.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    {reviewSuccess && (
                      <div className="alert alert-success rounded-3 mb-3">{reviewSuccess}</div>
                    )}
                    {reviewError && (
                      <div className="alert alert-danger rounded-3 mb-3">{reviewError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Rating (1 to 5 Stars)</label>
                      <select 
                        className="form-select w-auto"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(e.target.value)}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                        <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                        <option value="3">⭐⭐⭐ 3 - Average</option>
                        <option value="2">⭐⭐ 2 - Poor</option>
                        <option value="1">⭐ 1 - Terrible</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Your Review</label>
                      <textarea
                        className="form-control rounded-3"
                        rows="3"
                        placeholder="Share details of your experience, best times to visit, local attractions..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                        minLength={10}
                      ></textarea>
                    </div>

                    <div className="d-flex gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary rounded-pill px-4"
                        disabled={submittingReview}
                      >
                        {submittingReview ? 'Submitting...' : editingReviewId ? 'Update Review' : 'Post Review'}
                      </button>

                      {editingReviewId && (
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary rounded-pill px-4"
                          onClick={handleCancelEdit}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => {
                    const isOwner = isAuthenticated && user && user.id === rev.user_id;
                    const canModify = isOwner || isAdmin;

                    return (
                      <div className="p-4 bg-light rounded-4 border-start border-4 border-primary" key={rev.id}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <i className="bi bi-person-fill"></i>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0">{rev.reviewer_name || 'Traveler'}</h6>
                              <small className="text-muted">{new Date(rev.created_at).toLocaleDateString()}</small>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-star-fill me-1"></i>{rev.rating} / 5
                            </span>
                            {canModify && (
                              <div className="btn-group btn-group-sm ms-2">
                                <button 
                                  className="btn btn-outline-primary btn-sm rounded-circle" 
                                  title="Edit Review"
                                  onClick={() => handleEditClick(rev)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm rounded-circle ms-1" 
                                  title="Delete Review"
                                  onClick={() => handleDeleteReview(rev.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-muted mb-0 mt-3 fs-6">{rev.review}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No reviews yet for this destination. Be the first to leave a review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold mb-3">Trip Quick Facts</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Destination</span>
                  <span className="fw-bold">{destination.name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">State</span>
                  <span className="fw-bold">{destination.state}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Category</span>
                  <span className="fw-bold">{destination.category_name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Rating</span>
                  <span className="fw-bold text-warning">
                    <i className="bi bi-star-fill me-1"></i>{parseFloat(destination.rating || 0).toFixed(1)} / 5
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Est. Budget</span>
                  <span className="fw-bold text-primary">₹{destination.budget} / day</span>
                </li>
              </ul>

              <Link to="/destinations" className="btn btn-outline-premium w-100 rounded-pill mb-2">
                Browse More Destinations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetailsPage;