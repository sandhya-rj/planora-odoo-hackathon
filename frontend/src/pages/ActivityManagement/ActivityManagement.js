/**
 * ActivityManagement Page
 * Manage activities for a specific stop
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActivityManagement.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Alert from '../../components/Alert/Alert';
import Badge from '../../components/Badge/Badge';
import { PlusIcon, ActivityIcon, DollarIcon, ClockIcon, TrashIcon } from '../../assets/svg/Icons';
import { stopAPI, activityAPI } from '../../services/api';
import { ACTIVITY_TYPES, VALIDATION } from '../../config';

const ActivityManagement = () => {
  const { tripId, stopId } = useParams();
  const navigate = useNavigate();
  const [stop, setStop] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [newActivity, setNewActivity] = useState({
    name: '',
    type: '',
    cost: '',
    duration: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadStopAndActivities();
  }, [tripId, stopId]);

  const loadStopAndActivities = async () => {
    try {
      const [stopData, activitiesData] = await Promise.all([
        stopAPI.getById(tripId, stopId),
        activityAPI.getAll(tripId, stopId),
      ]);
      setStop(stopData.stop);
      setActivities(activitiesData.activities || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load activities' });
    } finally {
      setLoading(false);
    }
  };

  const validateActivityForm = () => {
    const newErrors = {};

    if (!newActivity.name.trim()) {
      newErrors.name = 'Activity name is required';
    }

    if (!newActivity.type) {
      newErrors.type = 'Activity type is required';
    }

    if (newActivity.cost && (isNaN(parseFloat(newActivity.cost)) || parseFloat(newActivity.cost) < 0)) {
      newErrors.cost = 'Please enter a valid cost';
    }

    if (newActivity.duration) {
      const dur = parseInt(newActivity.duration);
      if (isNaN(dur) || dur < VALIDATION.ACTIVITY_DURATION_MIN || dur > VALIDATION.ACTIVITY_DURATION_MAX) {
        newErrors.duration = `Duration must be between ${VALIDATION.ACTIVITY_DURATION_MIN} and ${VALIDATION.ACTIVITY_DURATION_MAX} minutes`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!validateActivityForm()) return;

    try {
      const response = await activityAPI.create(tripId, stopId, {
        name: newActivity.name,
        type: newActivity.type,
        cost: newActivity.cost ? parseFloat(newActivity.cost) : null,
        duration: newActivity.duration ? parseInt(newActivity.duration) : null,
        notes: newActivity.notes,
      });

      setActivities([...activities, response.activity]);
      setNewActivity({ name: '', type: '', cost: '', duration: '', notes: '' });
      setShowAddForm(false);
      setAlert({ type: 'success', message: 'Activity added successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to add activity' });
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await activityAPI.delete(tripId, stopId, activityId);
      setActivities(activities.filter((a) => a.id !== activityId));
      setAlert({ type: 'success', message: 'Activity deleted successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete activity' });
    }
  };

  const getTotalCost = () => {
    return activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
  };

  const getTotalDuration = () => {
    return activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  };

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="activity-management-page">
      <div className="activity-management-container container">
        <div className="activity-header">
          <div>
            <h1 className="activity-title">Activities for {stop?.cityName}</h1>
            <p className="activity-subtitle">Plan and organize activities for this stop</p>
          </div>
          <Button variant="secondary" onClick={() => navigate(`/trips/${tripId}/stops`)}>
            Back to Stops
          </Button>
        </div>

        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        <div className="activity-stats">
          <Card className="stat-card">
            <div className="stat-content">
              <ActivityIcon width={24} height={24} color="#FFC107" />
              <div>
                <div className="stat-value">{activities.length}</div>
                <div className="stat-label">Activities</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <DollarIcon width={24} height={24} color="#4CAF50" />
              <div>
                <div className="stat-value">${getTotalCost().toFixed(2)}</div>
                <div className="stat-label">Total Cost</div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <ClockIcon width={24} height={24} color="#2196F3" />
              <div>
                <div className="stat-value">{(getTotalDuration() / 60).toFixed(1)}h</div>
                <div className="stat-label">Total Duration</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="activity-card">
          <div className="activities-list-header">
            <h2 className="activities-list-title">Activities</h2>
            <Button
              variant="primary"
              size="small"
              icon={<PlusIcon width={18} height={18} />}
              onClick={() => setShowAddForm(true)}
            >
              Add Activity
            </Button>
          </div>

          {showAddForm && (
            <form className="add-activity-form" onSubmit={handleAddActivity}>
              <Input
                name="name"
                label="Activity Name"
                placeholder="e.g., Visit Eiffel Tower"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                error={errors.name}
                required
              />
              <Select
                name="type"
                label="Activity Type"
                placeholder="Select type"
                value={newActivity.type}
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                options={ACTIVITY_TYPES}
                error={errors.type}
                required
              />
              <div className="form-row">
                <Input
                  type="number"
                  name="cost"
                  label="Cost (USD)"
                  placeholder="0.00"
                  value={newActivity.cost}
                  onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
                  error={errors.cost}
                  min="0"
                  step="0.01"
                />
                <Input
                  type="number"
                  name="duration"
                  label="Duration (minutes)"
                  placeholder="60"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                  error={errors.duration}
                  min={VALIDATION.ACTIVITY_DURATION_MIN}
                  max={VALIDATION.ACTIVITY_DURATION_MAX}
                />
              </div>
              <Input
                type="text"
                name="notes"
                label="Notes (Optional)"
                placeholder="Additional details..."
                value={newActivity.notes}
                onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
              />
              <div className="form-actions">
                <Button type="button" variant="text" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Add Activity
                </Button>
              </div>
            </form>
          )}

          <div className="activities-list">
            {activities.length === 0 ? (
              <div className="activities-empty">
                <ActivityIcon width={48} height={48} color="#E0E0E0" />
                <p>No activities planned yet. Add your first activity to get started.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-main">
                    <div className="activity-info">
                      <h3 className="activity-name">{activity.name}</h3>
                      <div className="activity-meta">
                        <Badge variant="primary" size="small">
                          {ACTIVITY_TYPES.find((t) => t.value === activity.type)?.label || activity.type}
                        </Badge>
                        {activity.cost && (
                          <span className="activity-meta-item">
                            <DollarIcon width={14} height={14} /> ${activity.cost.toFixed(2)}
                          </span>
                        )}
                        {activity.duration && (
                          <span className="activity-meta-item">
                            <ClockIcon width={14} height={14} /> {activity.duration} min
                          </span>
                        )}
                      </div>
                      {activity.notes && <p className="activity-notes">{activity.notes}</p>}
                    </div>
                    <Button
                      variant="text"
                      size="small"
                      icon={<TrashIcon width={16} height={16} />}
                      onClick={() => handleDeleteActivity(activity.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActivityManagement;
