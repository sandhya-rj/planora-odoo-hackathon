/**
 * Settings Page
 * User profile and settings management
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Alert from '../../components/Alert/Alert';
import { UserIcon } from '../../assets/svg/Icons';
import { userAPI } from '../../services/api';
import { VALIDATION, STORAGE_KEYS } from '../../config';

const Settings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setFormData({
        firstName: response.user.firstName || '',
        lastName: response.user.lastName || '',
        email: response.user.email || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!VALIDATION.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      // Update local storage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      
      setAlert({ type: 'success', message: 'Profile updated successfully' });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container container">
        <div className="settings-header">
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Manage your account and preferences</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        <Card className="settings-card">
          <div className="settings-section">
            <div className="settings-section-header">
              <UserIcon width={24} height={24} color="#FFC107" />
              <h2 className="settings-section-title">Profile Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-row">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />
              </div>

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <Card className="settings-card">
          <div className="settings-section">
            <h2 className="settings-section-title">About Planora</h2>
            <p className="settings-about-text">
              Planora is a professional multi-city travel planning platform built for the Odoo Hackathon 2026.
              It features intelligent trip health monitoring, budget tracking, and comprehensive itinerary management.
            </p>
            <p className="settings-version">Version 1.0.0</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
