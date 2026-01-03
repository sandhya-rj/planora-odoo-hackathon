# Planora - Database Architecture

## Technology Stack
- **Database**: PostgreSQL 14+
- **ORM**: Sequelize / Prisma (planned)
- **Authentication**: JWT tokens with bcrypt password hashing

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Trips Table
```sql
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2),
    travel_style VARCHAR(50),
    companion VARCHAR(50),
    pace VARCHAR(50),
    cover_photo TEXT,
    status VARCHAR(20) DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
```

### 3. Stops Table (Trip Itinerary)
```sql
CREATE TABLE stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    city_name VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2),
    notes TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stops_trip_id ON stops(trip_id);
CREATE INDEX idx_stops_order ON stops(trip_id, order_index);
```

### 4. Activities Table (Daily Planning)
```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stop_id UUID REFERENCES stops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    time TIME,
    cost DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_stop_id ON activities(stop_id);
CREATE INDEX idx_activities_status ON activities(status);
```

## Relationships

- **One-to-Many**: User → Trips (1 user can have many trips)
- **One-to-Many**: Trip → Stops (1 trip can have many stops/destinations)
- **One-to-Many**: Stop → Activities (1 stop can have many activities)
- **Cascade Delete**: Deleting a trip removes all its stops and activities

## Data Validation (Backend)

- Email validation with regex
- Date validation (end_date must be after start_date)
- Budget must be non-negative
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)
- Sanitize all text inputs to prevent SQL injection

## Performance Optimizations

- Indexed foreign keys for faster joins
- Compound index on (trip_id, order_index) for stop ordering
- UUID for distributed scalability
- Prepared statements to prevent SQL injection

## Planned Migrations

1. Initial schema setup
2. Add user sessions table for JWT management
3. Add trip_collaborators table for shared trips (future feature)
4. Add activity_categories table for filtering

---

**Note**: Frontend currently uses demo data that mirrors this exact schema structure. Backend API integration is scaffolded and ready for connection.
