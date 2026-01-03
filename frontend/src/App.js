/**
 * App.js - Main Application Component
 * Configures routing for all Planora pages
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Pages
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import CreateTrip from './pages/CreateTrip/CreateTrip';
import TripStopManagement from './pages/TripStopManagement/TripStopManagement';
import ActivityManagement from './pages/ActivityManagement/ActivityManagement';
import TripHealth from './pages/TripHealth/TripHealth';
import Timeline from './pages/Timeline/Timeline';
import SharedTrip from './pages/SharedTrip/SharedTrip';
import Settings from './pages/Settings/Settings';
import Analytics from './pages/Analytics/Analytics';
import CalendarView from './pages/CalendarView/CalendarView';
import ActivitySearch from './pages/ActivitySearch/ActivitySearch';
import ItineraryByDate from './pages/ItineraryByDate/ItineraryByDate';

import { STORAGE_KEYS } from './config';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Public Route Component
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes - Temporarily disabled auth for demo */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Shared Trip - Public */}
          <Route path="/shared/:token" element={<SharedTrip />} />

          {/* All Routes - Temporarily unprotected for demo */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/trips/:tripId/stops" element={<TripStopManagement />} />
          <Route path="/trips/:tripId/stops/:stopId/activities" element={<ActivityManagement />} />
          <Route path="/trips/:tripId/health" element={<TripHealth />} />
          <Route path="/trips/:tripId/timeline" element={<Timeline />} />
          <Route path="/trips/:tripId/itinerary" element={<ItineraryByDate />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/search/activities" element={<ActivitySearch />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
