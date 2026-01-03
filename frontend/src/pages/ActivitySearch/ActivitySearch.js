/**
 * Activity Search Page
 * Search and filter activities by date, trip, member
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivitySearch.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { SearchIcon, LogoutIcon, ActivityIcon, DollarIcon, ClockIcon } from '../../assets/svg/Icons';
import { tripAPI, activityAPI } from '../../services/api';
import { STORAGE_KEYS, ACTIVITY_TYPES } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';

const ActivitySearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [searchQuery, selectedTrip, selectedDate, selectedType, activities]);

  /**
   * Load trips and activities
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const tripsData = await tripAPI.getAll();
      const allTrips = tripsData.trips || [];
      setTrips(allTrips);

      // Fetch all activities from all trips
      const allActivities = [];
      for (const trip of allTrips) {
        // This is a simplified approach - in real implementation,
        // you'd have a dedicated activities search endpoint
        if (trip.activities) {
          trip.activities.forEach((activity) => {
            allActivities.push({
              ...activity,
              tripId: trip.id,
              tripName: trip.name,
            });
          });
        }
      }
      setActivities(allActivities);
      setFilteredActivities(allActivities);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter activities based on search criteria
   */
  const filterActivities = () => {
    let filtered = [...activities];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.name?.toLowerCase().includes(query) ||
          activity.description?.toLowerCase().includes(query) ||
          activity.location?.toLowerCase().includes(query)
      );
    }

    // Filter by trip
    if (selectedTrip) {
      filtered = filtered.filter((activity) => activity.tripId === selectedTrip);
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.date).toISOString().split('T')[0];
        return activityDate === selectedDate;
      });
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((activity) => activity.type === selectedType);
    }

    setFilteredActivities(filtered);
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

  return (
    <div className="activity-search-page">
      <header className="activity-search-header">
        <div className="activity-search-header-content container">
          <div className="activity-search-logo">
            <LogoIcon width={40} height={40} />
            <span className="activity-search-logo-text">Activity Search</span>
          </div>
          <div className="activity-search-header-actions">
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

      <main className="activity-search-main container">
        <h1 className="activity-search-title">Search Activities</h1>

        {/* Search and Filters */}
        <Card className="activity-search-filters-card">
          <div className="activity-search-filters">
            <Input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<SearchIcon width={20} height={20} />}
            />

            <Select
              label="Filter by Trip"
              value={selectedTrip}
              onChange={(e) => setSelectedTrip(e.target.value)}
              options={[
                { value: '', label: 'All Trips' },
                ...trips.map((trip) => ({ value: trip.id, label: trip.name })),
              ]}
            />

            <Input
              type="date"
              label="Filter by Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <Select
              label="Filter by Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                ...ACTIVITY_TYPES.map((type) => ({ value: type, label: type })),
              ]}
            />

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedTrip('');
                setSelectedDate('');
                setSelectedType('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="activity-search-results">
          <h2 className="activity-search-results-count">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'Activity' : 'Activities'} Found
          </h2>

          {loading ? (
            <div className="activity-search-loading">Searching...</div>
          ) : filteredActivities.length === 0 ? (
            <Card className="activity-search-empty">
              <ActivityIcon width={64} height={64} color="#E0E0E0" />
              <h3>No Activities Found</h3>
              <p>Try adjusting your search filters</p>
            </Card>
          ) : (
            <div className="activity-search-grid">
              {filteredActivities.map((activity) => (
                <Card
                  key={activity.id}
                  hoverable
                  onClick={() => navigate(`/trips/${activity.tripId}/stops/${activity.stopId}/activities`)}
                  className="activity-search-card"
                >
                  <div className="activity-card-header">
                    <ActivityIcon width={24} height={24} color="#FFC107" />
                    <div className="activity-card-type-badge">{activity.type}</div>
                  </div>

                  <h3 className="activity-card-title">{activity.name}</h3>

                  {activity.description && (
                    <p className="activity-card-description">{activity.description}</p>
                  )}

                  <div className="activity-card-meta">
                    <div className="activity-card-meta-item">
                      <span className="activity-meta-label">Trip:</span>
                      <span className="activity-meta-value">{activity.tripName}</span>
                    </div>

                    {activity.date && (
                      <div className="activity-card-meta-item">
                        <span className="activity-meta-label">Date:</span>
                        <span className="activity-meta-value">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    {activity.startTime && (
                      <div className="activity-card-meta-item">
                        <ClockIcon width={16} height={16} color="#666666" />
                        <span className="activity-meta-value">{formatTime(activity.startTime)}</span>
                      </div>
                    )}

                    {activity.cost !== undefined && (
                      <div className="activity-card-meta-item">
                        <DollarIcon width={16} height={16} color="#666666" />
                        <span className="activity-meta-value">${activity.cost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActivitySearch;
