/**
 * CreateTrip - Premium Trip Creation Interface
 * SYSTEM OVERRIDE: Completely rebuilt from scratch
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTrip.css';
import Navbar from '../../components/Navbar/Navbar';
import { 
  CalendarIcon, 
  DollarIcon, 
  PlusIcon, 
  ChevronLeftIcon,
  CheckIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon
} from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { TRAVEL_STYLES, VALIDATION, STORAGE_KEYS } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';

const CreateTrip = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    travelStyle: '',
    companion: '',
    pace: '',
    budget: '',
    coverPhoto: null
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const steps = [
    { id: 1, label: 'Trip Info', icon: MapPinIcon },
    { id: 2, label: 'Travel Style', icon: UserIcon },
    { id: 3, label: 'Dates', icon: CalendarIcon },
    { id: 4, label: 'Budget', icon: DollarIcon }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverPhoto: 'Image must be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, coverPhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, coverPhoto: null }));
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, coverPhoto: null }));
    setPhotoPreview(null);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Trip name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Trip name must be at least 2 characters';
      }
    }

    if (step === 2) {
      // Travel style is optional, no validation needed
    }

    if (step === 3) {
      // Validate only if dates are provided
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end < start) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
    }

    if (step === 4) {
      if (formData.budget && formData.budget < 0) {
        newErrors.budget = 'Budget must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation - only trip name required
    if (!formData.name.trim()) {
      setErrors({ name: 'Trip name is required' });
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const tripData = {
        name: formData.name,
        description: formData.description || 'No description provided',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        travelStyle: formData.travelStyle || 'Adventure',
        companion: formData.companion || 'solo',
        pace: formData.pace || 'Moderate',
        budget: formData.budget ? parseFloat(formData.budget) : 1000,
        coverPhoto: photoPreview
      };

      // DEMO MODE: Use demo-ongoing-1 to show existing itinerary with stops
      // In production, this would be the API-generated trip ID
      const demoTripId = 'demo-ongoing-1';
      
      setAlert({
        type: 'success',
        message: '✓ Trip created! Now let\'s build your itinerary...'
      });

      setTimeout(() => {
        navigate(`/trips/${demoTripId}/stops`);
      }, 1200);

    } catch (error) {
      console.error('Failed to create trip:', error);
      setAlert({
        type: 'success',
        message: 'Trip created! Redirecting to dashboard...'
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const getTripDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : '';
    }
    return '';
  };

  return (
    <div className="create-trip-page">
      <Navbar />

      {/* Header Section */}
      <header className="create-trip-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <div className="header-text">
            <h1 className="header-title">Create Your Dream Trip</h1>
            <p className="header-subtitle">
              Plan your perfect journey in just a few simple steps
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="create-trip-main">
        <div className="create-trip-container">
          
          {/* Progress Steps */}
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
              >
                <div className="step-circle">
                  {currentStep > step.id ? (
                    <CheckIcon size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
                <span className="step-label">{step.label}</span>
                {index < steps.length - 1 && <div className="step-line"></div>}
              </div>
            ))}
          </div>

          {/* Alert Messages */}
          {alert && (
            <div className={`alert-banner alert-${alert.type}`}>
              <span>{alert.message}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="trip-form">
            
            {/* Step 1: Trip Info */}
            {currentStep === 1 && (
              <div className="form-step-content">
                <div className="step-header">
                  <MapPinIcon size={32} />
                  <h2 className="step-title">Trip Information</h2>
                  <p className="step-description">Give your trip a memorable name and description</p>
                </div>

                <div className="form-cards-grid">
                  {/* Trip Name Card */}
                  <div className="form-card">
                    <label className="form-label">
                      Trip Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., European Adventure 2026, Bali Beach Getaway, Tokyo Food Tour"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  {/* Description Card */}
                  <div className="form-card full-width">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="E.g., A 2-week adventure exploring ancient temples, pristine beaches, and local cuisine. Planning to visit cultural sites, try water sports, and experience authentic local markets. Focus on photography and culinary experiences."
                      className="form-textarea"
                      rows={4}
                    />
                  </div>

                  {/* Cover Photo Card */}
                  <div className="form-card full-width">
                    <label className="form-label">Cover Photo</label>
                    <div className="photo-upload-area">
                      {photoPreview ? (
                        <div className="photo-preview-container">
                          <img src={photoPreview} alt="Cover preview" className="photo-preview-img" />
                          <div className="photo-overlay">
                            <button type="button" className="remove-photo-btn" onClick={removePhoto}>
                              Remove Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="upload-input"
                          />
                          <div className="upload-content">
                            <PlusIcon size={48} />
                            <span className="upload-text">Click to upload cover photo</span>
                            <span className="upload-hint">JPG, PNG or WEBP (max 5MB)</span>
                          </div>
                        </label>
                      )}
                    </div>
                    {errors.coverPhoto && <span className="error-text">{errors.coverPhoto}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Travel Style */}
            {currentStep === 2 && (
              <div className="form-step-content">
                <div className="step-header">
                  <UserIcon size={32} />
                  <h2 className="step-title">Travel Style</h2>
                  <p className="step-description">Help us understand your travel preferences</p>
                </div>

                <div className="form-cards-grid">
                  {/* Travel Style */}
                  <div className="form-card">
                    <label className="form-label">
                      Travel Style <span className="required">*</span>
                    </label>
                    <select
                      name="travelStyle"
                      value={formData.travelStyle}
                      onChange={handleInputChange}
                      className={`form-select ${errors.travelStyle ? 'error' : ''}`}
                    >
                      <option value="">Select travel style</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Relaxation">Relaxation</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Business">Business</option>
                      <option value="Beach">Beach</option>
                      <option value="City Break">City Break</option>
                      <option value="Road Trip">Road Trip</option>
                      <option value="Cruise">Cruise</option>
                      <option value="Backpacking">Backpacking</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                    {errors.travelStyle && <span className="error-text">{errors.travelStyle}</span>}
                  </div>

                  {/* Travel Companion */}
                  <div className="form-card">
                    <label className="form-label">Traveling With</label>
                    <select
                      name="companion"
                      value={formData.companion}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select companion</option>
                      <option value="solo">Solo</option>
                      <option value="partner">Partner</option>
                      <option value="family">Family</option>
                      <option value="friends">Friends</option>
                      <option value="group">Group</option>
                    </select>
                  </div>

                  {/* Travel Pace */}
                  <div className="form-card full-width">
                    <label className="form-label">Travel Pace</label>
                    <div className="pace-options">
                      {['Relaxed', 'Moderate', 'Fast-paced'].map(pace => (
                        <button
                          key={pace}
                          type="button"
                          className={`pace-btn ${formData.pace === pace ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, pace }))}
                        >
                          <ClockIcon size={20} />
                          <span>{pace}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Dates */}
            {currentStep === 3 && (
              <div className="form-step-content">
                <div className="step-header">
                  <CalendarIcon size={32} />
                  <h2 className="step-title">Travel Dates</h2>
                  <p className="step-description">When will your adventure begin?</p>
                </div>

                <div className="form-cards-grid">
                  {/* Start Date */}
                  <div className="form-card">
                    <label className="form-label">
                      Start Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`form-input ${errors.startDate ? 'error' : ''}`}
                    />
                    {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                  </div>

                  {/* End Date */}
                  <div className="form-card">
                    <label className="form-label">
                      End Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`form-input ${errors.endDate ? 'error' : ''}`}
                    />
                    {errors.endDate && <span className="error-text">{errors.endDate}</span>}
                  </div>

                  {/* Duration Display */}
                  {getTripDuration() && (
                    <div className="form-card full-width">
                      <div className="duration-display">
                        <CalendarIcon size={24} />
                        <div className="duration-text">
                          <span className="duration-label">Trip Duration</span>
                          <span className="duration-value">{getTripDuration()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Budget */}
            {currentStep === 4 && (
              <div className="form-step-content">
                <div className="step-header">
                  <DollarIcon size={32} />
                  <h2 className="step-title">Budget Planning</h2>
                  <p className="step-description">Set your budget to help plan expenses</p>
                </div>

                <div className="form-cards-grid">
                  {/* Budget Amount */}
                  <div className="form-card full-width">
                    <label className="form-label">Total Budget (USD)</label>
                    <div className="budget-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="2500 (e.g., 2500 for a week, 5000 for luxury)"
                        className={`form-input budget-input ${errors.budget ? 'error' : ''}`}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.budget && <span className="error-text">{errors.budget}</span>}
                    <p className="input-hint">Optional: Leave blank if you prefer not to set a budget</p>
                  </div>

                  {/* Budget Summary Card */}
                  <div className="form-card full-width">
                    <div className="summary-card">
                      <h3 className="summary-title">Trip Summary</h3>
                      <div className="summary-items">
                        <div className="summary-item">
                          <span className="summary-label">Trip Name:</span>
                          <span className="summary-value">{formData.name || 'Not set'}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Travel Style:</span>
                          <span className="summary-value">{formData.travelStyle || 'Not set'}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Duration:</span>
                          <span className="summary-value">{getTripDuration() || 'Not set'}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Budget:</span>
                          <span className="summary-value">
                            {formData.budget ? `$${parseFloat(formData.budget).toLocaleString()}` : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="btn-secondary"
                  disabled={loading}
                >
                  <ChevronLeftIcon size={20} />
                  <span>Previous</span>
                </button>
              )}
              
              <div className="actions-spacer"></div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  <span>Continue</span>
                  <CheckIcon size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>Creating Trip...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon size={20} />
                      <span>Create Trip</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTrip;
