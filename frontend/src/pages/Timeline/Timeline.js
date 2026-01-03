/**
 * Timeline Page  
 * Day-wise timeline view of the trip
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Timeline.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import { CalendarIcon, MapPinIcon, ActivityIcon } from '../../assets/svg/Icons';
import { tripAPI, stopAPI } from '../../services/api';

const Timeline = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, [tripId]);

  const loadTimeline = async () => {
    try {
      const [tripData, stopsData] = await Promise.all([
        tripAPI.getById(tripId),
        stopAPI.getAll(tripId),
      ]);
      setTrip(tripData.trip);
      
      // Build timeline from stops
      const timelineData = buildTimelineFromStops(stopsData.stops || []);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTimelineFromStops = (stops) => {
    const days = [];
    stops.forEach((stop) => {
      const startDate = new Date(stop.startDate);
      const endDate = new Date(stop.endDate);
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      for (let i = 0; i < daysDiff; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        
        days.push({
          date: currentDate.toISOString().split('T')[0],
          stop: stop,
          dayOfTrip: days.length + 1,
          activities: stop.activities || [],
        });
      }
    });

    return days;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="page-loading">Loading timeline...</div>;
  }

  return (
    <div className="timeline-page">
      <div className="timeline-container container">
        <div className="timeline-header">
          <div>
            <h1 className="timeline-title">Trip Timeline</h1>
            <p className="timeline-subtitle">{trip?.name}</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="timeline-content">
          {timeline.length === 0 ? (
            <Card>
              <div className="timeline-empty">
                <CalendarIcon width={64} height={64} color="#E0E0E0" />
                <p>No timeline available. Add stops to your trip to see the day-by-day view.</p>
              </div>
            </Card>
          ) : (
            <div className="timeline-list">
              {timeline.map((day, index) => (
                <div key={index} className="timeline-day">
                  <div className="timeline-day-marker">
                    <div className="timeline-day-number">Day {day.dayOfTrip}</div>
                    <div className="timeline-connector" />
                  </div>
                  <Card className="timeline-day-card">
                    <div className="timeline-day-header">
                      <CalendarIcon width={20} height={20} color="#FFC107" />
                      <div>
                        <h3 className="timeline-day-date">{formatDate(day.date)}</h3>
                        <div className="timeline-day-location">
                          <MapPinIcon width={16} height={16} color="#666666" />
                          <span>{day.stop.cityName}</span>
                        </div>
                      </div>
                    </div>

                    {day.activities && day.activities.length > 0 ? (
                      <div className="timeline-activities">
                        <h4 className="timeline-activities-title">
                          Activities ({day.activities.length})
                        </h4>
                        <div className="timeline-activities-list">
                          {day.activities.map((activity) => (
                            <div key={activity.id} className="timeline-activity">
                              <ActivityIcon width={16} height={16} color="#666666" />
                              <span>{activity.name}</span>
                              <Badge variant="primary" size="small">
                                {activity.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="timeline-no-activities">
                        <p>No activities planned for this day</p>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
