/**
 * TripStopManagement - Premium Itinerary Builder
 * SYSTEM OVERRIDE: Completely rebuilt from scratch
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TripStopManagement.css';
import { 
  PlusIcon, 
  MapPinIcon, 
  CalendarIcon, 
  TrashIcon, 
  EditIcon,
  ChevronLeftIcon,
  CheckIcon,
  AlertIcon,
  DollarIcon,
  ActivityIcon,
  CloseIcon
} from '../../assets/svg/Icons';
import { tripAPI, stopAPI } from '../../services/api';

/**
 * DEMO DATA - Matches Dashboard demo trips
 * Provides realistic stop data when backend is unavailable
 */
const DEMO_TRIP_DATA = {
  'demo-ongoing-1': {
    trip: {
      id: 'demo-ongoing-1',
      name: 'European Adventure',
      description: 'Exploring the historic cities of Western Europe',
      startDate: '2025-12-28',
      endDate: '2026-01-15',
      budget: 4500,
      coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'Paris', country: 'France', startDate: '2025-12-28', endDate: '2026-01-02', budget: 1500, order: 1 },
      { id: 's2', cityName: 'Amsterdam', country: 'Netherlands', startDate: '2026-01-03', endDate: '2026-01-08', budget: 1200, order: 2 },
      { id: 's3', cityName: 'Berlin', country: 'Germany', startDate: '2026-01-09', endDate: '2026-01-15', budget: 1800, order: 3 }
    ]
  },
  'demo-ongoing-2': {
    trip: {
      id: 'demo-ongoing-2',
      name: 'Southeast Asia Explorer',
      description: 'Island hopping and cultural immersion',
      startDate: '2025-12-20',
      endDate: '2026-01-10',
      budget: 3200,
      coverPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'Bali', country: 'Indonesia', startDate: '2025-12-20', endDate: '2025-12-27', budget: 1000, order: 1 },
      { id: 's2', cityName: 'Bangkok', country: 'Thailand', startDate: '2025-12-28', endDate: '2026-01-03', budget: 1100, order: 2 },
      { id: 's3', cityName: 'Singapore', country: 'Singapore', startDate: '2026-01-04', endDate: '2026-01-10', budget: 1100, order: 3 }
    ]
  },
  'demo-scheduled-1': {
    trip: {
      id: 'demo-scheduled-1',
      name: 'Japan Cultural Journey',
      description: 'Cherry blossom season and ancient temples',
      startDate: '2026-03-20',
      endDate: '2026-04-05',
      budget: 5800,
      coverPhoto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'Tokyo', country: 'Japan', startDate: '2026-03-20', endDate: '2026-03-25', budget: 1800, order: 1 },
      { id: 's2', cityName: 'Kyoto', country: 'Japan', startDate: '2026-03-26', endDate: '2026-03-30', budget: 1500, order: 2 },
      { id: 's3', cityName: 'Osaka', country: 'Japan', startDate: '2026-03-31', endDate: '2026-04-02', budget: 1200, order: 3 },
      { id: 's4', cityName: 'Hiroshima', country: 'Japan', startDate: '2026-04-03', endDate: '2026-04-05', budget: 1300, order: 4 }
    ]
  },
  'demo-scheduled-2': {
    trip: {
      id: 'demo-scheduled-2',
      name: 'New York City Getaway',
      description: 'Business and leisure in the Big Apple',
      startDate: '2026-02-14',
      endDate: '2026-02-21',
      budget: 2800,
      coverPhoto: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'New York', country: 'USA', startDate: '2026-02-14', endDate: '2026-02-21', budget: 2800, order: 1 }
    ]
  },
  'demo-scheduled-3': {
    trip: {
      id: 'demo-scheduled-3',
      name: 'Mediterranean Coast',
      description: 'Coastal towns and ancient history',
      startDate: '2026-06-10',
      endDate: '2026-06-25',
      budget: 4200,
      coverPhoto: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'Rome', country: 'Italy', startDate: '2026-06-10', endDate: '2026-06-15', budget: 1500, order: 1 },
      { id: 's2', cityName: 'Athens', country: 'Greece', startDate: '2026-06-16', endDate: '2026-06-20', budget: 1300, order: 2 },
      { id: 's3', cityName: 'Barcelona', country: 'Spain', startDate: '2026-06-21', endDate: '2026-06-25', budget: 1400, order: 3 }
    ]
  },
  'demo-previous-1': {
    trip: {
      id: 'demo-previous-1',
      name: 'London Business Trip',
      description: 'Conference and client meetings',
      startDate: '2025-11-05',
      endDate: '2025-11-12',
      budget: 3500,
      coverPhoto: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'London', country: 'UK', startDate: '2025-11-05', endDate: '2025-11-12', budget: 3500, order: 1 }
    ]
  },
  'demo-previous-2': {
    trip: {
      id: 'demo-previous-2',
      name: 'Swiss Alps Retreat',
      description: 'Mountain hiking and relaxation',
      startDate: '2025-09-15',
      endDate: '2025-09-28',
      budget: 4800,
      coverPhoto: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'Zurich', country: 'Switzerland', startDate: '2025-09-15', endDate: '2025-09-20', budget: 1600, order: 1 },
      { id: 's2', cityName: 'Interlaken', country: 'Switzerland', startDate: '2025-09-21', endDate: '2025-09-24', budget: 1500, order: 2 },
      { id: 's3', cityName: 'Zermatt', country: 'Switzerland', startDate: '2025-09-25', endDate: '2025-09-28', budget: 1700, order: 3 }
    ]
  },
  'demo-previous-3': {
    trip: {
      id: 'demo-previous-3',
      name: 'Dubai Weekend',
      description: 'Shopping and luxury experiences',
      startDate: '2025-08-10',
      endDate: '2025-08-14',
      budget: 3200,
      coverPhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop'
    },
    stops: [
      { id: 's1', cityName: 'Dubai', country: 'UAE', startDate: '2025-08-10', endDate: '2025-08-14', budget: 3200, order: 1 }
    ]
  }
};

const TripStopManagement = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    cityName: '',
    country: '',
    startDate: '',
    endDate: '',
    budget: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    try {
      // Check if this is a demo trip first
      if (DEMO_TRIP_DATA[tripId]) {
        const demoData = DEMO_TRIP_DATA[tripId];
        setTrip(demoData.trip);
        setStops(demoData.stops || []);
        setLoading(false);
        return;
      }

      // Try loading from backend
      const [tripResponse, stopsResponse] = await Promise.all([
        tripAPI.getById(tripId),
        stopAPI.getAll(tripId)
      ]);
      
      setTrip(tripResponse.trip);
      setStops(stopsResponse.stops || []);
    } catch (error) {
      console.error('Failed to load trip data:', error);
      
      // Fallback to demo data if available
      if (DEMO_TRIP_DATA[tripId]) {
        const demoData = DEMO_TRIP_DATA[tripId];
        setTrip(demoData.trip);
        setStops(demoData.stops || []);
      } else {
        setAlert({ type: 'error', message: 'Failed to load trip data' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getCityImage = (cityName, country) => {
    const city = cityName?.toLowerCase() || '';
    const countryLower = country?.toLowerCase() || '';
    
    if (city.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=300&fit=crop';
    if (city.includes('tokyo')) return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=300&fit=crop';
    if (city.includes('bali')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=300&fit=crop';
    if (city.includes('new york')) return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=300&fit=crop';
    if (city.includes('london')) return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=300&fit=crop';
    if (city.includes('rome')) return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=300&fit=crop';
    if (city.includes('barcelona')) return 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=300&fit=crop';
    if (city.includes('dubai')) return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=300&fit=crop';
    if (countryLower.includes('japan')) return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=300&fit=crop';
    if (countryLower.includes('italy')) return 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=300&fit=crop';
    
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=300&fit=crop';
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTotalBudget = () => {
    return stops.reduce((sum, stop) => sum + (parseFloat(stop.budget) || 0), 0);
  };

  const getTotalDays = () => {
    return stops.reduce((sum, stop) => sum + calculateDays(stop.startDate, stop.endDate), 0);
  };

  const checkDateConflicts = () => {
    const conflicts = [];
    for (let i = 0; i < stops.length; i++) {
      for (let j = i + 1; j < stops.length; j++) {
        const start1 = new Date(stops[i].startDate);
        const end1 = new Date(stops[i].endDate);
        const start2 = new Date(stops[j].startDate);
        const end2 = new Date(stops[j].endDate);
        
        if ((start1 <= end2 && end1 >= start2)) {
          conflicts.push(`${stops[i].cityName} and ${stops[j].cityName}`);
        }
      }
    }
    return conflicts;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cityName.trim()) {
      newErrors.cityName = 'City name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
      
      if (trip) {
        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(trip.endDate);
        if (start < tripStart || end > tripEnd) {
          newErrors.startDate = 'Dates must be within trip dates';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const stopData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        order: stops.length + 1
      };

      const response = await stopAPI.create(tripId, stopData);
      
      setStops([...stops, response.stop]);
      setShowAddModal(false);
      resetForm();
      setAlert({ type: 'success', message: 'Stop added successfully!' });
      
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to add stop:', error);
      setAlert({ type: 'error', message: 'Failed to add stop. Please try again.' });
    }
  };

  const handleEditStop = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const stopData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0
      };

      const response = await stopAPI.update(tripId, editingStop.id, stopData);
      
      setStops(stops.map(s => s.id === editingStop.id ? response.stop : s));
      setEditingStop(null);
      resetForm();
      setAlert({ type: 'success', message: 'Stop updated successfully!' });
      
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to update stop:', error);
      setAlert({ type: 'error', message: 'Failed to update stop. Please try again.' });
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to delete this stop?')) return;

    try {
      await stopAPI.delete(tripId, stopId);
      setStops(stops.filter(s => s.id !== stopId));
      setAlert({ type: 'success', message: 'Stop deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to delete stop:', error);
      setAlert({ type: 'error', message: 'Failed to delete stop. Please try again.' });
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (stop) => {
    setFormData({
      cityName: stop.cityName || '',
      country: stop.country || '',
      startDate: stop.startDate || '',
      endDate: stop.endDate || '',
      budget: stop.budget || '',
      notes: stop.notes || ''
    });
    setEditingStop(stop);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingStop(null);
    resetForm();
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      cityName: '',
      country: '',
      startDate: '',
      endDate: '',
      budget: '',
      notes: ''
    });
    setErrors({});
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newStops = [...stops];
    const draggedStop = newStops[draggedIndex];
    newStops.splice(draggedIndex, 1);
    newStops.splice(index, 0, draggedStop);
    
    setStops(newStops);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex !== null) {
      try {
        const updatedStops = stops.map((stop, index) => ({
          ...stop,
          order: index + 1
        }));
        
        await Promise.all(
          updatedStops.map(stop => 
            stopAPI.update(tripId, stop.id, { order: stop.order })
          )
        );
        
        setStops(updatedStops);
      } catch (error) {
        console.error('Failed to update stop order:', error);
        loadTripData();
      }
    }
    setDraggedIndex(null);
  };

  if (loading) {
    return (
      <div className="trip-stops-loading">
        <div className="loading-spinner"></div>
        <p>Loading itinerary...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-stops-error">
        <p>Trip not found</p>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const conflicts = checkDateConflicts();

  return (
    <div className="trip-stops-page">
      {/* Header Section */}
      <header className="trip-stops-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ChevronLeftIcon size={20} />
            <span>Back to Trips</span>
          </button>
          <div className="header-info">
            <h1 className="trip-title">{trip.name}</h1>
            <div className="trip-meta">
              <div className="meta-item">
                <CalendarIcon size={18} />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
              <div className="meta-item">
                <MapPinIcon size={18} />
                <span>{stops.length} stop{stops.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {alert && (
        <div className={`alert-notification alert-${alert.type}`}>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="trip-stops-main">
        <div className="trip-stops-container">
          
          {/* Stops Timeline */}
          <div className="stops-timeline-section">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Trip Itinerary</h2>
                <p className="section-subtitle">Drag and drop stops to reorder your journey</p>
              </div>
              <button className="btn-add-stop" onClick={openAddModal}>
                <PlusIcon size={20} />
                <span>Add Stop</span>
              </button>
            </div>

            {stops.length === 0 ? (
              /* Empty State */
              <div className="empty-stops-state">
                <div className="empty-illustration">
                  <div className="illustration-circle">
                    <MapPinIcon size={80} />
                  </div>
                </div>
                <h3 className="empty-title">No stops added yet</h3>
                <p className="empty-description">
                  Start building your itinerary by adding cities and destinations to your trip
                </p>
                <button className="btn-add-first-stop" onClick={openAddModal}>
                  <PlusIcon size={22} />
                  <span>Add Your First Stop</span>
                </button>
              </div>
            ) : (
              /* Stops Timeline */
              <div className="stops-timeline">
                {stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className={`stop-card ${draggedIndex === index ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Drag Handle */}
                    <div className="stop-drag-handle">
                      ⋮⋮
                    </div>

                    {/* Stop Number */}
                    <div className="stop-number-badge">
                      <span>{index + 1}</span>
                    </div>

                    {/* City Image Banner */}
                    <div className="stop-image-banner">
                      <img 
                        src={getCityImage(stop.cityName, stop.country)} 
                        alt={stop.cityName}
                        className="stop-image"
                      />
                      <div className="image-overlay"></div>
                    </div>

                    {/* Stop Details */}
                    <div className="stop-details">
                      <div className="stop-header">
                        <div className="stop-location">
                          <h3 className="stop-city">{stop.cityName}</h3>
                          {stop.country && <span className="stop-country">{stop.country}</span>}
                        </div>
                        <div className="stop-actions">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => openEditModal(stop)}
                            title="Edit stop"
                          >
                            <EditIcon size={18} />
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteStop(stop.id)}
                            title="Delete stop"
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="stop-info-grid">
                        <div className="info-item">
                          <CalendarIcon size={16} />
                          <div className="info-content">
                            <span className="info-label">Duration</span>
                            <span className="info-value">
                              {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
                              <span className="days-badge">{calculateDays(stop.startDate, stop.endDate)} days</span>
                            </span>
                          </div>
                        </div>

                        {stop.budget > 0 && (
                          <div className="info-item">
                            <DollarIcon size={16} />
                            <div className="info-content">
                              <span className="info-label">Budget</span>
                              <span className="info-value">${parseFloat(stop.budget).toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        <div className="info-item">
                          <ActivityIcon size={16} />
                          <div className="info-content">
                            <span className="info-label">Activities</span>
                            <span className="info-value">{stop.activitiesCount || 0} planned</span>
                          </div>
                        </div>
                      </div>

                      {stop.notes && (
                        <div className="stop-notes">
                          <p>{stop.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Summary Panel */}
          <aside className="summary-panel">
            <div className="panel-sticky">
              <h3 className="panel-title">Trip Summary</h3>
              
              <div className="summary-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <MapPinIcon size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total Stops</span>
                    <span className="stat-value">{stops.length}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <CalendarIcon size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total Days</span>
                    <span className="stat-value">{getTotalDays()}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <DollarIcon size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total Budget</span>
                    <span className="stat-value">${getTotalBudget().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {conflicts.length > 0 && (
                <div className="warning-box">
                  <div className="warning-header">
                    <AlertIcon size={20} />
                    <span>Date Conflicts</span>
                  </div>
                  <ul className="warning-list">
                    {conflicts.map((conflict, idx) => (
                      <li key={idx}>{conflict}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="btn-continue" onClick={() => navigate(`/trip/${tripId}/activities`)}>
                <span>Continue to Activities</span>
                <CheckIcon size={18} />
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || editingStop) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingStop ? 'Edit Stop' : 'Add New Stop'}
              </h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <CloseIcon size={24} />
              </button>
            </div>

            <form onSubmit={editingStop ? handleEditStop : handleAddStop} className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">
                    City Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="cityName"
                    value={formData.cityName}
                    onChange={handleInputChange}
                    placeholder="e.g., Paris, Tokyo, Bali"
                    className={`field-input ${errors.cityName ? 'error' : ''}`}
                  />
                  {errors.cityName && <span className="field-error">{errors.cityName}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g., France, Japan, Indonesia"
                    className="field-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">
                    Start Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`field-input ${errors.startDate ? 'error' : ''}`}
                  />
                  {errors.startDate && <span className="field-error">{errors.startDate}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    End Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`field-input ${errors.endDate ? 'error' : ''}`}
                  />
                  {errors.endDate && <span className="field-error">{errors.endDate}</span>}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Budget (USD)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="field-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add notes about this stop..."
                  className="field-textarea"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <CheckIcon size={18} />
                  <span>{editingStop ? 'Update Stop' : 'Add Stop'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripStopManagement;
