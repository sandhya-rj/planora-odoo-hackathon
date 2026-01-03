/**
 * SharedTrip Page
 * View-only trip shared via link
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SharedTrip.css';
import Card from '../../components/Card/Card';
import Badge from '../../components/Badge/Badge';
import LogoIcon from '../../assets/svg/LogoIcon';
import { CalendarIcon, MapPinIcon } from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';

const SharedTrip = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSharedTrip();
  }, [token]);

  const loadSharedTrip = async () => {
    try {
      const response = await tripAPI.getSharedTrip(token);
      setTrip(response.trip);
    } catch (err) {
      setError('Trip not found or link has expired');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="page-loading">Loading shared trip...</div>;
  }

  if (error) {
    return (
      <div className="shared-trip-page">
        <div className="shared-trip-container container">
          <div className="shared-trip-error">
            <LogoIcon width={64} height={64} />
            <h2>{error}</h2>
            <p>The trip you're looking for may have been removed or the link is invalid.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-trip-page">
      <header className="shared-trip-header">
        <div className="shared-trip-header-content container">
          <LogoIcon width={40} height={40} />
          <Badge variant="info">Shared Trip (View Only)</Badge>
        </div>
      </header>

      <div className="shared-trip-container container">
        <div className="shared-trip-title-section">
          <h1 className="shared-trip-title">{trip?.name}</h1>
          <div className="shared-trip-meta">
            <div className="shared-trip-meta-item">
              <CalendarIcon width={20} height={20} color="#666666" />
              <span>
                {formatDate(trip?.startDate)} - {formatDate(trip?.endDate)}
              </span>
            </div>
            <div className="shared-trip-meta-item">
              <MapPinIcon width={20} height={20} color="#666666" />
              <span>{trip?.stops?.length || 0} stops</span>
            </div>
          </div>
        </div>

        {trip?.stops && trip.stops.length > 0 && (
          <div className="shared-trip-stops">
            <h2 className="section-title">Trip Itinerary</h2>
            <div className="stops-list">
              {trip.stops.map((stop, index) => (
                <Card key={stop.id} className="shared-stop-card">
                  <div className="shared-stop-header">
                    <div className="shared-stop-number">{index + 1}</div>
                    <div>
                      <h3 className="shared-stop-city">{stop.cityName}</h3>
                      <p className="shared-stop-dates">
                        {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
                      </p>
                    </div>
                  </div>

                  {stop.activities && stop.activities.length > 0 && (
                    <div className="shared-activities">
                      <h4 className="shared-activities-title">Activities</h4>
                      <ul className="shared-activities-list">
                        {stop.activities.map((activity) => (
                          <li key={activity.id} className="shared-activity">
                            {activity.name}
                            {activity.cost && <span className="activity-cost">${activity.cost}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedTrip;
