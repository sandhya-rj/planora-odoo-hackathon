/**
 * API Service
 * Centralized service for all backend API calls
 */

import { API_CONFIG, STORAGE_KEYS } from '../config';

/**
 * Get authentication token from local storage
 */
const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Build request headers with authentication
 */
const buildHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = (data && data.message) || response.statusText || 'An error occurred';
    throw new Error(error);
  }

  return data;
};

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, method = 'GET', body = null, customHeaders = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const headers = buildHeaders(customHeaders);

  const config = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Replace URL parameters (e.g., :id, :tripId)
 */
const replaceParams = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

// ============================================
// Auth API
// ============================================
export const authAPI = {
  login: (credentials) => 
    apiRequest(API_CONFIG.ENDPOINTS.LOGIN, 'POST', credentials),
  
  signup: (userData) => 
    apiRequest(API_CONFIG.ENDPOINTS.SIGNUP, 'POST', userData),
  
  logout: () => 
    apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, 'POST'),
  
  verifyToken: () => 
    apiRequest(API_CONFIG.ENDPOINTS.VERIFY_TOKEN, 'GET'),
};

// ============================================
// User API
// ============================================
export const userAPI = {
  getProfile: () => 
    apiRequest(API_CONFIG.ENDPOINTS.USER_PROFILE, 'GET'),
  
  updateProfile: (profileData) => 
    apiRequest(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, 'PUT', profileData),
};

// ============================================
// Trip API
// ============================================
export const tripAPI = {
  getAll: () => 
    apiRequest(API_CONFIG.ENDPOINTS.TRIPS, 'GET'),
  
  getById: (tripId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.TRIP_DETAIL, { id: tripId }), 'GET'),
  
  create: (tripData) => 
    apiRequest(API_CONFIG.ENDPOINTS.CREATE_TRIP, 'POST', tripData),
  
  update: (tripId, tripData) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.UPDATE_TRIP, { id: tripId }), 'PUT', tripData),
  
  delete: (tripId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.DELETE_TRIP, { id: tripId }), 'DELETE'),
  
  getTripHealth: (tripId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.TRIP_HEALTH, { id: tripId }), 'GET'),
  
  getBudgetAnalysis: (tripId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.BUDGET_ANALYSIS, { id: tripId }), 'GET'),
  
  shareTrip: (tripId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.SHARE_TRIP, { id: tripId }), 'POST'),
  
  getSharedTrip: (token) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.SHARED_TRIP, { token }), 'GET'),
};

// ============================================
// Stop API
// ============================================
export const stopAPI = {
  getAll: (tripId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.STOPS, { tripId }), 'GET'),
  
  getById: (tripId, stopId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.STOP_DETAIL, { tripId, stopId }), 'GET'),
  
  create: (tripId, stopData) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.CREATE_STOP, { tripId }), 'POST', stopData),
  
  update: (tripId, stopId, stopData) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.UPDATE_STOP, { tripId, stopId }), 'PUT', stopData),
  
  delete: (tripId, stopId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.DELETE_STOP, { tripId, stopId }), 'DELETE'),
  
  reorder: (tripId, stopOrder) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.REORDER_STOPS, { tripId }), 'POST', { order: stopOrder }),
};

// ============================================
// Activity API
// ============================================
export const activityAPI = {
  getAll: (tripId, stopId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.ACTIVITIES, { tripId, stopId }), 'GET'),
  
  getById: (tripId, stopId, activityId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.ACTIVITY_DETAIL, { tripId, stopId, activityId }), 'GET'),
  
  create: (tripId, stopId, activityData) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.CREATE_ACTIVITY, { tripId, stopId }), 'POST', activityData),
  
  update: (tripId, stopId, activityId, activityData) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.UPDATE_ACTIVITY, { tripId, stopId, activityId }), 'PUT', activityData),
  
  delete: (tripId, stopId, activityId) => 
    apiRequest(replaceParams(API_CONFIG.ENDPOINTS.DELETE_ACTIVITY, { tripId, stopId, activityId }), 'DELETE'),
};

// ============================================
// Recommendations API
// ============================================
export const recommendationsAPI = {
  getCities: () => 
    apiRequest(API_CONFIG.ENDPOINTS.RECOMMENDED_CITIES, 'GET'),
};

export default {
  auth: authAPI,
  user: userAPI,
  trip: tripAPI,
  stop: stopAPI,
  activity: activityAPI,
  recommendations: recommendationsAPI,
};
