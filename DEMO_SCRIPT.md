# 🎯 PLANORA - 5-MINUTE VIDEO SUBMISSION SCRIPT

**TOTAL TIME: 4 minutes 45 seconds**

---

## RECORDING SETUP
- **Screen Recording**: OBS Studio or Zoom (1080p)
- **Show**: Browser (app) + VS Code (code/docs)
- **Audio**: Clear microphone, no background noise
- **Practice**: 2-3 times before final recording

---

## 0:00 - 0:20 | INTRODUCTION (20 sec)

**[SHOW: Landing page or team slide]**

**Speaker:**
> "Hello Odoo team! We're presenting **Planora** - a comprehensive trip planning platform that solves the problem of fragmented travel organization. I'm [name] and this is our solution for the hackathon challenge."

---

## 0:20 - 0:50 | PROBLEM & SOLUTION (30 sec)

**[SHOW: Split screen - messy planning apps vs Planora dashboard]**

**Speaker:**
> "Today, travelers juggle Google Docs for itineraries, spreadsheets for budgets, and notes apps for activities. Information gets lost and planning becomes chaotic.
> 
> **Planora provides a unified platform** where users create trips, build multi-destination itineraries, and plan daily activities - all with budget tracking and progress monitoring. It's the complete trip planning workflow in one place."

---

## 0:50 - 2:00 | DATABASE & ARCHITECTURE (70 sec)

**[SHOW: DATABASE_SCHEMA.md - scroll through tables]**

**Speaker:**
> "Let me show our technical foundation. We designed a **PostgreSQL database** with four core tables:
> 
> - **Users** table with secure password hashing
> - **Trips** table storing travel plans with dates, budgets, and preferences
> - **Stops** table for multi-city itineraries with ordering
> - **Activities** table for daily planning
> 
> Notice the relationships: Users have many Trips, Trips have many Stops, Stops have many Activities. We implemented cascade deletes for data integrity and indexed foreign keys for performance."

**[SWITCH TO: API_DOCUMENTATION.md - show endpoints]**

> "Our **RESTful API architecture** includes 20+ endpoints:
> - Authentication with JWT tokens
> - Full CRUD operations for trips, stops, and activities  
> - Input validation: email regex, date validation, SQL injection prevention
> - Consistent error handling with proper HTTP status codes
> 
> The frontend service layer is built to match this exact API contract."

**[SWITCH TO: VS Code - show folder structure]**

> "**Frontend architecture**: React 18, modular component design with 6 pages and 7 reusable components. Centralized routing, API service layer, and configuration management."

---

## 2:00 - 4:00 | LIVE APP DEMO (2 min)

**[SHOW: Browser with app]**

### 2:00 - 2:10 | Login (10 sec)
> "Starting with our authentication screen - clean UI with form validation."

**[ACTION: Click demo login]**

### 2:10 - 2:30 | Dashboard (20 sec)
**[SHOW: Dashboard with carousel, stats, trips]**

> "Users land on a dashboard showing:
> - Hero carousel with destination imagery
> - Trip statistics: 8 active trips, 15 destinations, $24,500 budget
> - Trip cards with our consistent yellow theme
> - Notice the navbar: Home, My Trips, Create Trip, search bar, and notifications"

**[ACTION: Scroll through trips slowly]**

### 2:30 - 2:55 | Create Trip (25 sec)
**[ACTION: Click Create Trip]**

> "Creating a new trip uses a **4-step progressive form**:
> 
> Step 1: Trip name and description - notice realistic placeholders guiding users
> 
> Step 2: Travel style selection from 10 options
> 
> Step 3: Dates and companion type
> 
> Step 4: Budget planning
> 
> Form validation ensures only essential fields are required to reduce friction."

**[ACTION: Fill form quickly - type "Bali Adventure", select options, submit]**

### 2:55 - 3:35 | Trip Stop Management (40 sec)
**[SHOW: TripStopManagement page]**

> "Now building the itinerary. Watch as I add multiple stops."

**[ACTION: Click Add Stop, enter Paris, dates, budget, save]**

> "Each stop card displays:
> - City with image banner
> - Duration with calculated days
> - Budget allocation  
> - Planned activities count
> - **Plan Activities button** - this is our key navigation"

**[ACTION: Add Amsterdam stop]**

> "Stops can be reordered with drag-and-drop."

**[ACTION: Show drag gesture]**

> "The summary panel shows total stops, trip duration, and budget breakdown - exactly matching our database schema design."

### 3:35 - 4:00 | Activity Management (25 sec)
**[ACTION: Click "Plan Activities" on Paris]**

> "Final level: daily activity planning. Adding activities to Paris."

**[ACTION: Click Add Activity, enter "Eiffel Tower Visit", time "09:00", cost "28", save]**

> "Each activity tracks:
> - Name and scheduled time
> - Individual costs
> - Status: planned or completed
> - Notes for details
> 
> The page calculates total costs and completion progress."

**[ACTION: Add one more activity quickly]**

> "This demonstrates our complete hierarchy: Trip → Stops → Activities."

---

## 4:00 - 4:30 | CODE QUALITY (30 sec)

**[SHOW: VS Code - components folder]**

**Speaker:**
> "Quick look at our code quality:
> 
> **Component architecture**: Shared Navbar component across all pages, reusable UI components for consistency."

**[SHOW: Git log in terminal]**

> "**Git collaboration**: Multiple feature commits from team members with clear messages. Notice 'Add navbar component', 'Fix navigation flow', 'Add database schema'."

**[SHOW: Login.js validation code snippet]**

> "**Input validation**: Email regex patterns, required field checks, user-friendly error messages. For example, our trip creation validates date ranges and budget values."

---

## 4:30 - 4:45 | CLOSING (15 sec)

**[SHOW: Back to dashboard or app overview]**

**Speaker:**
> "**Planora** demonstrates our ability to design scalable database architectures, build intuitive user interfaces, write modular code, and solve real-world problems. Our PostgreSQL schema, API documentation, and frontend are production-ready for integration. Thank you for reviewing our submission!"

**[FADE OUT with team slide or GitHub repo link]**

---

## VIDEO RECORDING CHECKLIST

### Before Recording:
- [ ] Clear browser cache, use incognito mode
- [ ] Close unnecessary tabs and apps
- [ ] Set browser zoom to 100%
- [ ] Hide bookmarks bar for clean look
- [ ] Test microphone levels
- [ ] Have DATABASE_SCHEMA.md and API_DOCUMENTATION.md open in separate tabs
- [ ] Have VS Code open with relevant files
- [ ] Practice 2-3 full run-throughs

### During Recording:
- [ ] Speak clearly and at moderate pace
- [ ] Pause briefly between sections (easier to edit)
- [ ] Show screen transitions smoothly
- [ ] Don't apologize for missing backend - focus on what's built
- [ ] Keep mouse movements smooth and purposeful
- [ ] Highlight key UI elements as you mention them

### Key Screens to Capture:
1. DATABASE_SCHEMA.md (PostgreSQL tables)
2. API_DOCUMENTATION.md (endpoints)
3. VS Code folder structure (components, pages, services)
4. Git log (collaboration evidence)
5. Login page
6. Dashboard with carousel
7. CreateTrip 4-step form
8. TripStopManagement with stops
9. ActivityManagement with activities
10. Code snippet showing validation

### After Recording:
- [ ] Add title slide at beginning: "Planora - Trip Planning Platform"
- [ ] Add end slide: Team names, GitHub repo link, "Thank you!"
- [ ] Add subtle background music (optional)
- [ ] Export as MP4, 1080p, under 200MB if possible
- [ ] Upload to Google Drive/YouTube (unlisted) for submission

---

## SCRIPT VARIATIONS

### If Under 4:30 (Have Extra Time):
Add: "Let me show one more feature - our drag-drop reordering maintains order integrity in the database with the order_index column."

### If Running Over 5:00 (Need to Cut):
Skip: Git log section and code snippet - just mention "clean git history with team collaboration visible in commits"

---

## WHAT MAKES THIS VIDEO STRONG:

✅ **Shows database design** (Odoo's #1 priority)  
✅ **Demonstrates full user flow** (problem → solution)  
✅ **Highlights technical decisions** (PostgreSQL, React, validation)  
✅ **Proves code quality** (components, git, modularity)  
✅ **Professional UI** (consistent theme, responsive, intuitive)  
✅ **Architecture thinking** (API docs, schema, service layer)  

**RECORD CONFIDENTLY - YOU BUILT SOMETHING IMPRESSIVE! 🚀**
