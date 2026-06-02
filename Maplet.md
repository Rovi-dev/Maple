# Building Maplet — A Smart Travel Planner & Cost Comparison Tool

A comprehensive travel planning web app: set your home location (postcode), search for destinations across the UK, and get **real-time cost comparisons** for every viable travel option. Compare costs for car (fuel), train, bus, and ride-sharing (Uber) to make the best travel decision.

**Core Vision:** Users input their home location once. Then, whenever they plan a trip to anywhere in the UK, Maplet shows them:
- **Distance & estimated travel time**
- **Car:** estimated fuel cost + parking (if available)
- **Train:** live prices from Trainline API
- **Bus:** route options and fares
- **Ride-sharing:** Uber fare estimates
- **Overall cheapest option** highlighted

Save trips to revisit cost comparisons, mark as completed, build a travel history.

**Stack:** Node.js · Express · EJS · PostgreSQL · Leaflet (map) · Nominatim (location search) · Trainline API · TfL API · Uber API (fare estimates) · Google Maps Distance Matrix API

---

## Table of contents

1. [What you're building](#1-what-youre-building)
2. [How the pieces fit together](#2-how-the-pieces-fit-together)
3. [Required APIs and Data Sources](#3-required-apis-and-data-sources)
4. [Install the tools](#4-install-the-tools)
5. [Create the project](#5-create-the-project)
6. [Set up the database](#6-set-up-the-database)
7. [Connect Node to PostgreSQL](#7-connect-node-to-postgresql)
8. [The server (all the routes)](#8-the-server-all-the-routes)
9. [The page templates (EJS)](#9-the-page-templates-ejs)
10. [The map and search (browser JavaScript)](#10-the-map-and-search-browser-javascript)
11. [Travel Cost Calculation Engine](#11-travel-cost-calculation-engine)
12. [Styling](#12-styling)
13. [Run it](#13-run-it)
14. [Troubleshooting](#14-troubleshooting)
15. [Where to go next](#15-where-to-go-next)

---

## 1. What you're building

Four main pages:

- **Setup/Home** (`/`) — Set your home postcode (e.g., SO50 9EA for Eastleigh). This is stored and used as the starting point for all journeys.
- **Plan a Trip** (`/plan`) — Search for a destination in the UK, get a map view, and see **all travel options with costs**:
  - 🚗 **Car**: fuel cost estimate + optional parking
  - 🚂 **Train**: live Trainline prices
  - 🚌 **Bus**: operator, duration, cost
  - 🚕 **Uber**: estimated fare
  - Best option highlighted
- **My Trips** (`/trips`) — saved trip plans showing distance, travel options, and cheapest route. Mark trips as "completed".
- **Trip History** (`/history`) — completed and past trips for reference.

**The magic bit:** When a user searches for Lainston House Hotel in Winchester from Eastleigh (SO50 9EA), the app calculates:
- Distance: ~11 miles
- Fuel cost for a car: £1.50–£2.00
- Train cost: pulls live Trainline data
- Bus cost: pulls TfL or National Express data
- Uber estimate: calls Uber fare estimate API
- **Shows all options ranked by price**

---

## 2. How the pieces fit together

### User Journey

```
User sets home location (SO50 9EA)
       ↓
User searches destination (Lainston House, Winchester)
       ↓
Server:
  ├─ Nominatim: geocode destination → lat/lon
  ├─ Google Distance Matrix: get distance & duration (car)
  ├─ Trainline API: fetch live train prices & times
  ├─ TfL / Bus API: fetch bus routes & fares
  ├─ Uber API: estimate ride fare
  └─ Calculate fuel cost (distance × fuel efficiency)
       ↓
Browser displays:
  ├─ Map showing route
  ├─ Card for each option (car, train, bus, uber)
  ├─ Price, duration, and one-click booking/info link
  └─ "Cheapest" badge on best option
       ↓
User saves trip → stored in PostgreSQL with:
  ├─ Origin (postcode), destination, distance
  ├─ All cost options snapshot
  ├─ Status (planned/completed/cancelled)
  └─ Timestamp
```

### The Tech Stack

- **Node.js & Express** — server that orchestrates all API calls and serves pages
- **EJS** — HTML templates with dynamic data
- **PostgreSQL** — stores user profile (home location), saved trips, and history
- **Leaflet** — interactive map showing route on the browser
- **Nominatim** — free geocoding (postcode → coordinates)
- **Google Maps Distance Matrix API** — precise distances and car journey times
- **Trainline API** (or scraping) — live UK train prices
- **TfL & Bus APIs** — UK bus routes and fares
- **Uber API** — fare estimates for ride-sharing
- **Tailwind CSS** — modern UI

---

## 3. Required APIs and Data Sources

Before building, you'll need API keys for:

| API | Purpose | Cost | Sign Up |
|-----|---------|------|---------|
| **Google Maps Distance Matrix** | car distance, duration | ~$5/1000 calls | [Google Cloud Console](https://cloud.google.com/maps-platform) |
| **Trainline** | UK train prices | Free or subscription | [Trainline Developer](https://www.thetrainline.com) or scrape |
| **TfL Unified API** | London bus, tube fares | Free | [TfL Developer Portal](https://tfl.gov.uk/info-for-developers/) |
| **Uber** | ride fare estimates | Free tier available | [Uber API](https://developer.uber.com) |
| **Nominatim** | geocoding (postcode search) | Free | OpenStreetMap (no key needed) |
| **OpenWeather** (optional) | weather en route | Free tier | [OpenWeather](https://openweathermap.org/api) |

> **Tip:** Start with free APIs (Nominatim, TfL, basic Uber). Paid APIs can be added once MVP works.

---

## 4. Install the tools

You need three things installed: **Node.js**, **PostgreSQL**, and **VS Code**.

### 4a. Node.js

Go to <https://nodejs.org> and download the **LTS** version. Install it with all the default options.

You should see something like `psql (PostgreSQL) 17.x`. (On Windows, if `psql` isn't found, you can use the "SQL Shell (psql)" app the installer added to your Start menu instead.)

### 3c. VS Code

Download from <https://code.visualstudio.com>. Once installed, open it and add two helpful extensions (click the squares icon on the left sidebar, search, install):

- **EJS language support** — makes `.ejs` files readable with colour.
- **PostgreSQL** (by Chris Kolkman) or **SQLTools** — lets you peek at your database from inside VS Code. Optional but handy.

---

## 4. Create the project

### 4a. Make a folder and open it

Pick where you want the project to live, then in your terminal:

```bash
cd Desktop
mkdir places-app
cd places-app
code .
```

`cd` means "change directory". `mkdir` means "make directory". `code .` opens the current folder in VS Code (the `.` means "here").

From now on, you can use the terminal **inside VS Code** — open it with `Ctrl + ` ` (backtick) or via the menu: Terminal → New Terminal. It opens already pointed at your project folder.

### 4b. Start a Node project

In the VS Code terminal:

```bash
npm init -y
```

This creates a `package.json` file — a little record of your project and the libraries it uses. The `-y` says "yes to all the defaults".

### 4c. Install the libraries

```bash
npm install express ejs pg dotenv
```

What each one is:

- `express` — the web framework.
- `ejs` — the templating engine for your pages.
- `pg` — lets Node talk to PostgreSQL ("pg" = Postgres).
- `dotenv` — loads secret settings (like your database password) from a file, so they're not hard-coded.

Then, optionally, a development helper:

```bash
npm install --save-dev nodemon
```

`nodemon` restarts your server automatically every time you save a file, so you don't have to stop and start it by hand. Worth it.

### 4d. Set up the folder structure

Create these files and folders. You can make them in VS Code's file explorer (right-click → New File / New Folder), or run these terminal commands:

```bash
mkdir views
mkdir views/partials
mkdir public
mkdir public/css
mkdir public/js
```

By the end, your project will look like this:

```
places-app/
├── .env                  ← your secret settings (database password etc.)
├── .gitignore            ← tells git what to ignore
├── package.json          ← created by npm
├── db.js                 ← the database connection
├── server.js             ← the main app: all the routes
├── schema.sql            ← the SQL to create your table
├── views/
│   ├── partials/
│   │   ├── header.ejs    ← top of every page (nav bar)
│   │   └── footer.ejs    ← bottom of every page
│   ├── index.ejs         ← the Find page (map + search)
│   └── list.ejs          ← reused for "to go" and "visited"
└── public/
    ├── css/
    │   └── style.css     ← all the styling
    └── js/
        ├── map.js        ← search + save logic for the Find page
        └── list-map.js   ← plots saved pins on the list pages
```

Don't worry about creating the files yet — the next sections give you the contents of each one.

---

## 5. Set up the database

A database needs three things before your app can use it: the database itself, a user (login) to access it, and a table to hold your data.

### 5a. Open the Postgres command line

```bash
psql -U postgres
```

It'll ask for the password you set during installation. (On Mac with Postgres.app, you can often just run `psql` with no `-U postgres`.)

You'll get a prompt that looks like `postgres=#`. You're now talking to Postgres directly.

### 5b. Create the database and a user

Type these one at a time (keep the semicolons — they tell Postgres the command is finished). Replace `choose_a_password` with a real password you'll remember.

```sql
CREATE DATABASE places_db;
CREATE USER placesuser WITH PASSWORD 'choose_a_password';
GRANT ALL PRIVILEGES ON DATABASE places_db TO placesuser;
```

Now connect to your new database:

```sql
\c places_db
```

(`\c` means "connect". The prompt will change to `places_db=#`.)

Then give your user permission to create tables inside it. **This step is easy to forget and causes a confusing "permission denied" error later on Postgres 15 and newer, so don't skip it:**

```sql
GRANT ALL ON SCHEMA public TO placesuser;
```

### 5c. Create the table

You can paste this straight into psql (make sure you're still connected to `places_db`):

```sql
CREATE TABLE places (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT,
  latitude    DOUBLE PRECISION NOT NULL,
  longitude   DOUBLE PRECISION NOT NULL,
  category    TEXT,
  status      TEXT NOT NULL DEFAULT 'want' CHECK (status IN ('want', 'visited')),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Line by line, what this means:

- `id SERIAL PRIMARY KEY` — an automatic, ever-increasing ID number for each place. You never set it yourself; Postgres does.
- `name TEXT NOT NULL` — the place's name. `NOT NULL` means it can't be empty.
- `address TEXT` — the full address (optional, so no `NOT NULL`).
- `latitude` / `longitude DOUBLE PRECISION` — the map coordinates. `DOUBLE PRECISION` is a number with decimals.
- `category TEXT` — "bar", "restaurant", etc. Optional.
- `status TEXT ... DEFAULT 'want' CHECK (...)` — this is the heart of the app. It's either `'want'` or `'visited'`, nothing else (the `CHECK` enforces that), and new places default to `'want'`.
- `notes TEXT` — your own notes. Optional.
- `created_at TIMESTAMPTZ DEFAULT now()` — automatically records when you added the place.

> **Prefer a visual tool?** Instead of psql you can open **pgAdmin** (installed alongside Postgres on Windows) or a free app like **TablePlus** or **DBeaver**, connect using the same details, and paste the `CREATE TABLE` into a query window. Same result.

It's also worth saving that `CREATE TABLE` block into a file called `schema.sql` in your project, so you have a record of your database structure. Create `schema.sql` and paste the block in.

When you're done, leave psql by typing:

```sql
\q
```

---

## 6. Connect Node to PostgreSQL

### 6a. The `.env` file (your secret settings)

Create a file called **`.env`** in the root of your project (note the leading dot). Put your real password in place of `choose_a_password`:

```
DATABASE_URL=postgresql://placesuser:choose_a_password@localhost:5432/places_db
PORT=3000
```

That `DATABASE_URL` is your full database address, broken down as:

```
postgresql://[user]:[password]@[host]:[port]/[database name]
postgresql://placesuser:choose_a_password@localhost:5432/places_db
```

`localhost` means "this computer". `5432` is Postgres's default port.

### 6b. The `.gitignore` file

If you ever put this project on GitHub, you must **not** upload your `.env` (it has your password) or the huge `node_modules` folder. Create a file called **`.gitignore`**:

```
node_modules/
.env
```

### 6c. The database connection: `db.js`

Create **`db.js`**. This sets up a reusable connection to Postgres that the rest of your app shares (called a "connection pool").

```js
// db.js — sets up the connection to PostgreSQL
require('dotenv').config();          // load the settings from .env
const { Pool } = require('pg');      // the Postgres library

// A "pool" manages a set of connections so your app can run
// several queries efficiently without reconnecting each time.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export it so other files (like server.js) can use it.
module.exports = pool;
```

---

## 7. The server (all the routes)

This is the main file. Create **`server.js`** and paste the whole thing in. The explanation follows underneath.

```js
// server.js — the heart of the application
require('dotenv').config();           // load settings from .env
const express = require('express');   // the web framework
const pool = require('./db');         // our database connection (from db.js)

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware (runs on every request, before your routes) ---
app.set('view engine', 'ejs');                    // render pages with EJS
app.use(express.static('public'));                // serve files from /public (css, js)
app.use(express.urlencoded({ extended: true }));  // read data from HTML form submissions
app.use(express.json());                          // read JSON sent by fetch()

// ============ PAGE ROUTES ============

// Main page: the map where you search and save places
app.get('/', (req, res) => {
  res.render('index', { title: 'Find Places' });
});

// "Places to Go" page — shows places with status 'want'
app.get('/to-go', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM places WHERE status = 'want' ORDER BY created_at DESC"
    );
    res.render('list', {
      title: 'Places to Go',
      places: result.rows,
      status: 'want',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// "Visited" page — shows places with status 'visited'
app.get('/visited', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM places WHERE status = 'visited' ORDER BY created_at DESC"
    );
    res.render('list', {
      title: 'Places Visited',
      places: result.rows,
      status: 'visited',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// ============ API ROUTES (return data, not pages) ============

// Search proxy: the browser asks us, we ask Nominatim, we pass the answer back.
app.get('/api/search', async (req, res) => {
  const q = req.query.q;                 // the search text, e.g. "Incognito Winchester"
  if (!q) return res.json([]);           // nothing typed? return an empty list

  const url =
    'https://nominatim.openstreetmap.org/search' +
    '?format=json' +
    '&q=' + encodeURIComponent(q) +
    '&countrycodes=gb' +                 // only return results in the UK
    '&addressdetails=1' +
    '&limit=5';

  try {
    const response = await fetch(url, {
      headers: {
        // Nominatim asks every app to identify itself. Put your own app name/email here.
        'User-Agent': 'MyPlacesApp/1.0 (you@example.com)',
      },
    });
    const data = await response.json();
    res.json(data);                      // send the results back to the browser
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Save a new place (called by fetch() from the Find page)
app.post('/places', async (req, res) => {
  const { name, address, latitude, longitude, category, notes } = req.body;

  // Basic check that the essential bits are present
  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await pool.query(
      `INSERT INTO places (name, address, latitude, longitude, category, status, notes)
       VALUES ($1, $2, $3, $4, $5, 'want', $6)`,
      [name, address || null, latitude, longitude, category || null, notes || null]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save place' });
  }
});

// Change a place's status (want <-> visited). Called by a form on the list pages.
app.post('/places/:id/status', async (req, res) => {
  const { id } = req.params;             // the place's id, from the URL
  const { status } = req.body;           // the new status, from the form
  try {
    await pool.query('UPDATE places SET status = $1 WHERE id = $2', [status, id]);
    res.redirect(req.get('Referer') || '/');   // go back to the page they came from
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not update place');
  }
});

// Delete a place. Called by a form on the list pages.
app.post('/places/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM places WHERE id = $1', [id]);
    res.redirect(req.get('Referer') || '/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not delete place');
  }
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

### Understanding the key ideas here

**Routes** are the `app.get(...)` and `app.post(...)` lines. Each says "when a request comes in for this URL, run this function." `get` is for fetching/viewing; `post` is for sending data (saving, updating, deleting).

**`res.render('index', { ... })`** takes an EJS template (`views/index.ejs`) plus some data, and sends the finished HTML page to the browser.

**`res.json(...)`** sends raw data instead of a page — used by the API routes that the browser's JavaScript talks to.

**`async` / `await`** — talking to a database takes a moment. `await` means "wait for this to finish before moving on." Any route that uses `await` is marked `async`.

**Those `$1`, `$2` placeholders** in the SQL are important. You never glue user input directly into a query string. Instead you write `$1` and pass the real values in the array afterwards. Postgres then handles them safely. This protects you from a classic security hole called SQL injection. Get into this habit now.

**`:id` in a route** (like `/places/:id/delete`) is a placeholder for a value in the URL. If someone requests `/places/7/delete`, then `req.params.id` is `"7"`.

---

## 8. The page templates (EJS)

EJS files are HTML with two special tags:

- `<%= something %>` inserts a value (and safely escapes it).
- `<%- something %>` inserts raw HTML (used for including other templates).
- `<% ...code... %>` runs JavaScript like loops and `if` statements without printing anything.

### 8a. `views/partials/header.ejs`

The top of every page — the bit you don't want to rewrite three times. It opens the HTML document, loads Leaflet and your stylesheet, and draws the navigation bar.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><%= title %></title>

  <!-- Leaflet's stylesheet and script (the map library), loaded from a CDN -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- Your own stylesheet -->
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <nav class="nav">
    <a class="brand" href="/">📍 My Places</a>
    <div class="nav-links">
      <a href="/">Find</a>
      <a href="/to-go">Places to Go</a>
      <a href="/visited">Visited</a>
    </div>
  </nav>
  <main class="container">
```

(Notice it deliberately leaves `<main>` and `<body>` open — the footer partial closes them.)

### 8b. `views/partials/footer.ejs`

```html
  </main>
</body>
</html>
```

### 8c. `views/index.ejs` (the Find page)

```html
<%- include('partials/header') %>

<h1>Find a place</h1>
<p class="muted">Search for somewhere in the UK, click a result, then save it to your list.</p>

<div class="search-bar">
  <input type="text" id="search-input" placeholder="e.g. Incognito, Winchester" />
  <button id="search-btn">Search</button>
</div>

<div id="results" class="results"></div>

<div id="map"></div>

<!-- This panel stays hidden until you click a search result -->
<div id="save-panel" class="save-panel hidden">
  <h3>Save this place</h3>
  <p id="selected-name" class="selected-name"></p>

  <label>Category (optional)
    <input type="text" id="category-input" placeholder="bar, restaurant, hike..." />
  </label>

  <label>Notes (optional)
    <textarea id="notes-input" rows="2"></textarea>
  </label>

  <button id="save-btn">Save to “Places to Go”</button>
  <p id="save-msg" class="save-msg"></p>
</div>

<!-- The browser-side logic for this page -->
<script src="/js/map.js"></script>

<%- include('partials/footer') %>
```

### 8d. `views/list.ejs` (used for BOTH "to go" and "visited")

This one page is rendered with different data depending on which URL you visited. It shows a map of all the saved pins, then a grid of cards. Each card has buttons to change the status or delete.

```html
<%- include('partials/header') %>

<h1><%= title %></h1>

<% if (places.length === 0) { %>
  <p class="muted">Nothing here yet. <a href="/">Find some places</a> to add.</p>
<% } else { %>

  <div id="map"></div>

  <div class="card-grid">
    <% places.forEach(place => { %>
      <div class="card">
        <h3><%= place.name %></h3>
        <% if (place.category) { %><span class="tag"><%= place.category %></span><% } %>
        <p class="address"><%= place.address %></p>
        <% if (place.notes) { %><p class="notes"><%= place.notes %></p><% } %>

        <div class="card-actions">
          <% if (status === 'want') { %>
            <form action="/places/<%= place.id %>/status" method="POST">
              <input type="hidden" name="status" value="visited" />
              <button class="btn-small">Mark as visited</button>
            </form>
          <% } else { %>
            <form action="/places/<%= place.id %>/status" method="POST">
              <input type="hidden" name="status" value="want" />
              <button class="btn-small">Move back to “to go”</button>
            </form>
          <% } %>

          <form action="/places/<%= place.id %>/delete" method="POST"
                onsubmit="return confirm('Delete this place?');">
            <button class="btn-small btn-danger">Delete</button>
          </form>
        </div>
      </div>
    <% }); %>
  </div>

  <!-- Hand the saved places to the browser as data, then plot them -->
  <script>
    const places = <%- JSON.stringify(places) %>;
  </script>
  <script src="/js/list-map.js"></script>

<% } %>

<%- include('partials/footer') %>
```

How the data gets from the database to the page: your `/to-go` route ran a SQL query, got rows back, and passed them as `places` into `res.render`. The `<% places.forEach(...) %>` loop then builds one card per row. The `<% if (status === 'want') %>` check decides whether the button says "Mark as visited" or "Move back".

Those little `<form>` elements are the simplest possible way to send an action to the server: clicking the button POSTs to the route in `action`, and the hidden input carries the new status. The delete form has an `onsubmit` confirm so you can't delete by accident.

---

## 9. The map and search (browser JavaScript)

These two files run in the browser, not on your server. They live in `public/js/` so they're served to the page.

### 9a. `public/js/map.js` (Find page logic)

```js
// Create the map, centred roughly on the middle of the UK, zoomed out.
const map = L.map('map').setView([54.5, -3.0], 6);

// Add the actual map imagery (free OpenStreetMap tiles).
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

let currentMarker = null;   // the pin currently on the map
let selectedPlace = null;   // the place we'll save if you click Save

// Grab the page elements we need to work with
const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const resultsBox   = document.getElementById('results');
const savePanel    = document.getElementById('save-panel');
const selectedName = document.getElementById('selected-name');
const saveBtn      = document.getElementById('save-btn');
const saveMsg      = document.getElementById('save-msg');

// --- Searching ---
async function doSearch() {
  const q = searchInput.value.trim();
  if (!q) return;

  resultsBox.innerHTML = 'Searching…';

  try {
    // Ask OUR server, which forwards the request to Nominatim
    const res = await fetch('/api/search?q=' + encodeURIComponent(q));
    const places = await res.json();

    if (!places.length) {
      resultsBox.innerHTML = '<p class="muted">No results found.</p>';
      return;
    }

    // Show each result as a clickable button
    resultsBox.innerHTML = '';
    places.forEach(place => {
      const item = document.createElement('button');
      item.className = 'result-item';
      item.textContent = place.display_name;
      item.onclick = () => selectPlace(place);
      resultsBox.appendChild(item);
    });
  } catch (err) {
    resultsBox.innerHTML = '<p class="muted">Search failed. Try again.</p>';
  }
}

searchBtn.onclick = doSearch;
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();   // let Enter trigger a search too
});

// --- When you click a search result ---
function selectPlace(place) {
  const lat = parseFloat(place.lat);
  const lon = parseFloat(place.lon);

  // Move the map to the place and drop a pin
  map.setView([lat, lon], 16);
  if (currentMarker) map.removeLayer(currentMarker);  // remove the old pin first
  currentMarker = L.marker([lat, lon]).addTo(map);

  // Nominatim's display_name is long; use the first chunk as a short, friendly name
  const shortName = place.display_name.split(',')[0];

  selectedPlace = {
    name: shortName,
    address: place.display_name,
    latitude: lat,
    longitude: lon,
  };

  // Reveal the save panel
  selectedName.textContent = place.display_name;
  savePanel.classList.remove('hidden');
  saveMsg.textContent = '';
}

// --- When you click Save ---
saveBtn.onclick = async () => {
  if (!selectedPlace) return;

  const body = {
    ...selectedPlace,
    category: document.getElementById('category-input').value.trim(),
    notes: document.getElementById('notes-input').value.trim(),
  };

  try {
    const res = await fetch('/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      saveMsg.textContent = 'Saved! Check your “Places to Go” page.';
      saveMsg.style.color = 'green';
    } else {
      saveMsg.textContent = 'Could not save. Try again.';
      saveMsg.style.color = 'red';
    }
  } catch (err) {
    saveMsg.textContent = 'Could not save. Try again.';
    saveMsg.style.color = 'red';
  }
};
```

### 9b. `public/js/list-map.js` (plots saved pins on the list pages)

```js
// The list.ejs page already defined `places` just above this script.
const map = L.map('map').setView([54.5, -3.0], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

const bounds = [];

places.forEach(place => {
  const lat = parseFloat(place.latitude);
  const lon = parseFloat(place.longitude);
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup('<strong>' + place.name + '</strong>');  // click a pin to see its name
  bounds.push([lat, lon]);
});

// Automatically zoom the map so every pin is visible
if (bounds.length) {
  map.fitBounds(bounds, { padding: [40, 40] });
}
```

---

## 10. Styling

Create **`public/css/style.css`**. This keeps things clean and simple — white cards, one accent colour, plenty of breathing room. Change the colours at the top to taste.

```css
:root {
  --bg: #f7f8fa;
  --card: #ffffff;
  --line: #e3e6ea;
  --text: #1c2128;
  --muted: #6b7280;
  --accent: #2563eb;
  --danger: #dc2626;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

.nav {
  background: var(--card);
  border-bottom: 1px solid var(--line);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}
.brand { font-weight: 700; font-size: 18px; text-decoration: none; color: var(--text); }
.nav-links a {
  margin-left: 18px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 500;
}
.nav-links a:hover { color: var(--text); }

.container { max-width: 900px; margin: 0 auto; padding: 28px 24px 60px; }

h1 { font-size: 26px; margin-bottom: 6px; }
.muted { color: var(--muted); }

.search-bar { display: flex; gap: 8px; margin: 18px 0; }
.search-bar input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 15px;
}

button { cursor: pointer; font-size: 15px; font-family: inherit; }

.search-bar button,
#save-btn {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px 18px;
  font-weight: 600;
}

.results { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.result-item {
  text-align: left;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}
.result-item:hover { border-color: var(--accent); }

#map {
  height: 420px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--line);
  margin-bottom: 20px;
}

.save-panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
}
.save-panel.hidden { display: none; }
.save-panel label { display: block; margin: 12px 0 4px; font-size: 14px; font-weight: 500; }
.save-panel input,
.save-panel textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}
.selected-name { color: var(--muted); font-size: 14px; margin-top: 4px; }
.save-msg { margin-top: 10px; font-size: 14px; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
}
.card h3 { font-size: 17px; margin-bottom: 6px; }
.tag {
  display: inline-block;
  background: #eef2ff;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}
.address { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
.notes { font-size: 14px; margin-bottom: 12px; }
.card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.btn-small {
  background: #f3f4f6;
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
}
.btn-small:hover { background: #e5e7eb; }
.btn-danger { color: var(--danger); }
.btn-danger:hover { background: #fee2e2; }
```

---

## 11. Run it

### 11a. Add convenient start commands

Open `package.json` and find the `"scripts"` section. Replace it with:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 11b. Start the server

If you installed nodemon:

```bash
npm run dev
```

Otherwise:

```bash
npm start
```

You should see:

```
Server running at http://localhost:3000
```

### 11c. Open it

Go to **<http://localhost:3000>** in your browser. You should see the map of the UK and a search box. Try searching "Winchester", click a result, add a category, and save. Then visit the **Places to Go** page — your place should be there, listed and pinned on the map. Mark it visited and check the **Visited** page.

To stop the server, click in the terminal and press `Ctrl + C`.

---

## 12. Troubleshooting

**`password authentication failed for user "placesuser"`**
The password in your `.env` doesn't match the one you set in step 5b. Fix the `.env`, or reset the password in psql: `ALTER USER placesuser WITH PASSWORD 'newpassword';`

**`permission denied for schema public`** (or "permission denied for table places")
You skipped the schema grant. In psql, connect to the database (`\c places_db`) and run `GRANT ALL ON SCHEMA public TO placesuser;`. On older setups you may also need `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO placesuser;`

**`ECONNREFUSED` / "connection refused"**
PostgreSQL isn't running. On Mac, open Postgres.app and make sure it's started. On Windows, check that the PostgreSQL service is running (search "Services", find "postgresql", start it). Also confirm the port in your `.env` is `5432`.

**`Error: listen EADDRINUSE :::3000`**
Something is already using port 3000 — maybe an old copy of your server. Stop it (`Ctrl + C` in its terminal), or change `PORT=3000` to `PORT=3001` in your `.env`.

**The map area is blank / grey**
Usually one of: Leaflet's CSS didn't load (check the `<link>` in `header.ejs`), the `#map` div has no height (check the `#map { height: 420px }` rule is in your CSS), or you're offline (the map tiles load from the internet).

**`fetch is not defined`**
Your Node is older than version 18. Run `node --version`; if it's below 18, update Node from <https://nodejs.org>.

**Search returns nothing for a place you know exists**
Nominatim is restricted to the UK here (`countrycodes=gb`) and matches on names/addresses, not business categories perfectly. Try adding the town ("Incognito Winchester") or searching the street/area. Small venues sometimes aren't in OpenStreetMap at all.

**A note on Nominatim's fair-use rules:** it's free, but the public service asks for no more than ~1 request per second and that your app identify itself (that's the `User-Agent` you set). That's plenty for personal use. If you ever turn this into a busy public product, read their usage policy and consider a paid provider or running your own instance — don't hammer the free service.

---

## 13. Where to go next

Once the basics work, add features one at a time. Good next steps, roughly easiest first:

- **Filter the list pages by category** — add a dropdown that adds `?category=bar` to the URL, and adjust the SQL `WHERE` clause.
- **A star rating for visited places** — add a `rating` column (`INTEGER`) and a few star buttons on the card.
- **"Near me"** — use the browser's `navigator.geolocation` to centre the map on the user and show nearby saved places.
- **Click the map to add a place** — instead of only searching, let a click on the map drop a pin and open the save panel (Leaflet has a `map.on('click', ...)` event).
- **Trips / lists** — add a `trips` table and let a place belong to a trip, so you can group "Weekend in Winchester".
- **Edit a place** — an edit form that pre-fills the existing values and updates the row.
- **Accounts** — once you want this online for other people, add login (look at the `express-session` and `bcrypt` libraries). This is a bigger step; save it for when the rest is solid.

A sensible order overall: get it running exactly as written, use it for real for a week, then pick the one feature you keep wishing it had and build only that. Repeat. That's how a small project quietly becomes a good one.

Happy building.