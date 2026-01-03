/**
 * Dashboard - Premium Travel Planning Interface
 * SYSTEM OVERRIDE: Completely rebuilt from scratch
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { 
  PlusIcon, 
  CalendarIcon, 
  MapPinIcon, 
  DollarIcon, 
  LogoutIcon, 
  ActivityIcon,
  ClockIcon,
  CheckIcon
} from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { STORAGE_KEYS } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState({
    ongoing: [],
    scheduled: [],
    previous: []
  });
  const [activeTab, setActiveTab] = useState('ongoing');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) setUser(JSON.parse(userData));

      const tripsData = await tripAPI.getAll();
      const allTrips = tripsData.trips || [];
      
      const now = new Date();
      const categorized = {
        ongoing: [],
        scheduled: [],
        previous: []
      };

      allTrips.forEach((trip) => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        if (endDate < now) {
          categorized.previous.push(trip);
        } else if (startDate <= now && endDate >= now) {
          categorized.ongoing.push(trip);
        } else {
          categorized.scheduled.push(trip);
        }
      });

      setTrips(categorized);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTripImage = (trip) => {
    if (trip.coverPhoto) return trip.coverPhoto;
    
    const destination = trip.name?.toLowerCase() || '';
    if (destination.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop';
    if (destination.includes('tokyo') || destination.includes('japan')) return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop';
    if (destination.includes('bali')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop';
    if (destination.includes('new york')) return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop';
    if (destination.includes('london')) return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop';
    
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop';
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    navigate('/login');
  };

  const getActiveTrips = () => trips[activeTab];

  const getTotalTrips = () => trips.ongoing.length + trips.scheduled.length + trips.previous.length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your journeys...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Top Navigation */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <LogoIcon size={36} />
          <span className="brand-text">Planora</span>
        </div>
        <div className="navbar-menu">
          <button className="navbar-link logout" onClick={handleLogout}>
            <LogoutIcon size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Full-Width Hero Banner */}
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Plan Your Next Adventure</h1>
          <p className="hero-tagline">Discover, plan, and track your dream destinations around the world</p>
          <button className="hero-cta-btn" onClick={() => navigate('/create-trip')}>
            <PlusIcon size={22} />
            <span>Create New Trip</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h2 className="welcome-title">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
              </h2>
              <p className="welcome-subtitle">
                You have {getTotalTrips()} trip{getTotalTrips() !== 1 ? 's' : ''} in your collection
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            <button
              className={`category-tab ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              <ClockIcon size={20} />
              <span className="tab-label">Ongoing</span>
              {trips.ongoing.length > 0 && (
                <span className="tab-badge">{trips.ongoing.length}</span>
              )}
            </button>
            <button
              className={`category-tab ${activeTab === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              <CalendarIcon size={20} />
              <span className="tab-label">Scheduled</span>
              {trips.scheduled.length > 0 && (
                <span className="tab-badge">{trips.scheduled.length}</span>
              )}
            </button>
            <button
              className={`category-tab ${activeTab === 'previous' ? 'active' : ''}`}
              onClick={() => setActiveTab('previous')}
            >
              <CheckIcon size={20} />
              <span className="tab-label">Previous</span>
              {trips.previous.length > 0 && (
                <span className="tab-badge">{trips.previous.length}</span>
              )}
            </button>
          </div>

          {/* Trips Display */}
          <div className="trips-container">
            {getActiveTrips().length === 0 ? (
              <div className="empty-trips-state">
                <div className="empty-icon-wrapper">
                  <MapPinIcon size={64} />
                </div>
                <h3 className="empty-title">
                  {activeTab === 'ongoing' && 'No ongoing trips'}
                  {activeTab === 'scheduled' && 'No scheduled trips'}
                  {activeTab === 'previous' && 'No previous trips'}
                </h3>
                <p className="empty-description">
                  {activeTab === 'ongoing' && 'Start planning your next adventure today'}
                  {activeTab === 'scheduled' && 'Create your first trip and start the countdown'}
                  {activeTab === 'previous' && 'Your completed journeys will appear here'}
                </p>
                {activeTab !== 'previous' && (
                  <button className="empty-cta-btn" onClick={() => navigate('/create-trip')}>
                    <PlusIcon size={20} />
                    <span>Create Your First Trip</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="trips-grid">
                {getActiveTrips().map((trip) => (
                  <article
                    key={trip.id}
                    className="trip-card-item"
                    onClick={() => navigate(`/trip/${trip.id}/stops`)}
                  >
                    {/* Large Cover Image */}
                    <div className="trip-cover-image">
                      <img 
                        src={getTripImage(trip)} 
                        alt={trip.name}
                        className="cover-img"
                      />
                      {activeTab === 'ongoing' && (
                        <div className="live-indicator">
                          <span className="live-pulse"></span>
                          <span className="live-text">Live Now</span>
                        </div>
                      )}
                      <div className="trip-image-overlay"></div>
                    </div>

                    {/* Trip Details */}
                    <div className="trip-details">
                      <h3 className="trip-name">{trip.name}</h3>
                      {trip.description && (
                        <p className="trip-description">{trip.description}</p>
                      )}
                      
                      <div className="trip-metadata">
                        <div className="metadata-row">
                          <CalendarIcon size={18} />
                          <span className="metadata-text">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </span>
                        </div>
                        {trip.budget && (
                          <div className="metadata-row">
                            <DollarIcon size={18} />
                            <span className="metadata-text">
                              ${trip.budget.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {trip.stops && trip.stops.length > 0 && (
                          <div className="metadata-row">
                            <MapPinIcon size={18} />
                            <span className="metadata-text">
                              {trip.stops.length} stop{trip.stops.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="trip-status-row">
                        <span className={`status-indicator status-${activeTab}`}>
                          {activeTab === 'ongoing' && 'In Progress'}
                          {activeTab === 'scheduled' && 'Upcoming'}
                          {activeTab === 'previous' && 'Completed'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
