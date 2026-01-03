/**
 * ActivityManagement - Clean Activity Planning Interface
 * Simple, professional, reusing TripStopManagement visual language
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActivityManagement.css';
import { 
  PlusIcon, 
  ActivityIcon, 
  DollarIcon, 
  ClockIcon, 
  TrashIcon,
  ChevronLeftIcon,
  CloseIcon,
  CheckIcon,
  CalendarIcon,
  EditIcon
} from '../../assets/svg/Icons';
import { stopAPI, activityAPI } from '../../services/api';

const ActivityManagement = () => {
  const { tripId, stopId } = useParams();
  const navigate = useNavigate();
  
  const [stop, setStop] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    cost: '',
    status: 'planned',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [tripId, stopId]);

  const loadData = async () => {
    try {
      const [stopResponse, activitiesResponse] = await Promise.all([
        stopAPI.getById(tripId, stopId),
        activityAPI.getAll(tripId, stopId)
      ]);
      
      setStop(stopResponse.stop);
      setActivities(activitiesResponse.activities || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setAlert({ type: 'error', message: 'Failed to load activities' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTotalCost = () => {
    return activities.reduce((sum, activity) => sum + (parseFloat(activity.cost) || 0), 0);
  };

  const getCompletedCount = () => {
    return activities.filter(a => a.status === 'done').length;
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

    if (!formData.name.trim()) {
      newErrors.name = 'Activity name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const activityData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : 0
      };

      if (editingActivity) {
        const response = await activityAPI.update(tripId, stopId, editingActivity.id, activityData);
        setActivities(activities.map(a => a.id === editingActivity.id ? response.activity : a));
        setAlert({ type: 'success', message: 'Activity updated!' });
      } else {
        const response = await activityAPI.create(tripId, stopId, activityData);
        setActivities([...activities, response.activity]);
        setAlert({ type: 'success', message: 'Activity added!' });
      }

      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to save activity:', error);
      setAlert({ type: 'error', message: 'Failed to save activity' });
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm('Delete this activity?')) return;

    try {
      await activityAPI.delete(tripId, stopId, activityId);
      setActivities(activities.filter(a => a.id !== activityId));
      setAlert({ type: 'success', message: 'Activity deleted!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to delete activity:', error);
      setAlert({ type: 'error', message: 'Failed to delete activity' });
    }
  };

  const toggleStatus = async (activity) => {
    try {
      const newStatus = activity.status === 'done' ? 'planned' : 'done';
      const response = await activityAPI.update(tripId, stopId, activity.id, { status: newStatus });
      setActivities(activities.map(a => a.id === activity.id ? response.activity : a));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (activity) => {
    setFormData({
      name: activity.name || '',
      time: activity.time || '',
      cost: activity.cost || '',
      status: activity.status || 'planned',
      notes: activity.notes || ''
    });
    setEditingActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingActivity(null);
    resetForm();
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      name: '',
      time: '',
      cost: '',
      status: 'planned',
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="activities-loading">
        <div className="loading-spinner"></div>
        <p>Loading activities...</p>
      </div>
    );
  }

  if (!stop) {
    return (
      <div className="activities-error">
        <p>Stop not found</p>
        <button onClick={() => navigate(`/trip/${tripId}/stops`)} className="btn-back">
          Back to Itinerary
        </button>
      </div>
    );
  }

  return (
    <div className="activities-page">
      {/* Header */}
      <header className="activities-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate(`/trip/${tripId}/stops`)}>
            <ArrowLeftIcon size={20} />
            <span>Back to Itinerary</span>
          </button>
          <div className="header-info">
            <h1 className="stop-name">{stop.cityName}</h1>
            <div className="stop-meta">
              <div className="meta-item">
                <CalendarIcon size={16} />
                <span>{formatDate(stop.startDate)} - {formatDate(stop.endDate)}</span>
              </div>
              {stop.country && (
                <div className="meta-item">
                  <span>{stop.country}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Alert */}
      {alert && (
        <div className={`alert-banner alert-${alert.type}`}>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="activities-main">
        <div className="activities-container">
          
          {/* Activities Section */}
          <div className="activities-section">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Activities</h2>
                <p className="section-subtitle">{activities.length} planned activities</p>
              </div>
              <button className="btn-add" onClick={openAddModal}>
                <PlusIcon size={20} />
                <span>Add Activity</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <ActivityIcon size={64} />
                </div>
                <h3 className="empty-title">No activities yet</h3>
                <p className="empty-text">Start planning your activities for this stop</p>
                <button className="btn-add-first" onClick={openAddModal}>
                  <PlusIcon size={20} />
                  <span>Add First Activity</span>
                </button>
              </div>
            ) : (
              <div className="activities-list">
                {activities.map((activity) => (
                  <div key={activity.id} className="activity-card">
                    <div className="activity-main">
                      <div className="activity-checkbox">
                        <input
                          type="checkbox"
                          checked={activity.status === 'done'}
                          onChange={() => toggleStatus(activity)}
                          className="status-checkbox"
                        />
                      </div>
                      <div className="activity-info">
                        <h3 className={`activity-name ${activity.status === 'done' ? 'completed' : ''}`}>
                          {activity.name}
                        </h3>
                        <div className="activity-details">
                          {activity.time && (
                            <div className="detail-item">
                              <ClockIcon size={14} />
                              <span>{activity.time}</span>
                            </div>
                          )}
                          {activity.cost > 0 && (
                            <div className="detail-item">
                              <DollarIcon size={14} />
                              <span>${parseFloat(activity.cost).toFixed(2)}</span>
                            </div>
                          )}
                          <span className={`status-badge status-${activity.status}`}>
                            {activity.status === 'done' ? 'Done' : 'Planned'}
                          </span>
                        </div>
                        {activity.notes && (
                          <p className="activity-notes">{activity.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="activity-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => openEditModal(activity)}
                        title="Edit"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(activity.id)}
                        title="Delete"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <aside className="summary-sidebar">
            <div className="summary-sticky">
              <h3 className="summary-title">Summary</h3>
              
              <div className="summary-stats">
                <div className="stat-item">
                  <div className="stat-icon">
                    <ActivityIcon size={20} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total Activities</span>
                    <span className="stat-value">{activities.length}</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">
                    <CheckIcon size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value">{getCompletedCount()}</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">
                    <DollarIcon size={20} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total Cost</span>
                    <span className="stat-value">${getTotalCost().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingActivity ? 'Edit Activity' : 'Add Activity'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <XIcon size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-field">
                <label className="field-label">
                  Activity Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Visit Eiffel Tower, Dinner at restaurant"
                  className={`field-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="field-input"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Cost (USD)</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="field-input"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="field-select"
                >
                  <option value="planned">Planned</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any notes or details..."
                  className="field-textarea"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <SaveIcon size={18} />
                  <span>{editingActivity ? 'Update' : 'Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityManagement;
