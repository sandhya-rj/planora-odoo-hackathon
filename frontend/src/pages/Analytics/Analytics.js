/**
 * Analytics Dashboard Page
 * Displays trip analytics with charts (pie, line, bar)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Analytics.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { LogoutIcon } from '../../assets/svg/Icons';
import { tripAPI } from '../../services/api';
import { STORAGE_KEYS } from '../../config';
import LogoIcon from '../../assets/svg/LogoIcon';
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [budgetData, setBudgetData] = useState([]);
  const [tripTrendData, setTripTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    totalActivities: 0,
    totalCities: 0,
  });

  const COLORS = ['#FFC107', '#FF9800', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5'];

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  /**
   * Load analytics data
   */
  const loadAnalyticsData = async () => {
    try {
      // Get user from local storage
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Fetch trips and calculate analytics
      const tripsData = await tripAPI.getAll();
      const trips = tripsData.trips || [];

      // Calculate stats
      const totalTrips = trips.length;
      const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
      const totalActivities = trips.reduce((sum, trip) => sum + (trip.activitiesCount || 0), 0);
      const totalCities = trips.reduce((sum, trip) => sum + (trip.stopsCount || 0), 0);

      setStats({
        totalTrips,
        totalBudget,
        totalActivities,
        totalCities,
      });

      // Budget distribution (pie chart)
      const budgetByTrip = trips
        .filter((trip) => trip.budget > 0)
        .slice(0, 6)
        .map((trip) => ({
          name: trip.name,
          value: trip.budget,
        }));
      setBudgetData(budgetByTrip);

      // Trip trend over months (line chart)
      const monthlyTrips = {};
      trips.forEach((trip) => {
        const month = new Date(trip.startDate).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        monthlyTrips[month] = (monthlyTrips[month] || 0) + 1;
      });
      const trendData = Object.entries(monthlyTrips).map(([month, count]) => ({
        month,
        trips: count,
      }));
      setTripTrendData(trendData);

      // Activities by category (bar chart)
      const categories = {};
      trips.forEach((trip) => {
        const activities = trip.activitiesCount || 0;
        const category = trip.style?.groupType || 'Other';
        categories[category] = (categories[category] || 0) + activities;
      });
      const categoryChartData = Object.entries(categories).map(([category, count]) => ({
        category,
        activities: count,
      }));
      setCategoryData(categoryChartData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
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

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div className="analytics-header-content container">
          <div className="analytics-logo">
            <LogoIcon width={40} height={40} />
            <span className="analytics-logo-text">Planora Analytics</span>
          </div>
          <div className="analytics-header-actions">
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

      <main className="analytics-main container">
        <h1 className="analytics-title">Trip Analytics & Insights</h1>

        {loading ? (
          <div className="analytics-loading">Loading analytics...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <section className="analytics-stats-section">
              <Card className="analytics-stat-card">
                <div className="stat-value">{stats.totalTrips}</div>
                <div className="stat-label">Total Trips</div>
              </Card>
              <Card className="analytics-stat-card">
                <div className="stat-value">${stats.totalBudget.toLocaleString()}</div>
                <div className="stat-label">Total Budget</div>
              </Card>
              <Card className="analytics-stat-card">
                <div className="stat-value">{stats.totalActivities}</div>
                <div className="stat-label">Total Activities</div>
              </Card>
              <Card className="analytics-stat-card">
                <div className="stat-value">{stats.totalCities}</div>
                <div className="stat-label">Cities Visited</div>
              </Card>
            </section>

            {/* Charts Grid */}
            <section className="analytics-charts-section">
              {/* Budget Distribution - Pie Chart */}
              {budgetData.length > 0 && (
                <Card className="analytics-chart-card">
                  <h2 className="analytics-chart-title">Budget Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Trip Trend - Line Chart */}
              {tripTrendData.length > 0 && (
                <Card className="analytics-chart-card">
                  <h2 className="analytics-chart-title">Trip Trend Over Time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tripTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                      <XAxis dataKey="month" stroke="#666666" />
                      <YAxis stroke="#666666" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="trips"
                        stroke="#FFC107"
                        strokeWidth={3}
                        dot={{ fill: '#FFC107', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Activities by Category - Bar Chart */}
              {categoryData.length > 0 && (
                <Card className="analytics-chart-card analytics-chart-card-wide">
                  <h2 className="analytics-chart-title">Activities by Category</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                      <XAxis dataKey="category" stroke="#666666" />
                      <YAxis stroke="#666666" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="activities" fill="#FFC107" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </section>

            {/* Empty State */}
            {budgetData.length === 0 && tripTrendData.length === 0 && categoryData.length === 0 && (
              <Card className="analytics-empty-state">
                <div className="analytics-empty-content">
                  <h3 className="analytics-empty-title">No Analytics Data Yet</h3>
                  <p className="analytics-empty-text">
                    Create some trips to see beautiful analytics and insights
                  </p>
                  <Button variant="primary" onClick={() => navigate('/trips/create')}>
                    Create Trip
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
