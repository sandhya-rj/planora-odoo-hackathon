/**
 * Calendar View Page
 * Displays trip dates in calendar format
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarView.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { LogoutIcon, ChevronLeftIcon, ChevronRightIcon } from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { STORAGE_KEYS } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';

const CalendarView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load trips data
   */
  const loadData = async () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const tripsData = await tripAPI.getAll();
      setTrips(tripsData.trips || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get days in month
   */
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  /**
   * Check if date has trips
   */
  const getTripsForDate = (date) => {
    if (!date) return [];

    return trips.filter((trip) => {
      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);
      tripStart.setHours(0, 0, 0, 0);
      tripEnd.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      return checkDate >= tripStart && checkDate <= tripEnd;
    });
  };

  /**
   * Navigate months
   */
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    navigate('/login');
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <div className="calendar-header-content container">
          <div className="calendar-logo">
            <LogoIcon width={40} height={40} />
            <span className="calendar-logo-text">Planora Calendar</span>
          </div>
          <div className="calendar-header-actions">
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

      <main className="calendar-main container">
        <h1 className="calendar-title">Trip Calendar</h1>

        {loading ? (
          <div className="calendar-loading">Loading calendar...</div>
        ) : (
          <Card className="calendar-card">
            {/* Month Navigation */}
            <div className="calendar-nav">
              <Button
                variant="outline"
                size="small"
                icon={<ChevronLeftIcon width={20} height={20} />}
                onClick={previousMonth}
              />
              <h2 className="calendar-month-title">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="small"
                icon={<ChevronRightIcon width={20} height={20} />}
                onClick={nextMonth}
              />
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {/* Day Headers */}
              {DAYS.map((day) => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {days.map((date, index) => {
                const tripsOnDate = date ? getTripsForDate(date) : [];
                const isToday = date && date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`calendar-day ${!date ? 'calendar-day-empty' : ''} ${
                      isToday ? 'calendar-day-today' : ''
                    } ${tripsOnDate.length > 0 ? 'calendar-day-has-trips' : ''}`}
                  >
                    {date && (
                      <>
                        <div className="calendar-day-number">{date.getDate()}</div>
                        {tripsOnDate.length > 0 && (
                          <div className="calendar-day-trips">
                            {tripsOnDate.slice(0, 2).map((trip) => (
                              <div
                                key={trip.id}
                                className="calendar-trip-indicator"
                                title={trip.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/trips/${trip.id}/stops`);
                                }}
                              >
                                {trip.name}
                              </div>
                            ))}
                            {tripsOnDate.length > 2 && (
                              <div className="calendar-trip-more">
                                +{tripsOnDate.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CalendarView;
