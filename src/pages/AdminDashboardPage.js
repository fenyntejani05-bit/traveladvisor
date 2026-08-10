import React, { useState, useEffect } from 'react';
import { destinationService, hotelService, categoryService, getErrorMessage } from '../services/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('destinations');

  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Destination Form State
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState(null);
  const [destForm, setDestForm] = useState({
    category_id: '',
    name: '',
    state: '',
    city: '',
    description: '',
    budget: '',
    best_time_to_visit: '',
    rating: '4.5',
    image: '',
  });

  // Hotel Form State
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    destination_id: '',
    hotel_name: '',
    location: '',
    price_per_night: '',
    rating: '4.5',
    image: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [destRes, hotelsRes, catRes] = await Promise.all([
        destinationService.getAll({ limit: 50 }),
        hotelService.getAll({ limit: 50 }),
        categoryService.getAll(),
      ]);

      if (destRes.data?.data?.destinations) setDestinations(destRes.data.data.destinations);
      if (hotelsRes.data?.data?.hotels) setHotels(hotelsRes.data.data.hotels);
      if (catRes.data?.data?.categories) setCategories(catRes.data.data.categories);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------------------------------------------
  // DESTINATION CRUD HANDLERS
  // -------------------------------------------------------------
  const openNewDestModal = () => {
    setEditingDestId(null);
    setDestForm({
      category_id: categories[0]?.id || '1',
      name: '',
      state: '',
      city: '',
      description: '',
      budget: '3000',
      best_time_to_visit: '',
      rating: '4.5',
      image: '',
    });
    setDestModalOpen(true);
  };

  const openEditDestModal = (dest) => {
    setEditingDestId(dest.id);
    setDestForm({
      category_id: dest.category_id,
      name: dest.name,
      state: dest.state,
      city: dest.city,
      description: dest.description,
      budget: dest.budget,
      best_time_to_visit: dest.best_time_to_visit || '',
      rating: dest.rating,
      image: dest.image || '',
    });
    setDestModalOpen(true);
  };

  const handleDestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        category_id: parseInt(destForm.category_id, 10),
        name: destForm.name,
        state: destForm.state,
        city: destForm.city,
        description: destForm.description,
        budget: parseFloat(destForm.budget),
        best_time_to_visit: destForm.best_time_to_visit || null,
        rating: parseFloat(destForm.rating),
        image: destForm.image || null,
      };

      if (editingDestId) {
        await destinationService.update(editingDestId, payload);
        setSuccess('Destination updated successfully!');
      } else {
        await destinationService.create(payload);
        setSuccess('Destination created successfully!');
      }

      setDestModalOpen(false);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteDest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination? All linked hotels and reviews will be removed.')) return;
    try {
      await destinationService.delete(id);
      setSuccess('Destination deleted successfully!');
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // -------------------------------------------------------------
  // HOTEL CRUD HANDLERS
  // -------------------------------------------------------------
  const openNewHotelModal = () => {
    setEditingHotelId(null);
    setHotelForm({
      destination_id: destinations[0]?.id || '1',
      hotel_name: '',
      location: '',
      price_per_night: '5000',
      rating: '4.5',
      image: '',
    });
    setHotelModalOpen(true);
  };

  const openEditHotelModal = (hotel) => {
    setEditingHotelId(hotel.id);
    setHotelForm({
      destination_id: hotel.destination_id,
      hotel_name: hotel.hotel_name,
      location: hotel.location,
      price_per_night: hotel.price_per_night,
      rating: hotel.rating,
      image: hotel.image || '',
    });
    setHotelModalOpen(true);
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        destination_id: parseInt(hotelForm.destination_id, 10),
        hotel_name: hotelForm.hotel_name,
        location: hotelForm.location,
        price_per_night: parseFloat(hotelForm.price_per_night),
        rating: parseFloat(hotelForm.rating),
        image: hotelForm.image || null,
      };

      if (editingHotelId) {
        await hotelService.update(editingHotelId, payload);
        setSuccess('Hotel updated successfully!');
      } else {
        await hotelService.create(payload);
        setSuccess('Hotel created successfully!');
      }

      setHotelModalOpen(false);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await hotelService.delete(id);
      setSuccess('Hotel deleted successfully!');
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="container py-5 mt-5 min-vh-100 fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1"><i className="bi bi-shield-lock-fill text-warning me-2"></i>Admin Dashboard</h1>
          <p className="text-muted mb-0">Manage destinations and hotel listings across India.</p>
        </div>
        <div>
          {activeTab === 'destinations' ? (
            <button onClick={openNewDestModal} className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-plus-circle me-2"></i>Add Destination
            </button>
          ) : (
            <button onClick={openNewHotelModal} className="btn btn-success rounded-pill px-4">
              <i className="bi bi-plus-circle me-2"></i>Add Hotel
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show rounded-4 mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>{success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-4 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Nav Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-4 shadow-sm">
        <li className="nav-item">
          <button 
            className={`nav-link rounded-pill px-4 fw-bold ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            Destinations ({destinations.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link rounded-pill px-4 fw-bold ${activeTab === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotels')}
          >
            Hotels ({hotels.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading admin data...</span>
          </div>
          <p className="mt-2 text-muted">Fetching administrative records...</p>
        </div>
      ) : activeTab === 'destinations' ? (
        /* DESTINATIONS TABLE */
        <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((d) => (
                  <tr key={d.id}>
                    <td>#{d.id}</td>
                    <td className="fw-bold">{d.name}</td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{d.category_name}</span></td>
                    <td>{d.city}, {d.state}</td>
                    <td>₹{d.budget}</td>
                    <td><i className="bi bi-star-fill text-warning me-1"></i>{parseFloat(d.rating || 0).toFixed(1)}</td>
                    <td className="text-end">
                      <button onClick={() => openEditDestModal(d)} className="btn btn-outline-primary btn-sm rounded-circle me-1" title="Edit">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDeleteDest(d.id)} className="btn btn-outline-danger btn-sm rounded-circle" title="Delete">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* HOTELS TABLE */
        <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Hotel Name</th>
                  <th>Destination</th>
                  <th>Location</th>
                  <th>Price / Night</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h.id}>
                    <td>#{h.id}</td>
                    <td className="fw-bold">{h.hotel_name}</td>
                    <td>{h.destination_name}</td>
                    <td>{h.location}</td>
                    <td>₹{h.price_per_night}</td>
                    <td><i className="bi bi-star-fill text-warning me-1"></i>{h.rating}</td>
                    <td className="text-end">
                      <button onClick={() => openEditHotelModal(h)} className="btn btn-outline-primary btn-sm rounded-circle me-1" title="Edit">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDeleteHotel(h.id)} className="btn btn-outline-danger btn-sm rounded-circle" title="Delete">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DESTINATION MODAL */}
      {destModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editingDestId ? 'Edit Destination' : 'Add New Destination'}</h5>
                <button type="button" className="btn-close" onClick={() => setDestModalOpen(false)}></button>
              </div>
              <form onSubmit={handleDestSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Destination Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={destForm.name}
                        onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                        placeholder="e.g. Munnar Hill Station"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Category</label>
                      <select 
                        className="form-select"
                        required
                        value={destForm.category_id}
                        onChange={(e) => setDestForm({ ...destForm, category_id: e.target.value })}
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.category_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">City</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={destForm.city}
                        onChange={(e) => setDestForm({ ...destForm, city: e.target.value })}
                        placeholder="e.g. Munnar"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">State</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={destForm.state}
                        onChange={(e) => setDestForm({ ...destForm, state: e.target.value })}
                        placeholder="e.g. Kerala"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Estimated Daily Budget (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        required 
                        value={destForm.budget}
                        onChange={(e) => setDestForm({ ...destForm, budget: e.target.value })}
                        placeholder="3500"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Best Time to Visit</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={destForm.best_time_to_visit}
                        onChange={(e) => setDestForm({ ...destForm, best_time_to_visit: e.target.value })}
                        placeholder="e.g. November to February"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Rating (0 - 5)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        max="5"
                        className="form-control" 
                        value={destForm.rating}
                        onChange={(e) => setDestForm({ ...destForm, rating: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Description</label>
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        required 
                        value={destForm.description}
                        onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                        placeholder="Provide detailed description of attraction..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Image URL (Optional)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={destForm.image}
                        onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setDestModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">
                    {editingDestId ? 'Save Changes' : 'Create Destination'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* HOTEL MODAL */}
      {hotelModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editingHotelId ? 'Edit Hotel' : 'Add New Hotel'}</h5>
                <button type="button" className="btn-close" onClick={() => setHotelModalOpen(false)}></button>
              </div>
              <form onSubmit={handleHotelSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Hotel Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={hotelForm.hotel_name}
                        onChange={(e) => setHotelForm({ ...hotelForm, hotel_name: e.target.value })}
                        placeholder="e.g. Taj Lake Palace"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Belongs to Destination</label>
                      <select 
                        className="form-select"
                        required
                        value={hotelForm.destination_id}
                        onChange={(e) => setHotelForm({ ...hotelForm, destination_id: e.target.value })}
                      >
                        {destinations.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.city})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold">Location Address</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={hotelForm.location}
                        onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                        placeholder="e.g. Pichola Lake, Udaipur"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Price per Night (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        required 
                        value={hotelForm.price_per_night}
                        onChange={(e) => setHotelForm({ ...hotelForm, price_per_night: e.target.value })}
                        placeholder="12000"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Rating (0 - 5)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        max="5"
                        className="form-control" 
                        value={hotelForm.rating}
                        onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Image URL (Optional)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={hotelForm.image}
                        onChange={(e) => setHotelForm({ ...hotelForm, image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setHotelModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success rounded-pill px-4">
                    {editingHotelId ? 'Save Changes' : 'Create Hotel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
