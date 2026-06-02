# Maple Project Changelog

All significant changes, creations, and modifications to the Maple Places Tracker app are documented here. This file serves as a learning log and development history.

---

## Session 1 — Initial Setup & Server Scaffolding

### Date
June 2, 2026

### Changes Made

#### 1. **Project Initialization**
- **File**: `package.json`
- **Action**: Created with npm init
- **Details**: 
  - Set `main` field to `index.js`
  - Added stack dependencies: `express`, `ejs`, `pg`, `dotenv`
  - Added dev dependency: `nodemon` (for hot-reloading during development)
  - Added scripts: `start` (runs index.js) and `dev` (runs with nodemon)
  
**Why this matters**: The package.json tells Node what libraries your project needs. Nodemon is especially useful during development because it auto-restarts the server every time you save a file — no manual restart needed.

#### 2. **Main Server File**
- **File**: `index.js`
- **Action**: Created
- **Key Code**:

```javascript
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse forms and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes (basic stubs)
app.get('/', (req, res) => { /* ... */ });
app.get('/to-go', (req, res) => { /* ... */ });
app.get('/visited', (req, res) => { /* ... */ });

// API stubs
app.get('/api/search', (req, res) => { /* ... */ });
app.post('/places', (req, res) => { /* ... */ });

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

**What this does**:
- **`require('dotenv').config()`** — loads environment variables from `.env` file (passwords, secrets, etc. stay private)
- **Express middleware** — `urlencoded` and `json` let you read form data and JSON from incoming requests
- **Static files** — everything in the `public/` folder (CSS, images, client-side JS) is served automatically
- **EJS view engine** — when you call `res.render('index')`, Express looks for `views/index.ejs`, fills in data, and sends HTML to the browser
- **Routes** — stubs for the three main pages (Find, Places to Go, Visited) and two API endpoints (search proxy, save place)
- **Stubs matter**: I intentionally created placeholder responses so you can see the structure. Later you'll replace these with actual database calls and template rendering.

**Why structured this way**: This follows Express best practices—middleware first, then routes, then the listener. It's readable and scalable.

#### 3. **Package Scripts**
- **File**: `package.json`
- **Action**: Added two convenience scripts
- **Details**:
  - `npm start` → runs `node index.js`
  - `npm run dev` → runs `nodemon index.js`

**Why this matters**: 
- `npm start` is the standard way to launch production apps
- `npm run dev` is your development workflow — nodemon watches your files and auto-restarts on save, so you don't manually stop/start the server 100 times

---

## Session 2 — GitHub Setup & Push

### Date
June 2, 2026

### Changes Made

#### 1. **GitHub Remote Configuration**
- **Action**: Added remote origin and pushed to GitHub
- **Commands**:
  ```bash
  git remote add origin https://github.com/Rovi-dev/Maple.git
  git branch -M main
  git pull origin main --allow-unrelated-histories
  git push -u origin main
  ```

**What happened**:
- GitHub already had a `README.md` (likely generated when you created the repo)
- Conflict resolution: merged both README descriptions
- Local repo is now connected to remote; all commits are pushed

#### 2. **README.md Update**
- **File**: `README.md`
- **Action**: Merged GitHub-generated description with local setup info
- **New content**:

```markdown
# Maple

A personal places tracker web app. Search for locations in the UK on an interactive map, save them, and organize them into **Places to Go** and **Visited** lists.

## About
Built with Node.js, Express, EJS, PostgreSQL, and Leaflet. This project teaches full-stack web development from database to browser.

## Getting Started
npm install
npm run dev
```

**Why this matters**:
- **Quick onboarding** — Anyone cloning the repo knows what it is and how to start
- **Professional presentation** — GitHub README is the first thing visitors see

**Key Concept - Git Conflicts**:
When two branches have different changes to the same line, git can't auto-merge. You have to manually pick which version to keep (or combine them). Always read both sides and make a conscious choice.

---

## Session 3 — Project Folder Structure Setup

### Date
June 2, 2026

### Changes Made

#### 1. **Created Directory Structure**
- **Directories created**:
  ```
  Maple/
  ├── views/
  │   └── partials/
  ├── public/
  │   ├── css/
  │   └── js/
  ```

**Why this structure?**
- `views/` — EJS templates (server renders HTML here)
- `views/partials/` — reusable template fragments (header, footer, nav)
- `public/` — static files served directly to browser (CSS, client-side JS, images)
- `public/css/` — stylesheets
- `public/js/` — browser-side JavaScript (map interaction, search, form handling)

**Git tracking**: Added `.gitkeep` files in each directory so git tracks empty folders (git normally ignores empty directories).

**What you'll create**:
- `views/partials/header.ejs` — HTML `<head>` + navigation
- `views/partials/footer.ejs` — closing tags
- `views/index.ejs` — Find page (map + search)
- `views/list.ejs` — Places to Go & Visited pages (reused with different data)
- `public/css/style.css` — all styling
- `public/js/map.js` — search + save logic
- `public/js/list-map.js` — plots pins on list pages

---

## Key Concepts - File Organization

1. **MVC-ish Pattern** (Model-View-Controller-inspired):
   - `index.js` = Controller (routes, logic)
   - `views/` = View (HTML templates)
   - `db.js` (coming next) = Model (data layer)

2. **Public vs. Views**:
   - `/public` is served as-is to the browser (CSS, images, JS files)
   - `/views` are templates that Node processes on the server, then sends HTML

3. **Express static serving**:
   ```javascript
   app.use(express.static('public'));
   // Now the browser can fetch /css/style.css directly
   ```

---



- [ ] Create `.env` file with database credentials
- [ ] Create `db.js` to connect to PostgreSQL
- [ ] Build out the view templates (`views/index.ejs`, `views/list.ejs`, `views/partials/`)
- [ ] Implement database queries in each route
- [ ] Build browser-side JavaScript for map and search (`public/js/map.js`, `public/js/list-map.js`)
- [ ] Add CSS styling (`public/css/style.css`)

---

## Session 4 — Tailwind & Bootstrap Installation

### Date
June 2, 2026

### Changes Made

#### 1. **Installed CSS Frameworks**
- **Packages installed**: `tailwindcss`, `postcss`, `autoprefixer`, `bootstrap`

**Why these?**
- **Tailwind CSS** — utility-first CSS framework. Use classes like `flex`, `justify-center`, `bg-blue-500` instead of writing custom CSS
- **PostCSS** — CSS processor that handles Tailwind directives
- **Autoprefixer** — adds browser prefixes (`-webkit-`, `-moz-`) automatically
- **Bootstrap** — optional, included but you'll mainly use Tailwind

#### 2. **Configuration Files Created**

**`tailwind.config.js`**:
```javascript
module.exports = {
  content: [
    './views/**/*.ejs',    // scan EJS templates
    './public/**/*.html',  // scan HTML files
  ],
  theme: {
    extend: {},            // customize theme here
  },
  plugins: [],
}
```

**Why**: Tells Tailwind where your code is, so it only includes CSS you actually use (keeps bundle small).

**`postcss.config.js`**:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 3. **CSS Input File**
- **`public/css/input.css`** — Tailwind directives:
  ```css
  @tailwind base;       /* reset browser defaults */
  @tailwind components; /* pre-built components */
  @tailwind utilities;  /* utility classes (most used) */
  ```

#### 4. **NPM Scripts Updated**
```json
"build:css": "npx tailwindcss -i ./public/css/input.css -o ./public/css/style.css",
"watch:css": "npx tailwindcss -i ./public/css/input.css -o ./public/css/style.css --watch"
```

- `npm run build:css` — one-time compile
- `npm run watch:css` — auto-recompile on file save

---

## How to Use Tailwind in Your Templates

**Option A: Build Process (Recommended)**
```bash
npm run watch:css    # terminal 1: auto-compiles CSS when you save input.css
npm run dev          # terminal 2: runs Express server
```

**Option B: CDN (Simpler for now)**
In your EJS templates, add this in the `<head>`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```
No build process needed — Tailwind loads from CDN. Great for rapid prototyping!

**Example Tailwind usage**:
```html
<div class="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
  <button class="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg transition">
    Save Place
  </button>
</div>
```

---

## Key Tailwind Concepts

1. **Utility-first**: Classes are your CSS
   - `flex` — `display: flex`
   - `justify-center` — `justify-content: center`
   - `bg-blue-500` — `background-color: #3b82f6`

2. **Responsive**: Add breakpoints
   - `md:text-lg` — only on medium+ screens
   - `lg:flex` — flex layout on large+ screens

3. **Hover/Focus states**: built-in
   - `hover:bg-blue-600` — on hover
   - `focus:ring-2` — on focus

4. **Dark mode**: prefix classes
   - `dark:bg-gray-900` — in dark mode

5. **Customization**: in `tailwind.config.js`
   ```javascript
   theme: {
     extend: {
       colors: { brand: '#ff6b35' }
     }
   }
   ```
   Then use: `<div class="bg-brand">`

---

---

## Session 5 — Header & Footer Partials

### Date
June 2, 2026

### Changes Made

#### 1. **Created `views/partials/head.ejs`**

This is the opening part of every page template. It includes:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><%= typeof title !== 'undefined' ? title : 'Maple - Places Tracker' %></title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Bootstrap CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />

  <!-- Leaflet (map library) -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <!-- Navigation Bar (Tailwind) -->
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-blue-600">📍 Maple</a>
      <div class="flex gap-6">
        <a href="/">Find</a>
        <a href="/to-go">Places to Go</a>
        <a href="/visited">Visited</a>
      </div>
    </div>
  </nav>
  <main class="max-w-6xl mx-auto px-4 py-8">
```

**What's included:**
- **Meta tags** — charset, viewport (mobile responsive), page title
- **Tailwind CDN** — utility CSS for styling
- **Bootstrap CSS & JS** — component library (modals, buttons, dropdowns)
- **Leaflet** — interactive map library (CSS + JS)
- **Navigation bar** — styled with Tailwind, links to all 3 pages
- **Main container** — `max-w-6xl` limits width, `mx-auto` centers it, `px-4 py-8` adds padding

**EJS dynamic title**:
```ejs
<title><%= typeof title !== 'undefined' ? title : 'Maple - Places Tracker' %></title>
```
This checks if a `title` variable was passed from the route. If yes, use it; if no, use default "Maple - Places Tracker".

#### 2. **Created `views/partials/footer.ejs`**

```html
  </main>

  <!-- Bootstrap JS (for interactive components) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**What it does:**
- Closes the `<main>` tag opened in head
- Loads Bootstrap JavaScript (needed for dropdowns, modals, etc.)
- Closes `</body>` and `</html>` tags

---

## How to Use These Partials

In any view template, you include them like this:

```ejs
<%- include('partials/head') %>

<!-- Your page content here -->
<h1>My Page</h1>
<p>Content goes here</p>

<%- include('partials/footer') %>
```

The `<%- include(...) %>` syntax:
- `<%-` (not `<%=`) means "insert raw HTML" without escaping
- This pulls in head.ejs, renders it, and inserts the HTML

**Note on title**: When you call `res.render()`, pass the title:
```javascript
res.render('index', { title: 'Find Places' });
```
Then in the template, it shows up as "Find Places" in the browser tab.

---

## Key CSS Concepts Used in head.ejs

**Tailwind utility classes**:
- `bg-white` — white background
- `shadow-sm` — subtle shadow
- `sticky top-0 z-50` — sticks to top of page, always on top
- `max-w-6xl mx-auto` — max width, centered
- `px-4 py-8` — horizontal padding 4 units, vertical padding 8 units
- `flex justify-between items-center` — flexbox, space-between content, vertically centered
- `gap-6` — 6 units of gap between flex items
- `text-2xl font-bold text-blue-600` — size, weight, color

**Why CDN vs Build?**
- **CDN** (current setup) — fastest to start, no build process, great for development
- **Build process** — smaller file size for production, better tree-shaking

For now, CDN is perfect.

---

---

## Session 6 — Find Page (index.ejs) with Search & Map UI

### Date
June 2, 2026

### Changes Made

#### 1. **Created `views/pages/` Folder Structure**
Updated file structure:
```
Maple/
├── views/
│   ├── partials/          (head.ejs, footer.ejs)
│   └── pages/             (NEW! for full page templates)
│       └── index.ejs      (Find page)
│       └── list.ejs       (to create)
```

**Why `pages/` subfolder?**
- Separates full pages from reusable partials
- Cleaner organization as app grows
- Common convention: `pages/` for full templates, `partials/` for fragments

#### 2. **Created `views/pages/index.ejs` (Find Page)**

Complete Find page with:

```html
<%- include('../partials/head') %>

<!-- Search Section -->
<h1 class="text-4xl font-bold">Find a Place</h1>
<p class="text-gray-600">Search for somewhere in the UK, click a result, and save it to your list.</p>

<!-- Search Bar -->
<div class="flex gap-3">
  <input type="text" id="search-input" placeholder="e.g. Incognito, Winchester" />
  <button id="search-btn">Search</button>
</div>

<!-- Search Results -->
<div id="results"></div>

<!-- Map -->
<div id="map" class="w-full h-96 rounded-lg border"></div>

<!-- Save Panel (hidden until a place is selected) -->
<div id="save-panel" class="hidden bg-white p-6 rounded-lg">
  <h3>Save this place</h3>
  <p id="selected-name"></p>
  
  <label>Category (optional)
    <input type="text" id="category-input" />
  </label>
  
  <label>Notes (optional)
    <textarea id="notes-input" rows="3"></textarea>
  </label>
  
  <button id="save-btn">Save to "Places to Go"</button>
  <p id="save-msg"></p>
</div>

<!-- JavaScript for search and map -->
<script src="/js/map.js"></script>

<%- include('../partials/footer') %>
```

**Key elements:**
- **Search input** — user types place name
- **Search button** — triggers API call to `/api/search`
- **Results div** — displays clickable search results
- **Map div** — `id="map"` with height `h-96` (Leaflet will render here)
- **Save panel** — hidden by default with `hidden` class, revealed when user clicks a result
- **Category/Notes inputs** — optional metadata for the place
- **Save button** — POSTs the place to `/places` API
- **Map script** — `<script src="/js/map.js">` loads client-side JavaScript later

**Tailwind classes used:**
- `text-4xl font-bold` — large heading
- `text-gray-600` — muted text
- `flex gap-3` — flexbox with 3-unit spacing
- `w-full h-96` — full width, 96px height
- `rounded-lg border` — border radius and border
- `hidden` — display: none (toggled by JS)
- `p-6` — padding all sides
- `px-4 py-2` — horizontal/vertical padding
- `focus:outline-none focus:ring-2 focus:ring-blue-500` — focus states

#### 3. **Updated Routes in `index.js`**

Changed from placeholder `res.send()` to `res.render()`:

```javascript
// Before (placeholder):
app.get('/', (req, res) => {
  res.send('<h1>Find Places — placeholder</h1>...');
});

// After (renders template):
app.get('/', (req, res) => {
  res.render('pages/index', { title: 'Find Places' });
});

// Same for /to-go and /visited:
app.get('/to-go', (req, res) => {
  res.render('pages/list', { title: 'Places to Go', places: [] });
});

app.get('/visited', (req, res) => {
  res.render('pages/list', { title: 'Visited', places: [] });
});
```

**What changed:**
- `'pages/index'` — path to template relative to `views/` folder
- `{ title: 'Find Places' }` — data passed to template (used in `<title>` tag)
- `places: []` — placeholder for list page (will be real data once DB is connected)

#### 4. **EJS Include Syntax Explained**

```ejs
<%- include('../partials/head') %>
```

Breaking it down:
- `<%- ... %>` — EJS tag that inserts raw HTML (no escaping)
- `include()` — EJS function to load another template
- `'../partials/head'` — relative path up one level to partials folder, loads head.ejs
- No need for `.ejs` extension — EJS adds it automatically

Similarly for footer:
```ejs
<%- include('../partials/footer') %>
```

This renders:
1. `head.ejs` — opens HTML, adds nav bar
2. Your page content (search, map, form)
3. `footer.ejs` — closes HTML tags, loads JS

---

## Test It Now!

```bash
npm run dev
```

Visit `http://localhost:3000` — you should see:
- Maple navigation bar (from head.ejs)
- Search bar and map placeholder
- Save panel (hidden)
- (Map won't work yet — needs JavaScript in `/public/js/map.js`)

---

---

## Session 7 — Major Pivot: Travel Planner & Cost Comparison Tool

### Date
June 2, 2026

### Changes Made

#### 1. **Project Vision Updated — From Places Tracker to Smart Travel Planner**

**Original concept**: Save places you want to visit, categorize them as "To Go" or "Visited".

**New concept**: A **cost comparison and travel planning tool** that helps users find the **cheapest way to travel** from their home to any UK destination.

**Example flow**:
- User sets home location: **Eastleigh, SO50 9EA**
- User wants to visit: **Lainston House Hotel, Winchester** (11 miles away)
- App calculates ALL travel options:
  - 🚗 **Car**: £1.50–£2.00 (fuel cost for 11 miles)
  - 🚂 **Train**: £12.50 (live Trainline API)
  - 🚌 **Bus**: £4.20 (TfL or National Express)
  - 🚕 **Uber**: £18.00 (Uber fare estimate API)
  - 🏆 **Cheapest**: Bus (£4.20)

#### 2. **Updated `Maple.md` Project Description**

**Old pages**:
- Find, Places to Go, Visited

**New pages**:
- **Setup/Home** (`/`) — Set home postcode once
- **Plan a Trip** (`/plan`) — Search destination, see all travel costs
- **My Trips** (`/trips`) — saved trip plans with cost comparisons
- **Trip History** (`/history`) — completed trips for reference

#### 3. **New Technology Stack Added**

Expanded from basic places tracker to comprehensive travel planner:

**APIs integrated**:
- **Google Maps Distance Matrix** — precise distance & car duration
- **Trainline API** — live UK train prices and schedules
- **TfL & Bus APIs** — bus routes and fares
- **Uber API** — ride-sharing fare estimates
- **Nominatim** — location search (already had)
- **OpenWeather** (optional) — weather along route

**Why these APIs?**
- **Google Maps**: Accurate distances and driving times for fuel cost calculation
- **Trainline**: Most UK rail tickets booked here; provides live pricing
- **TfL/Bus APIs**: Public transport data for cost and duration
- **Uber**: Real-time ride-sharing prices
- **Nominatim**: Free UK location search (no API key needed)

#### 4. **Database Schema Evolution**

**Old schema**: Simple places table with status (want/visited)

**New schema will include**:
```sql
-- User profile (home location set once)
users:
  - id, email, home_postcode, home_lat, home_lon, created_at

-- Trip plans
trips:
  - id, user_id, destination, dest_lat, dest_lon, distance_miles
  - status (planned/completed/cancelled)
  - created_at, completed_at

-- Trip costs (snapshot of all options at booking time)
trip_costs:
  - id, trip_id
  - car_fuel_cost, train_cost, train_duration, train_provider
  - bus_cost, bus_duration, bus_provider
  - uber_cost, uber_duration
  - cheapest_option, cheapest_cost
  - created_at (time costs were calculated)
```

**Why a snapshot?** Prices change constantly. We capture all options at planning time so the user can reference "when I planned this, bus was cheapest at £4.20".

#### 5. **Key Learning: API Orchestration**

This project teaches **backend API orchestration** — a real-world skill:

```javascript
// When user plans a trip:
1. Geocode destination (Nominatim)
2. Calculate distance (Google Maps Distance Matrix)
3. Estimate fuel cost (distance × £0.14/mile)
4. Fetch train prices (Trainline)
5. Fetch bus routes (TfL)
6. Estimate Uber fare (Uber API)
7. Compare all & return cheapest
8. Save all options to database for reference
```

This is **exactly** what real travel/logistics apps do (Google Flights, Skyscanner, Wanderu).

---

## Architecture Overview

```
┌─────────────────┐
│   Browser (UI)  │
│  - Home setup   │
│  - Trip search  │
│  - Cost display │
└────────┬────────┘
         │ HTTPS requests
         ↓
┌─────────────────────────────────────┐
│  Express Server (Orchestration)     │
│                                     │
│  Route: /api/plan                   │
│  ├─ Call Nominatim → destination   │
│  ├─ Call Google Maps → distance     │
│  ├─ Call Trainline → train prices   │
│  ├─ Call TfL/Bus → bus options      │
│  ├─ Call Uber → ride estimate       │
│  ├─ Calculate fuel cost             │
│  └─ Return all options ranked       │
└────────┬────────────────────────────┘
         │
         ├─→ Nominatim (free)
         ├─→ Google Maps API (paid, ~$5/1000)
         ├─→ Trainline (free or subscription)
         ├─→ TfL API (free)
         ├─→ Uber API (free tier)
         └─→ PostgreSQL (user data & trip history)
```

---

## Implementation Phases

**Phase 1 (Current)**: Core structure
- [ ] Home location setup (store in DB)
- [ ] Trip search with Nominatim
- [ ] UI for trip planner

**Phase 2**: Cost calculations
- [ ] Google Maps Distance Matrix integration
- [ ] Fuel cost estimation (distance × rate)
- [ ] Trainline API integration
- [ ] TfL/Bus API integration
- [ ] Uber fare estimation

**Phase 3**: User features
- [ ] Save trip plans
- [ ] Trip history & analytics
- [ ] Favorite routes
- [ ] Fare price alerts (notify when train prices drop)

**Phase 4**: Production
- [ ] User authentication (sign up / login)
- [ ] Mobile app (React Native or PWA)
- [ ] Real-time notifications
- [ ] Integration with booking platforms

---

## Key Concepts Introduced

1. **API Orchestration** — backend calls multiple APIs and combines results
2. **Cost Snapshots** — store prices at time of planning (not live, for reference)
3. **Multi-modal Routing** — showing all transportation options (car, train, bus, ride)
4. **Geolocation** — storing user home location for repeated use
5. **Third-party Integrations** — real-world experience working with external APIs

---

## Next Session

- [ ] Update index.ejs to be home setup (postcode input)
- [ ] Create pages/list.ejs for trip results/history
- [ ] Build plan page with multi-modal display
- [ ] Start API integration (Nominatim, then Google Maps)

---

## Session 8 — Head/Header Separation & Comprehensive API Configuration

### Date
June 2, 2026

### Changes Made

#### 1. **Refactored Head/Header Structure**

**Problem**: Navigation bar was mixed with HTML styling in `head.ejs`.

**Solution**: Separated into two files:

**`views/partials/head.ejs`** (styling only):
- DOCTYPE, meta tags, title
- Tailwind, Bootstrap, Leaflet stylesheets
- Opens `<body>` tag
- NO CONTENT

**`views/partials/header.ejs`** (navigation):
- Updated nav bar with new routes: Home, Plan Trip, My Trips, History
- Main container wrapper
- Emoji icon changed to ✈️ (matches travel planner theme)

**Why separate?**
- **Semantic clarity** — head = styling, header = content
- **Flexibility** — future pages can have different headers
- **Reusability** — change header without touching styling

**Usage in templates**:
```ejs
<%- include('../partials/head') %>
<%- include('../partials/header') %>
  <!-- Your page content -->
<%- include('../partials/footer') %>
```

#### 2. **Created Comprehensive API Configuration File**

**New file**: `config/apis.js` — centralized API reference with affiliate links

**13+ FREE APIs included**:

```javascript
// MAPPING & DISTANCE
NOMINATIM: Free location search (no key needed)
GOOGLE_MAPS_DISTANCE: 25,000 requests/day free tier

// TRAIN
TRAINLINE: Live UK train prices + affiliate program
NATIONAL_RAIL: Alternative rail data

// BUS & PUBLIC TRANSPORT
TFL_API: London/major cities buses
NATIONAL_EXPRESS: UK coaches + affiliate
GO_AHEAD: UK bus operator
STAGECOACH: Major UK bus routes

// RIDE-SHARING
UBER_API: Fare estimates + affiliate
BOLT: European ride-sharing

// FUEL & CAR
GLOBAL_PETROL_PRICES: Real-time fuel prices (100/month free)

// WEATHER (OPTIONAL)
OPENWEATHER: Weather forecasts (1000/day free)

// BOOKING & MONETIZATION
BOOKING_COM: 1-30% commission on hotels
HOTELS_COM: Hotel affiliate
EXPEDIA: Multi-travel affiliate
PARKWHIZ: Parking commission
```

**Structure of each API entry**:
```javascript
{
  name: 'API Name',
  description: 'What it does',
  free: true/false,
  freeTierLimit: 'e.g., 100 calls/day',
  setup: 'Sign-up URL',
  affiliate: 'Affiliate program link (if available)',
  affiliateDescription: 'Commission structure',
  docs: 'API documentation URL',
}
```

#### 3. **Affiliate Revenue Model (Future Monetization)**

Built into `config/apis.js`:

```javascript
AFFILIATE_REVENUE_MODEL: {
  description: 'Earn commission when users book through Maple',
  streams: [
    '🚂 Train: 5-10% on Trainline bookings',
    '🚌 Bus: 5-8% on National Express',
    '🚕 Uber: Referral bonus per ride',
    '🏨 Hotel: 1-30% on Booking.com',
    '✈️ Flights: Expedia affiliate commission',
    '🅿️ Parking: ParkWhiz commission',
  ],
  example: 'User books £50 train → Maple earns £3-5',
}
```

**Revenue projection example**:
- 100 users/month
- Avg trip costs £40
- Avg commission 5%
- Monthly revenue: £200+

#### 4. **Implementation Phases Documented**

**Phase 1 (MVP - Current)**:
```javascript
apis: ['NOMINATIM', 'GOOGLE_MAPS_DISTANCE', 'TRAINLINE', 'TFL_API', 'UBER_API'],
affiliates: [],
timeframe: 'Weeks 1-4',
```

**Phase 2 (Monetization)**:
```javascript
apis: ['Phase 1 + GLOBAL_PETROL_PRICES, NATIONAL_EXPRESS, BOLT'],
affiliates: ['TRAINLINE', 'NATIONAL_EXPRESS', 'UBER', 'BOOKING_COM'],
timeframe: 'Weeks 5-8',
```

**Phase 3 (Full Features)**:
```javascript
apis: ['All Phase 2 + OPENWEATHER, PARKWHIZ'],
affiliates: ['All Phase 2 + HOTELS_COM, EXPEDIA'],
timeframe: 'Weeks 9+',
```

#### 5. **Updated `pages/index.ejs`**

- Added `<%- include('../partials/header') %>` after head
- Updated heading: "Plan Your Trip"
- Updated description: "Compare ALL travel options and costs"
- Matches new travel planner vision

---

## File Structure Update

```
Maple/
├── views/
│   ├── partials/
│   │   ├── head.ejs         ← styling only (meta, scripts, stylesheets)
│   │   ├── header.ejs       ← navigation bar (NEW)
│   │   └── footer.ejs       ← closing tags
│   └── pages/
│       └── index.ejs        ← includes head + header
├── config/
│   └── apis.js              ← API config + affiliate links (NEW)
├── index.js
├── package.json
└── ...
```

---

## Key Concepts

1. **Semantic Separation** — head handles `<head>` styling, header handles navigation
2. **Configuration as Documentation** — `config/apis.js` teaches API integration while providing working reference
3. **Phased Implementation** — MVP doesn't need every API; add strategically as you scale
4. **Affiliate-First Thinking** — monetization planned from day 1 (best practice for SaaS)
5. **Free Tier Optimization** — all Phase 1 APIs have generous free tiers (costs $0 to start)

---

## Next Session

- [ ] Create `pages/plan.ejs` (trip search & cost display)
- [ ] Create `pages/trips.ejs` and `pages/history.ejs`
- [ ] Implement `/api/calculate-costs` endpoint
- [ ] Start Google Maps Distance Matrix integration
- [ ] Build cost calculation engine (fuel, duration estimation)
- [ ] Create `.env` file with API keys structure

---








- [ ] Update `.gitignore` to exclude secrets and dependencies

---

## Key Takeaways So Far

1. **Git workflow**: local changes → stage → commit → push to remote
2. **Merge conflicts** — not scary, just manual decisions
3. **Branch naming** — `master` → `main` is now GitHub's default
4. **Remote tracking** — `git push -u origin main` links your local branch to the remote

