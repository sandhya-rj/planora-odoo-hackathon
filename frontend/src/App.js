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
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected Routes - Core Screens */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trips/create" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/trips/:tripId/stops" element={<ProtectedRoute><TripStopManagement /></ProtectedRoute>} />
          <Route path="/trips/:tripId/stops/:stopId/activities" element={<ProtectedRoute><ActivityManagement /></ProtectedRoute>} />

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
