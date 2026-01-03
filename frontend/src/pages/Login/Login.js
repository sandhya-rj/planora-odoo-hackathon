/**
 * Login Page
 * User authentication with email and password validation
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Alert from '../../components/Alert/Alert';
import LogoIcon from '../../assets/svg/LogoIcon';
import { MapPinIcon, DollarIcon, ActivityIcon } from '../../assets/svg/Icons';
import { authAPI } from '../../services/api';
import { VALIDATION, STORAGE_KEYS } from '../../config';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!VALIDATION.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    // Clear error for this field
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

    // DEMO MODE: Simulate successful login without backend
    setTimeout(() => {
      // Store mock auth token using config keys
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-token');
      
      // Store mock user data using config keys
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
        id: 1,
        name: 'Demo User',
        email: 'demo@planora.app'
      }));

      // Navigate to dashboard
      navigate('/dashboard');
      setLoading(false);
    }, 500); // Small delay to show loading state
  };

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-brand-panel">
        <div className="login-brand-content">
          <LogoIcon width={100} height={100} />
          <h1 className="brand-title">PLANORA</h1>
          <p className="brand-tagline">
            Design your journey
          </p>
          <div className="brand-features">
            <div className="brand-feature">
              <div className="feature-icon">
                <MapPinIcon size={32} color="#FFC107" />
              </div>
              <p>Multi-city trip planning</p>
            </div>
            <div className="brand-feature">
              <div className="feature-icon">
                <DollarIcon size={32} color="#FFC107" />
              </div>
              <p>Smart budget tracking</p>
            </div>
            <div className="brand-feature">
              <div className="feature-icon">
                <ActivityIcon size={32} color="#FFC107" />
              </div>
              <p>AI-powered recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">Welcome back! Please enter your details.</p>
          </div>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <p className="signup-prompt">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
