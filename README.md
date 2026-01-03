# 🌍 Planora - Complete Trip Planning Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-green.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **Unified travel planning from idea to execution** - Create trips, build multi-destination itineraries, and plan daily activities all in one place.

Built for **Odoo Hackathon 2026** - A comprehensive solution to fragmented travel planning.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Demo Credentials](#-demo-credentials)
- [Screenshots](#-screenshots)
- [Documentation](#-documentation)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Problem Statement

Travelers today face **fragmented planning experiences**:
- Google Docs for itineraries
- Spreadsheets for budgets  
- Notes apps for activities
- Information scattered, collaboration difficult
- No clear structure or progress tracking

**Result**: Lost details, inefficient planning, poor travel experiences.

---

## 💡 Solution

**Planora** provides a unified platform with three-level organization:

```
Trip (Overall Plan)
  └── Stops (Destinations)
      └── Activities (Daily Plans)
```

Users can:
- ✅ Create trips with budgets and travel preferences
- ✅ Build multi-city itineraries with drag-drop ordering
- ✅ Plan daily activities with time and cost tracking
- ✅ Monitor progress and budgets in real-time
- ✅ Access everything in one clean, intuitive interface

---

## ✨ Features

### 🔐 Authentication
- Secure login/signup with form validation
- Demo mode for instant exploration
- JWT-ready architecture

### 📊 Dashboard
- Hero carousel with destination imagery
- Trip statistics and analytics
- Quick access to all trips
- Unified navigation bar

### ➕ Trip Creation
- Multi-step progressive form (4 steps)
- Travel style selection (10 options)
- Date range and companion type
- Budget planning
- Realistic placeholder guidance

### 🗺️ Itinerary Management
- Add unlimited stops/destinations
- Drag-drop reordering
- City images and metadata
- Budget allocation per stop
- Activity count tracking
- Summary panel with totals

### 🎯 Activity Planning
- Daily activity scheduling
- Time and cost tracking
- Status management (planned/completed)
- Notes and details for each activity
- Cost calculations per stop
- Completion progress

### 🎨 UI/UX
- Consistent yellow theme (#FFC107)
- Responsive design (desktop, tablet, mobile)
- Smooth transitions and interactions
- Loading states and error handling
- User-friendly validation messages

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library with hooks
- **React Router 6.20.0** - Client-side routing
- **CSS3** - Custom styling with responsive design
- **Modular Architecture** - 6 pages, 7 reusable components

### Backend (Planned Architecture)
- **PostgreSQL 14+** - Relational database
- **Node.js + Express** - RESTful API (ready for integration)
- **JWT Authentication** - Token-based auth
- **Sequelize/Prisma** - ORM for database management

### Development Tools
- **Git** - Version control with collaborative workflow
- **VS Code** - Primary IDE
- **ESLint** - Code quality
- **Webpack** - Module bundling

---

## 🏗️ Architecture

### Database Design

**4 Core Tables with Relationships:**

```sql
users (id, name, email, password_hash, created_at)
  └── trips (id, user_id, name, dates, budget, travel_style)
      └── stops (id, trip_id, city, country, dates, budget, order_index)
          └── activities (id, stop_id, name, time, cost, status, notes)
```

- **One-to-Many relationships** at each level
- **Cascade deletes** for data integrity
- **Indexed foreign keys** for performance
- **UUID primary keys** for scalability

👉 [Full Database Schema](./DATABASE_SCHEMA.md)

### API Architecture

**20+ RESTful Endpoints:**

```
POST   /auth/register          - User registration
POST   /auth/login             - User authentication
GET    /trips                  - Get all user trips
POST   /trips                  - Create new trip
GET    /trips/:id/stops        - Get trip itinerary
POST   /trips/:id/stops        - Add stop to trip
GET    /stops/:id/activities   - Get stop activities
POST   /stops/:id/activities   - Add activity to stop
...
```

👉 [Full API Documentation](./API_DOCUMENTATION.md)

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar/         # Shared navigation
│   ├── Button/         # Custom button
│   ├── Input/          # Form input
│   ├── Card/           # Card layout
│   └── ...
├── pages/              # Route pages
│   ├── Login/
│   ├── Dashboard/
│   ├── CreateTrip/
│   ├── TripStopManagement/
│   └── ActivityManagement/
├── services/           # API service layer
├── assets/             # Images, icons, SVG components
└── config.js           # App configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ and npm/yarn
- **Git** for cloning

### Installation

```bash
# Clone repository
git clone https://github.com/sandhya-rj/planora-odoo-hackathon.git
cd planora-odoo-hackathon

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Application runs at: **http://localhost:3000**

### Quick Start (Demo Mode)

The app includes demo data for immediate exploration:
1. Open http://localhost:3000
2. Use demo credentials (see below)
3. Explore the complete trip planning flow

---

## 🔑 Demo Credentials

```
Email:    demo@planora.app
Password: password123
```

**Pre-loaded Demo Trips:**
- European Adventure (Paris → Amsterdam → Berlin)
- Southeast Asia Explorer (Bangkok → Bali → Singapore)
- ...and 6 more trips with realistic data

---

## 📸 Screenshots

### Dashboard
Hero carousel, trip statistics, and trip cards with yellow theme.

### Create Trip
Multi-step form with realistic placeholders guiding users through trip creation.

### Trip Stop Management
Itinerary builder with drag-drop stops, city images, and budget tracking.

### Activity Management  
Daily activity planner with time, cost, and status tracking for each destination.

---

## 📚 Documentation

- **[Database Schema](./DATABASE_SCHEMA.md)** - PostgreSQL table designs with relationships
- **[API Documentation](./API_DOCUMENTATION.md)** - RESTful endpoints and contracts
- **[Demo Script](./DEMO_SCRIPT.md)** - Video presentation guide (5 minutes)

---

## 👥 Team

Built for Odoo Hackathon 2026 by a collaborative team demonstrating:
- Database design expertise
- Frontend development skills
- API architecture planning
- Git collaboration workflow
- Problem-solving approach

---

## 🎬 Video Demo

A 5-minute walkthrough covering:
- Problem identification and solution approach
- Database schema and API architecture
- Live demo: Login → Dashboard → Create Trip → Manage Stops → Plan Activities
- Code quality and component structure
- Scalability considerations

---

## 🔄 Development Workflow

### Git Collaboration
- Feature-based commits
- Clear commit messages
- Branch strategy with proper merges
- Multiple team members contributing

### Code Quality
- Modular component design
- Reusable UI components
- Centralized service layer
- Consistent naming conventions
- Input validation and error handling

---

## 🚀 Future Enhancements

- **Backend Integration** - Connect PostgreSQL and deploy API
- **Real-time Collaboration** - Multiple users planning trips together (WebSockets)
- **Map Integration** - Visual route planning with Google Maps
- **Budget Analytics** - Spending charts and recommendations
- **Mobile App** - React Native using same API
- **Trip Sharing** - Share itineraries with fellow travelers
- **Expense Tracking** - Log actual spending vs budget

---

## 🐛 Known Limitations

- **Demo Mode Only** - Backend API not yet connected
- **Static Demo Data** - Using pre-configured trip data
- **No Persistence** - Data resets on page reload

**Production Deployment Would Add:**
- PostgreSQL database connection
- JWT authentication middleware
- Data persistence
- User sessions
- Environment variable configuration

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Odoo** for organizing the hackathon
- **React community** for excellent documentation
- **Unsplash** for destination images
- **Font Awesome** for icon inspiration

---

## 📞 Contact

For questions or feedback about this project, please open an issue in the GitHub repository.

---

<div align="center">

**Built with ❤️ for Odoo Hackathon 2026**

⭐ Star this repo if you found it interesting!

[Live Demo](#) • [Documentation](./DATABASE_SCHEMA.md) • [Report Bug](../../issues)

</div>

