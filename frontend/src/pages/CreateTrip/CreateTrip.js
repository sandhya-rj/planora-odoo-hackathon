/**
 * CreateTrip Page
 * Create new trip with itinerary builder matching wireframe
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTrip.css';
import Alert from '../../components/Alert/Alert';
import { CalendarIcon, DollarIcon, PlusIcon, CloseIcon, LogoutIcon } from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { TRAVEL_STYLES, VALIDATION, STORAGE_KEYS } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    companion: '',
    budgetStyle: '',
    pace: '',
    budget: '',
    coverPhoto: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required';
    } else if (formData.name.length < VALIDATION.TRIP_NAME_MIN_LENGTH) {
      newErrors.name = `Trip name must be at least ${VALIDATION.TRIP_NAME_MIN_LENGTH} characters`;
    } else if (formData.name.length > VALIDATION.TRIP_NAME_MAX_LENGTH) {
      newErrors.name = `Trip name cannot exceed ${VALIDATION.TRIP_NAME_MAX_LENGTH} characters`;
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }

      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }

      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (daysDiff > VALIDATION.MAX_TRIP_DAYS) {
        newErrors.endDate = `Trip cannot exceed ${VALIDATION.MAX_TRIP_DAYS} days`;
      }
    }

    if (!formData.companion) {
      newErrors.companion = 'Travel companion is required';
    }

    if (!formData.budgetStyle) {
      newErrors.budgetStyle = 'Budget style is required';
    }

    if (!formData.pace) {
      newErrors.pace = 'Travel pace is required';
    }

    if (formData.budget) {
      const budgetNum = parseFloat(formData.budget);
      if (isNaN(budgetNum) || budgetNum < VALIDATION.MIN_BUDGET) {
        newErrors.budget = 'Please enter a valid budget';
      } else if (budgetNum > VALIDATION.MAX_BUDGET) {
        newErrors.budget = `Budget cannot exceed ${VALIDATION.MAX_BUDGET.toLocaleString()}`;
      }
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle file upload for cover photo
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          coverPhoto: 'Please select a valid image file',
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          coverPhoto: 'Image size must be less than 5MB',
        }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          coverPhoto: reader.result,
        }));
        setErrors((prev) => ({
          ...prev,
          coverPhoto: '',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove cover photo
   */
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({
      ...prev,
      coverPhoto: null,
    }));
  };

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const tripData = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || '',
        style: {
          groupType: formData.companion,
          budgetType: formData.budgetStyle,
          pace: formData.pace,
        },
        budget: formData.budget ? parseFloat(formData.budget) : null,
        coverPhoto: formData.coverPhoto || null,
      };

      const response = await tripAPI.create(tripData);
      
      // Navigate to trip details/stops management
      navigate(`/trips/${response.trip.id}/stops`);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to create trip. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    navigate('/login');
  };

  return (
    <div className="create-trip-page">
      {/* Professional Header */}
      <header className="create-trip-header">
        <div className="create-trip-header-content">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <div className="header-logo">
            <LogoIcon width={40} height={40} />
            <span className="header-logo-text">Planora</span>
          </div>
          <button className="header-logout-btn" onClick={handleLogout}>
            <LogoutIcon width={18} height={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="create-trip-container">
        {/* Page Title */}
        <div className="page-header">
          <h1 className="page-title">Create New Trip</h1>
          <p className="page-subtitle">
            Start planning your next adventure by filling in the details below
          </p>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Form Card */}
        <div className="form-card">
          <form onSubmit={handleSubmit} className="create-trip-form">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-group">
                <label className="form-label">Trip Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g., European Summer Adventure"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Share details about your trip plans..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                />
                <div className="textarea-footer">
                  {errors.description && <span className="form-error">{errors.description}</span>}
                  <span className="char-count">{formData.description.length}/500</span>
                </div>
              </div>

              {/* Cover Photo Upload */}
              <div className="form-group">
                <label className="form-label">Cover Photo</label>
                {!photoPreview ? (
                  <div className="photo-upload">
                    <input
                      type="file"
                      id="coverPhoto"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="coverPhoto" className="photo-upload-btn">
                      <PlusIcon width={24} height={24} />
                      <div className="photo-upload-text">
                        <span className="upload-title">Upload Cover Photo</span>
                        <span className="upload-hint">Max 5MB • JPG, PNG, GIF</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="photo-preview-wrapper">
                    <img src={photoPreview} alt="Cover" className="photo-preview" />
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={handleRemovePhoto}
                    >
                      <CloseIcon width={18} height={18} />
                    </button>
                  </div>
                )}
                {errors.coverPhoto && <span className="form-error">{errors.coverPhoto}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date <span className="required">*</span></label>
                  <div className="input-with-icon">
                    <CalendarIcon width={18} height={18} />
                    <input
                      type="date"
                      name="startDate"
                      className={`form-input ${errors.startDate ? 'error' : ''}`}
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.startDate && <span className="form-error">{errors.startDate}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">End Date <span className="required">*</span></label>
                  <div className="input-with-icon">
                    <CalendarIcon width={18} height={18} />
                    <input
                      type="date"
                      name="endDate"
                      className={`form-input ${errors.endDate ? 'error' : ''}`}
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.endDate && <span className="form-error">{errors.endDate}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Total Budget (USD)</label>
                <div className="input-with-icon">
                  <DollarIcon width={18} height={18} />
                  <input
                    type="number"
                    name="budget"
                    className={`form-input ${errors.budget ? 'error' : ''}`}
                    placeholder="Enter total budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min={VALIDATION.MIN_BUDGET}
                    max={VALIDATION.MAX_BUDGET}
                  />
                </div>
                {errors.budget && <span className="form-error">{errors.budget}</span>}
              </div>
            </div>

            {/* Travel Style */}
            <div className="form-section">
              <h3 className="section-title">Travel Style</h3>
              
              <div className="form-group">
                <label className="form-label">Travel Companion <span className="required">*</span></label>
                <select
                  name="companion"
                  className={`form-select ${errors.companion ? 'error' : ''}`}
                  value={formData.companion}
                  onChange={handleChange}
                >
                  <option value="">Select travel companion</option>
                  {TRAVEL_STYLES.COMPANION.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.companion && <span className="form-error">{errors.companion}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Budget Style <span className="required">*</span></label>
                <select
                  name="budgetStyle"
                  className={`form-select ${errors.budgetStyle ? 'error' : ''}`}
                  value={formData.budgetStyle}
                  onChange={handleChange}
                >
                  <option value="">Select budget style</option>
                  {TRAVEL_STYLES.BUDGET.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.budgetStyle && <span className="form-error">{errors.budgetStyle}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Travel Pace <span className="required">*</span></label>
                <select
                  name="pace"
                  className={`form-select ${errors.pace ? 'error' : ''}`}
                  value={formData.pace}
                  onChange={handleChange}
                >
                  <option value="">Select travel pace</option>
                  {TRAVEL_STYLES.PACE.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.pace && <span className="form-error">{errors.pace}</span>}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Trip & Add Stops'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
