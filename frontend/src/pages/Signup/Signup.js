/**
 * Signup Page
 * User registration with full validation
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Alert from '../../components/Alert/Alert';
import LogoIcon from '../../assets/svg/LogoIcon';
import { authAPI } from '../../services/api';
import { VALIDATION, STORAGE_KEYS } from '../../config';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    familyMember: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  /**
   * Validate form inputs
   */
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

    if (!formData.familyMember.trim()) {
      newErrors.familyMember = 'Family member count is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    try {
      const response = await authAPI.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        familyMember: formData.familyMember,
        city: formData.city,
        country: formData.country,
        password: formData.password,
      });

      // Store auth token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Signup failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Left Brand Panel */}
      <div className="signup-brand-panel">
        <div className="signup-brand-content">
          <LogoIcon width={80} height={80} />
          <h1 className="brand-title">Join Planora</h1>
          <p className="brand-tagline">
            Start planning smarter trips with thousands of travelers worldwide
          </p>
          <div className="brand-stats">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Trips Planned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="signup-form-panel">
        <div className="signup-form-container">
          <div className="signup-form-header">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Start planning amazing trips with Planora</p>
          </div>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form-row">
              <Input
                type="text"
                name="firstName"
                label="First Name"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                autoComplete="given-name"
              />
              <Input
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                autoComplete="family-name"
              />
            </div>

            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              type="text"
              name="familyMember"
              label="Family Members"
              placeholder="Number of family members"
              value={formData.familyMember}
              onChange={handleChange}
              error={errors.familyMember}
              required
            />

            <div className="signup-form-row">
              <Input
                type="text"
                name="city"
                label="City"
                placeholder="Your city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                required
              />
              <Input
                type="text"
                name="country"
                label="Country"
                placeholder="Your country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
                required
              />
            </div>

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="signup-divider">
            <span>or</span>
          </div>

          <p className="signin-prompt">
            Already have an account?{' '}
            <Link to="/login" className="signin-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
