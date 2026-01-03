/**
 * Planora Frontend Configuration
 * Centralized configuration for all constants, API endpoints, and theme settings
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    VERIFY_TOKEN: '/auth/verify',
    
    // User endpoints
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    
    // Trip endpoints
    TRIPS: '/trips',
    TRIP_DETAIL: '/trips/:id',
    CREATE_TRIP: '/trips/create',
    UPDATE_TRIP: '/trips/:id/update',
    DELETE_TRIP: '/trips/:id/delete',
    
    // Stop endpoints
    STOPS: '/trips/:tripId/stops',
    STOP_DETAIL: '/trips/:tripId/stops/:stopId',
    CREATE_STOP: '/trips/:tripId/stops/create',
    UPDATE_STOP: '/trips/:tripId/stops/:stopId/update',
    DELETE_STOP: '/trips/:tripId/stops/:stopId/delete',
    REORDER_STOPS: '/trips/:tripId/stops/reorder',
    
    // Activity endpoints
    ACTIVITIES: '/trips/:tripId/stops/:stopId/activities',
    ACTIVITY_DETAIL: '/trips/:tripId/stops/:stopId/activities/:activityId',
    CREATE_ACTIVITY: '/trips/:tripId/stops/:stopId/activities/create',
    UPDATE_ACTIVITY: '/trips/:tripId/stops/:stopId/activities/:activityId/update',
    DELETE_ACTIVITY: '/trips/:tripId/stops/:stopId/activities/:activityId/delete',
    
    // Trip intelligence endpoints
    TRIP_HEALTH: '/trips/:id/health',
    BUDGET_ANALYSIS: '/trips/:id/budget',
    
    // Shared trip endpoints
    SHARE_TRIP: '/trips/:id/share',
    SHARED_TRIP: '/trips/shared/:token',
    
    // Recommendations
    RECOMMENDED_CITIES: '/recommendations/cities',
  }
};

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#FFC107',
    PRIMARY_DARK: '#FFA000',
    PRIMARY_LIGHT: '#FFECB3',
    WHITE: '#FFFFFF',
    TEXT_PRIMARY: '#333333',
    TEXT_SECONDARY: '#666666',
    TEXT_LIGHT: '#999999',
    BORDER: '#E0E0E0',
    BACKGROUND: '#F5F5F5',
    SUCCESS: '#4CAF50',
    WARNING: '#FF9800',
    ERROR: '#F44336',
    INFO: '#2196F3',
  },
  SHADOWS: {
    LIGHT: '0 2px 4px rgba(0, 0, 0, 0.1)',
    MEDIUM: '0 4px 8px rgba(0, 0, 0, 0.1)',
    HEAVY: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
  SPACING: {
    XS: '4px',
    SM: '8px',
    MD: '16px',
    LG: '24px',
    XL: '32px',
    XXL: '48px',
  },
  BORDER_RADIUS: {
    SM: '4px',
    MD: '8px',
    LG: '12px',
    XL: '16px',
    ROUND: '50%',
  },
};

// Travel Style Configuration
export const TRAVEL_STYLES = {
  COMPANION: [
    { value: 'solo', label: 'Solo' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family' },
    { value: 'group', label: 'Group' },
  ],
  BUDGET: [
    { value: 'budget', label: 'Budget' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'luxury', label: 'Luxury' },
  ],
  PACE: [
    { value: 'slow', label: 'Slow (Relaxed)' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'fast', label: 'Fast (Action-packed)' },
  ],
};

// Activity Types Configuration
export const ACTIVITY_TYPES = [
  { value: 'sightseeing', label: 'Sightseeing', icon: 'camera' },
  { value: 'dining', label: 'Dining', icon: 'restaurant' },
  { value: 'adventure', label: 'Adventure', icon: 'mountain' },
  { value: 'cultural', label: 'Cultural', icon: 'museum' },
  { value: 'shopping', label: 'Shopping', icon: 'shopping' },
  { value: 'entertainment', label: 'Entertainment', icon: 'theater' },
  { value: 'relaxation', label: 'Relaxation', icon: 'spa' },
  { value: 'transportation', label: 'Transportation', icon: 'car' },
  { value: 'accommodation', label: 'Accommodation', icon: 'hotel' },
  { value: 'other', label: 'Other', icon: 'star' },
];

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  TRIP_NAME_MIN_LENGTH: 3,
  TRIP_NAME_MAX_LENGTH: 100,
  MAX_TRIP_DAYS: 365,
  MIN_TRIP_DAYS: 1,
  MAX_STOPS_PER_TRIP: 50,
  MAX_ACTIVITIES_PER_DAY: 15,
  MIN_BUDGET: 0,
  MAX_BUDGET: 1000000,
  ACTIVITY_DURATION_MIN: 15, // minutes
  ACTIVITY_DURATION_MAX: 1440, // 24 hours in minutes
};

// Planora Intelligence Thresholds
export const INTELLIGENCE_THRESHOLDS = {
  // Budget warnings
  BUDGET_WARNING_PERCENT: 80, // Warn at 80% budget
  BUDGET_CRITICAL_PERCENT: 100, // Critical at 100% budget
  
  // Day load warnings
  OVERLOADED_DAY_ACTIVITIES: 8, // More than 8 activities in a day
  OVERLOADED_DAY_HOURS: 14, // More than 14 hours of activities
  
  // Health score ranges
  HEALTH_EXCELLENT: 90,
  HEALTH_GOOD: 70,
  HEALTH_FAIR: 50,
  HEALTH_POOR: 0,
};

// Date Format
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'planora_auth_token',
  USER_DATA: 'planora_user_data',
  THEME_PREFERENCE: 'planora_theme',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

export default {
  API_CONFIG,
  THEME,
  TRAVEL_STYLES,
  ACTIVITY_TYPES,
  VALIDATION,
  INTELLIGENCE_THRESHOLDS,
  DATE_FORMAT,
  DISPLAY_DATE_FORMAT,
  STORAGE_KEYS,
  PAGINATION,
};
