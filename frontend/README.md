# Planora Frontend

Professional multi-city travel planning application built with React for the Odoo Hackathon 2026.

## Features

- **Authentication**: Login and Signup with validation
- **Trip Management**: Create and manage multi-city trips
- **Stop Management**: Add, reorder, and manage cities/stops
- **Activity Planning**: Add activities with cost and duration tracking
- **Planora Intelligence**: Trip health monitoring, budget alerts, overloaded days detection
- **Timeline View**: Day-by-day trip visualization
- **Shared Trips**: Share trip itineraries via link
- **Settings**: User profile management

## Tech Stack

- React 18
- React Router 6
- Custom component library
- Responsive design (desktop + tablet)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── svg/           # SVG icons
│   ├── components/        # Reusable components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Alert/
│   │   ├── Badge/
│   │   └── Select/
│   ├── pages/            # Page components
│   │   ├── Login/
│   │   ├── Signup/
│   │   ├── Dashboard/
│   │   ├── CreateTrip/
│   │   ├── TripStopManagement/
│   │   ├── ActivityManagement/
│   │   ├── TripHealth/
│   │   ├── Timeline/
│   │   ├── SharedTrip/
│   │   └── Settings/
│   ├── services/         # API services
│   │   └── api.js
│   ├── config.js         # Configuration
│   ├── App.js           # Main app with routing
│   ├── index.js         # Entry point
│   └── index.css        # Global styles
├── package.json
└── README.md
```

## Configuration

Edit `src/config.js` to configure:
- API endpoints
- Theme colors
- Travel styles
- Validation rules
- Intelligence thresholds

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:8000/api
```

## Design System

### Colors
- Primary: #FFC107 (Yellow)
- White: #FFFFFF
- Text: #333333
- Border: #E0E0E0

### Typography
- Font: Inter

### Components
All components follow modular, reusable patterns with props for customization.

## Backend Integration

All API calls are configured in `src/services/api.js` and use endpoints defined in `src/config.js`.

The frontend is ready to integrate with the backend once API endpoints are available.

## License

Built for Odoo Hackathon 2026
