/**
 * TripStopManagement Page
 * Manage stops/cities in a trip with add, reorder, delete functionality
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TripStopManagement.css';
import Alert from '../../components/Alert/Alert';
import { PlusIcon, MapPinIcon, CalendarIcon, TrashIcon, EditIcon } from '../../assets/svg/Icons';
import { tripAPI, stopAPI } from '../../services/api';

const TripStopManagement = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [newStop, setNewStop] = useState({
    cityName: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTripAndStops();
  }, [tripId]);

  /**
   * Load trip and stops data
   */
  const loadTripAndStops = async () => {
    try {
      const [tripData, stopsData] = await Promise.all([
        tripAPI.getById(tripId),
        stopAPI.getAll(tripId),
      ]);
      setTrip(tripData.trip);
      setStops(stopsData.stops || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load trip data' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate stop form
   */
  const validateStopForm = () => {
    const newErrors = {};

    if (!newStop.cityName.trim()) {
      newErrors.cityName = 'City name is required';
    }

    if (!newStop.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!newStop.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (newStop.startDate && newStop.endDate) {
      const start = new Date(newStop.startDate);
      const end = new Date(newStop.endDate);
      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);

      if (start < tripStart || start > tripEnd) {
        newErrors.startDate = 'Start date must be within trip dates';
      }

      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }

      if (end > tripEnd) {
        newErrors.endDate = 'End date must be within trip dates';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle add stop
   */
  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!validateStopForm()) return;

    try {
      const response = await stopAPI.create(tripId, {
        cityName: newStop.cityName,
        startDate: newStop.startDate,
        endDate: newStop.endDate,
        order: stops.length + 1,
      });

      setStops([...stops, response.stop]);
      setNewStop({ cityName: '', startDate: '', endDate: '' });
      setShowAddForm(false);
      setAlert({ type: 'success', message: 'Stop added successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to add stop' });
    }
  };

  /**
   * Handle delete stop
   */
  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to delete this stop?')) return;

    try {
      await stopAPI.delete(tripId, stopId);
      setStops(stops.filter((s) => s.id !== stopId));
      setAlert({ type: 'success', message: 'Stop deleted successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete stop' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="trip-stops-page">
      {/* Professional Header */}
      <div className="page-header">
        <div className="page-header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Dashboard</span>
          </button>
          <div className="trip-header-info">
            <h1 className="trip-title">{trip?.name}</h1>
            <p className="trip-subtitle">Add and manage your travel destinations</p>
          </div>
          <button
            className="add-stop-btn-header"
            onClick={() => setShowAddForm(true)}
          >
            <PlusIcon width={20} height={20} />
            <span>Add Stop</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="trip-stops-container">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        {/* Add Stop Form */}
        {showAddForm && (
          <div className="add-stop-card">
            <h3 className="add-stop-title">Add New Stop</h3>
            <form className="add-stop-form" onSubmit={handleAddStop}>
              <div className="form-group">
                <label className="form-label">City Name <span className="required">*</span></label>
                <input
                  type="text"
                  className={`form-input ${errors.cityName ? 'error' : ''}`}
                  placeholder="e.g., Paris, France"
                  value={newStop.cityName}
                  onChange={(e) => setNewStop({ ...newStop, cityName: e.target.value })}
                />
                {errors.cityName && <span className="form-error">{errors.cityName}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Arrival Date <span className="required">*</span></label>
                  <input
                    type="date"
                    className={`form-input ${errors.startDate ? 'error' : ''}`}
                    value={newStop.startDate}
                    onChange={(e) => setNewStop({ ...newStop, startDate: e.target.value })}
                  />
                  {errors.startDate && <span className="form-error">{errors.startDate}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Departure Date <span className="required">*</span></label>
                  <input
                    type="date"
                    className={`form-input ${errors.endDate ? 'error' : ''}`}
                    value={newStop.endDate}
                    onChange={(e) => setNewStop({ ...newStop, endDate: e.target.value })}
                  />
                  {errors.endDate && <span className="form-error">{errors.endDate}</span>}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stops List */}
        <div className="stops-section">
          <div className="stops-header">
            <h2 className="stops-count">{stops.length} {stops.length === 1 ? 'Stop' : 'Stops'}</h2>
          </div>

          {stops.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MapPinIcon width={64} height={64} />
              </div>
              <h3 className="empty-title">No stops added yet</h3>
              <p className="empty-text">
                Start planning your journey by adding your first destination
              </p>
              <button className="empty-btn" onClick={() => setShowAddForm(true)}>
                <PlusIcon width={20} height={20} />
                <span>Add First Stop</span>
              </button>
            </div>
          ) : (
            <div className="stops-grid">
              {stops.map((stop, index) => (
                <div key={stop.id} className="stop-card">
                  <div className="stop-number-badge">{index + 1}</div>
                  <div className="stop-card-content">
                    <div className="stop-icon">
                      <MapPinIcon width={24} height={24} />
                    </div>
                    <div className="stop-details">
                      <h3 className="stop-city-name">{stop.cityName}</h3>
                      <div className="stop-dates">
                        <CalendarIcon width={16} height={16} />
                        <span>
                          {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="stop-actions">
                    <button
                      className="btn-manage"
                      onClick={() => navigate(`/trips/${tripId}/stops/${stop.id}/activities`)}
                    >
                      <EditIcon width={16} height={16} />
                      <span>Manage Activities</span>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteStop(stop.id)}
                    >
                      <TrashIcon width={16} height={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {stops.length > 0 && (
            <div className="next-step">
              <button
                className="btn-next"
                onClick={() => navigate(`/trips/${tripId}/health`)}
              >
                Continue to Trip Health & Timeline
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripStopManagement;
