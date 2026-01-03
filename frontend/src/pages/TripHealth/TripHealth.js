/**
 * TripHealth Page
 * Display Planora Intelligence: trip health, budget analysis, alerts
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TripHealth.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Alert from '../../components/Alert/Alert';
import Badge from '../../components/Badge/Badge';
import { AlertIcon, DollarIcon, CalendarIcon, ActivityIcon } from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { INTELLIGENCE_THRESHOLDS } from '../../config';

const TripHealth = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripHealth();
  }, [tripId]);

  const loadTripHealth = async () => {
    try {
      const [tripResponse, healthResponse, budgetResponse] = await Promise.all([
        tripAPI.getById(tripId),
        tripAPI.getTripHealth(tripId),
        tripAPI.getBudgetAnalysis(tripId),
      ]);

      setTrip(tripResponse.trip);
      setHealthData(healthResponse.health);
      setBudgetData(budgetResponse.budget);
    } catch (error) {
      console.error('Failed to load trip health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= INTELLIGENCE_THRESHOLDS.HEALTH_EXCELLENT) return '#4CAF50';
    if (score >= INTELLIGENCE_THRESHOLDS.HEALTH_GOOD) return '#FFC107';
    if (score >= INTELLIGENCE_THRESHOLDS.HEALTH_FAIR) return '#FF9800';
    return '#F44336';
  };

  const getHealthScoreLabel = (score) => {
    if (score >= INTELLIGENCE_THRESHOLDS.HEALTH_EXCELLENT) return 'Excellent';
    if (score >= INTELLIGENCE_THRESHOLDS.HEALTH_GOOD) return 'Good';
    if (score >= INTELLIGENCE_THRESHOLDS.HEALTH_FAIR) return 'Fair';
    return 'Needs Attention';
  };

  const getBudgetPercentage = () => {
    if (!trip?.budget || !budgetData?.totalSpent) return 0;
    return (budgetData.totalSpent / trip.budget) * 100;
  };

  const getBudgetStatus = () => {
    const percentage = getBudgetPercentage();
    if (percentage >= INTELLIGENCE_THRESHOLDS.BUDGET_CRITICAL_PERCENT) return 'error';
    if (percentage >= INTELLIGENCE_THRESHOLDS.BUDGET_WARNING_PERCENT) return 'warning';
    return 'success';
  };

  if (loading) {
    return <div className="page-loading">Loading trip health...</div>;
  }

  return (
    <div className="trip-health-page">
      <div className="trip-health-container container">
        <div className="trip-health-header">
          <div>
            <h1 className="trip-health-title">Trip Health & Intelligence</h1>
            <p className="trip-health-subtitle">{trip?.name}</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="health-score-section">
          <Card className="health-score-card">
            <div className="health-score-content">
              <div
                className="health-score-circle"
                style={{ borderColor: getHealthScoreColor(healthData?.score || 0) }}
              >
                <span className="health-score-value">{healthData?.score || 0}</span>
                <span className="health-score-max">/100</span>
              </div>
              <div className="health-score-info">
                <h2 className="health-score-label">
                  {getHealthScoreLabel(healthData?.score || 0)}
                </h2>
                <p className="health-score-description">
                  Overall trip organization and planning quality
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="health-alerts-section">
          <h2 className="section-title">Planora Intelligence Alerts</h2>
          {healthData?.alerts && healthData.alerts.length > 0 ? (
            <div className="alerts-grid">
              {healthData.alerts.map((alert, index) => (
                <Alert
                  key={index}
                  type={alert.severity}
                  message={alert.message}
                />
              ))}
            </div>
          ) : (
            <Card>
              <div className="no-alerts">
                <p>No alerts. Your trip is well-planned!</p>
              </div>
            </Card>
          )}
        </div>

        <div className="budget-section">
          <h2 className="section-title">Budget Analysis</h2>
          <Card>
            <div className="budget-overview">
              <div className="budget-stat">
                <DollarIcon width={24} height={24} color="#666666" />
                <div>
                  <div className="budget-stat-label">Total Budget</div>
                  <div className="budget-stat-value">
                    ${trip?.budget?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
              <div className="budget-stat">
                <DollarIcon width={24} height={24} color="#4CAF50" />
                <div>
                  <div className="budget-stat-label">Spent</div>
                  <div className="budget-stat-value">
                    ${budgetData?.totalSpent?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
              <div className="budget-stat">
                <DollarIcon width={24} height={24} color="#FF9800" />
                <div>
                  <div className="budget-stat-label">Remaining</div>
                  <div className="budget-stat-value">
                    ${(trip?.budget - (budgetData?.totalSpent || 0))?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </div>

            {trip?.budget && (
              <div className="budget-progress">
                <div className="budget-progress-bar">
                  <div
                    className={`budget-progress-fill budget-progress-fill--${getBudgetStatus()}`}
                    style={{ width: `${Math.min(getBudgetPercentage(), 100)}%` }}
                  />
                </div>
                <div className="budget-progress-label">
                  {getBudgetPercentage().toFixed(1)}% of budget used
                </div>
              </div>
            )}

            {budgetData?.breakdown && budgetData.breakdown.length > 0 && (
              <div className="budget-breakdown">
                <h3 className="budget-breakdown-title">Cost Breakdown</h3>
                {budgetData.breakdown.map((item, index) => (
                  <div key={index} className="budget-breakdown-item">
                    <span className="budget-breakdown-category">{item.category}</span>
                    <span className="budget-breakdown-amount">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="timeline-section">
          <div className="section-header">
            <h2 className="section-title">Timeline View</h2>
            <Button
              variant="primary"
              onClick={() => navigate(`/trips/${tripId}/timeline`)}
            >
              View Full Timeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripHealth;
