# Planora Backend API - Endpoint Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### POST /auth/register
Register a new user
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 201 Created
{
  "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
  "token": "jwt_token_here"
}
```

### POST /auth/login
Login existing user
```json
Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
  "token": "jwt_token_here"
}
```

### POST /auth/logout
Invalidate current session (requires auth)

---

## 2. Trips Endpoints

### GET /trips
Get all trips for authenticated user
```json
Response: 200 OK
{
  "trips": [
    {
      "id": "uuid",
      "name": "European Adventure",
      "startDate": "2026-01-15",
      "endDate": "2026-01-30",
      "budget": 4500,
      "status": "ongoing",
      "stopsCount": 3
    }
  ]
}
```

### POST /trips
Create new trip (requires auth)
```json
Request:
{
  "name": "Bali Getaway",
  "description": "Beach and temples",
  "startDate": "2026-02-01",
  "endDate": "2026-02-10",
  "budget": 2500,
  "travelStyle": "Relaxation"
}

Response: 201 Created
{
  "trip": { "id": "uuid", ... }
}
```

### GET /trips/:tripId
Get single trip with stops

### PUT /trips/:tripId
Update trip details

### DELETE /trips/:tripId
Delete trip (cascade deletes stops and activities)

---

## 3. Stops Endpoints

### GET /trips/:tripId/stops
Get all stops for a trip (ordered by order_index)
```json
Response: 200 OK
{
  "stops": [
    {
      "id": "uuid",
      "cityName": "Paris",
      "country": "France",
      "startDate": "2026-01-15",
      "endDate": "2026-01-20",
      "budget": 1500,
      "order": 1,
      "activitiesCount": 5
    }
  ]
}
```

### POST /trips/:tripId/stops
Add new stop to trip
```json
Request:
{
  "cityName": "Amsterdam",
  "country": "Netherlands",
  "startDate": "2026-01-21",
  "endDate": "2026-01-25",
  "budget": 1200,
  "notes": "Visit museums"
}

Response: 201 Created
```

### PUT /trips/:tripId/stops/:stopId
Update stop details

### DELETE /trips/:tripId/stops/:stopId
Delete stop

### PATCH /trips/:tripId/stops/reorder
Reorder stops (drag-drop functionality)
```json
Request:
{
  "stopIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## 4. Activities Endpoints

### GET /trips/:tripId/stops/:stopId/activities
Get all activities for a stop
```json
Response: 200 OK
{
  "activities": [
    {
      "id": "uuid",
      "name": "Eiffel Tower Visit",
      "time": "09:00",
      "cost": 28,
      "status": "planned",
      "notes": "Book tickets online"
    }
  ]
}
```

### POST /trips/:tripId/stops/:stopId/activities
Add new activity
```json
Request:
{
  "name": "Louvre Museum",
  "time": "14:00",
  "cost": 17,
  "status": "planned",
  "notes": "Avoid queues"
}

Response: 201 Created
```

### PUT /trips/:tripId/stops/:stopId/activities/:activityId
Update activity

### DELETE /trips/:tripId/stops/:stopId/activities/:activityId
Delete activity

### PATCH /trips/:tripId/stops/:stopId/activities/:activityId/status
Mark activity as done/planned

---

## Error Handling

All endpoints return consistent error format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "End date must be after start date",
    "field": "endDate"
  }
}
```

### Error Codes
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (not trip owner)
- 404: Not Found
- 500: Internal Server Error

---

## Input Validation

### Trip Creation
- Name: required, 2-255 chars
- Start/End dates: required, valid ISO format, end > start
- Budget: optional, must be positive number
- Travel style: optional, one of predefined values

### Stop Creation
- City name: required, 2-255 chars
- Dates: required, must fall within trip dates
- Budget: optional, positive number

### Activity Creation
- Name: required, 2-255 chars
- Time: optional, HH:MM format
- Cost: optional, non-negative
- Status: must be 'planned' or 'done'

---

**Implementation Status**: 
- API structure designed and documented
- Frontend service layer ready (`frontend/src/services/api.js`)
- Demo mode currently uses static data matching this exact API contract
- Backend ready for integration
