/**
 * Itinerary by Date Page
 * Daily task view showing itinerary organized by date
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ItineraryByDate.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import {
  LogoutIcon,
  CalendarIcon,
  ActivityIcon,
  ClockIcon,
  DollarIcon,
  MapPinIcon,
  CheckIcon,
} from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { STORAGE_KEYS } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';

const ItineraryByDate = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [itineraryByDate, setItineraryByDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadItinerary();
  }, [tripId]);

  /**
   * Load trip and organize itinerary by date
   */
  const loadItinerary = async () => {
    try {
      const tripData = await tripAPI.getById(tripId);
      setTrip(tripData.trip);

      // Organize activities by date
      const dateMap = {};
      
      if (tripData.trip.stops) {
        tripData.trip.stops.forEach((stop) => {
          if (stop.activities) {
            stop.activities.forEach((activity) => {
              const date = activity.date || stop.startDate;
              if (!dateMap[date]) {
                dateMap[date] = {
                  date,
                  stopName: stop.name,
                  activities: [],
                };
              }
              dateMap[date].activities.push({
                ...activity,
                stopName: stop.name,
                stopId: stop.id,
              });
            });
          }
        });
      }

      // Convert to array and sort by date
      const itinerary = Object.values(dateMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setItineraryByDate(itinerary);
      if (itinerary.length > 0) {
        setSelectedDate(itinerary[0].date);
      }
    } catch (error) {
      console.error('Failed to load itinerary:', error);
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
   * Format date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Format time
   */
  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  /**
   * Calculate total cost for date
   */
  const calculateDateCost = (activities) => {
    return activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
  };

  /**
   * Get selected day itinerary
   */
  const selectedDayItinerary = itineraryByDate.find((day) => day.date === selectedDate);

  return (
    <div className="itinerary-date-page">
      <header className="itinerary-date-header">
        <div className="itinerary-date-header-content container">
          <div className="itinerary-date-logo">
            <LogoIcon width={40} height={40} />
            <span className="itinerary-date-logo-text">Daily Itinerary</span>
          </div>
          <div className="itinerary-date-header-actions">
            <Button variant="text" size="small" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button
              variant="text"
              size="small"
              icon={<LogoutIcon width={18} height={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="itinerary-date-main container">
        {loading ? (
          <div className="itinerary-date-loading">Loading itinerary...</div>
        ) : !trip ? (
          <Card className="itinerary-date-empty">
            <h3>Trip not found</h3>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Card>
        ) : (
          <>
            <div className="itinerary-date-header-section">
              <div>
                <h1 className="itinerary-date-title">{trip.name}</h1>
                <p className="itinerary-date-subtitle">
                  {new Date(trip.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(trip.endDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="itinerary-date-content">
              {/* Date Selector */}
              <div className="date-selector-section">
                <h3 className="date-selector-title">Select Day</h3>
                <div className="date-selector-list">
                  {itineraryByDate.map((day, index) => (
                    <button
                      key={day.date}
                      className={`date-selector-item ${
                        selectedDate === day.date ? 'date-selector-item--active' : ''
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div className="date-selector-day">Day {index + 1}</div>
                      <div className="date-selector-date">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <Badge variant="primary" size="small">
                        {day.activities.length}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Details */}
              {selectedDayItinerary && (
                <div className="day-details-section">
                  <Card className="day-details-card">
                    <div className="day-details-header">
                      <div>
                        <h2 className="day-details-title">
                          {formatDate(selectedDayItinerary.date)}
                        </h2>
                        <p className="day-details-location">
                          <MapPinIcon width={16} height={16} color="#666666" />
                          {selectedDayItinerary.stopName}
                        </p>
                      </div>
                      <div className="day-details-stats">
                        <div className="day-stat">
                          <ActivityIcon width={20} height={20} color="#FFC107" />
                          <span>{selectedDayItinerary.activities.length} Activities</span>
                        </div>
                        <div className="day-stat">
                          <DollarIcon width={20} height={20} color="#FFC107" />
                          <span>${calculateDateCost(selectedDayItinerary.activities).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="day-activities-list">
                      {selectedDayItinerary.activities
                        .sort((a, b) => {
                          if (!a.startTime) return 1;
                          if (!b.startTime) return -1;
                          return a.startTime.localeCompare(b.startTime);
                        })
                        .map((activity, index) => (
                          <div key={activity.id || index} className="activity-item">
                            <div className="activity-item-number">{index + 1}</div>
                            <div className="activity-item-content">
                              <div className="activity-item-header">
                                <h4 className="activity-item-title">{activity.name}</h4>
                                <Badge variant="secondary" size="small">
                                  {activity.type}
                                </Badge>
                              </div>

                              {activity.description && (
                                <p className="activity-item-description">{activity.description}</p>
                              )}

                              <div className="activity-item-meta">
                                {activity.startTime && (
                                  <div className="activity-meta-item">
                                    <ClockIcon width={16} height={16} color="#666666" />
                                    <span>{formatTime(activity.startTime)}</span>
                                    {activity.duration && <span>• {activity.duration}h</span>}
                                  </div>
                                )}

                                {activity.cost !== undefined && activity.cost > 0 && (
                                  <div className="activity-meta-item">
                                    <DollarIcon width={16} height={16} color="#666666" />
                                    <span>${activity.cost.toLocaleString()}</span>
                                  </div>
                                )}

                                {activity.location && (
                                  <div className="activity-meta-item">
                                    <MapPinIcon width={16} height={16} color="#666666" />
                                    <span>{activity.location}</span>
                                  </div>
                                )}
                              </div>

                              {activity.notes && (
                                <div className="activity-item-notes">
                                  <strong>Notes:</strong> {activity.notes}
                                </div>
                              )}
                            </div>

                            <button
                              className="activity-item-checkbox"
                              aria-label="Mark as complete"
                            >
                              <CheckIcon width={20} height={20} color="#FFC107" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Empty State */}
              {itineraryByDate.length === 0 && (
                <Card className="itinerary-date-empty">
                  <CalendarIcon width={64} height={64} color="#E0E0E0" />
                  <h3>No Itinerary Yet</h3>
                  <p>Start adding activities to your trip to see your daily itinerary</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/trips/${tripId}/stops`)}
                  >
                    Manage Stops & Activities
                  </Button>
                </Card>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ItineraryByDate;
