/**
 * Dashboard Page - All Upcoming Trips
 * Main landing page showing categorized trips (Previous, Ongoing, Scheduled)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { PlusIcon, CalendarIcon, MapPinIcon, DollarIcon, LogoutIcon, ActivityIcon } from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { STORAGE_KEYS } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const [previousTrips, setPreviousTrips] = useState([]);
  const [ongoingTrips, setOngoingTrips] = useState([]);
  const [scheduledTrips, setScheduledTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load dashboard data and categorize trips
   */
  const loadDashboardData = async () => {
    try {
      // Get user from local storage
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Fetch all trips
      const tripsData = await tripAPI.getAll();
      const allTrips = tripsData.trips || [];

      // Categorize trips by status
      const now = new Date();
      const previous = [];
      const ongoing = [];
      const scheduled = [];

      allTrips.forEach((trip) => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        if (endDate < now) {
          // Trip has ended
          previous.push(trip);
        } else if (startDate <= now && endDate >= now) {
          // Trip is currently ongoing
          ongoing.push(trip);
        } else {
          // Trip is scheduled for future
          scheduled.push(trip);
        }
      });

      setPreviousTrips(previous);
      setOngoingTrips(ongoing);
      setScheduledTrips(scheduled);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  /**
   * Render trip section with professional cards
   */
  const renderTripSection = (title, trips, category) => {
    if (trips.length === 0) return null;

    return (
      <section className="dashboard-section">
        <h2 className="section-title">{title}</h2>
        <div className="trips-grid">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="trip-card"
              onClick={() => navigate(`/trips/${trip.id}/stops`)}
            >
              {/* Banner Image */}
              <div className="trip-banner">
                {trip.coverPhoto ? (
                  <img src={trip.coverPhoto} alt={trip.name} className="trip-banner-img" />
                ) : (
                  <div className="trip-banner-placeholder">
                    <MapPinIcon width={48} height={48} color="#FFFFFF" />
                  </div>
                )}
                {category === 'ongoing' && (
                  <div className="trip-status-badge ongoing">
                    <span className="status-dot"></span>
                    Live Now
                  </div>
                )}
              </div>

              {/* Trip Content */}
              <div className="trip-content">
                <h3 className="trip-title">{trip.name}</h3>
                
                <div className="trip-meta">
                  <div className="trip-meta-item">
                    <CalendarIcon width={16} height={16} />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="trip-meta-row">
                    <div className="trip-meta-item">
                      <MapPinIcon width={16} height={16} />
                      <span>{trip.stopsCount || 0} stops</span>
                    </div>
                    <div className="trip-meta-item">
                      <ActivityIcon width={16} height={16} />
                      <span>{trip.activitiesCount || 0} activities</span>
                    </div>
                  </div>
                  {trip.budget && (
                    <div className="trip-meta-item">
                      <DollarIcon width={16} height={16} />
                      <span>${trip.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="dashboard-page">
      {/* Professional Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <LogoIcon width={48} height={48} />
            <span className="dashboard-logo-text">Planora</span>
          </div>
          <div className="dashboard-header-right">
            <span className="dashboard-user-greeting">
              Welcome, <strong>{user?.firstName}</strong>
            </span>
            <button className="dashboard-logout-btn" onClick={handleLogout}>
              <LogoutIcon width={20} height={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-content">
            <div className="dashboard-hero-text">
              <h1 className="dashboard-hero-title">Your Travel Adventures</h1>
              <p className="dashboard-hero-subtitle">
                Plan, organize, and track all your trips in one place
              </p>
            </div>
            <button className="dashboard-create-btn" onClick={() => navigate('/trips/create')}>
              <PlusIcon width={20} height={20} />
              <span>Create New Trip</span>
            </button>
          </div>
        </section>

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading your trips...</p>
          </div>
        ) : (
          <div className="dashboard-content">
            {/* Ongoing Trips */}
            {renderTripSection('Ongoing Trips', ongoingTrips, 'ongoing')}

            {/* Scheduled Trips */}
            {renderTripSection('Upcoming Adventures', scheduledTrips, 'scheduled')}

            {/* Previous Trips */}
            {renderTripSection('Past Memories', previousTrips, 'previous')}

            {/* Empty State */}
            {previousTrips.length === 0 && ongoingTrips.length === 0 && scheduledTrips.length === 0 && (
              <div className="dashboard-empty-state">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <CalendarIcon width={80} height={80} />
                  </div>
                  <h3 className="empty-state-title">No trips yet</h3>
                  <p className="empty-state-text">
                    Start planning your first adventure and create unforgettable memories
                  </p>
                  <button className="empty-state-btn" onClick={() => navigate('/trips/create')}>
                    <PlusIcon width={20} height={20} />
                    <span>Create Your First Trip</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
