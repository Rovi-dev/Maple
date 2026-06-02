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

## Next Steps (Not Yet Implemented)

- [ ] Create `.env` file with database credentials
- [ ] Create `db.js` to connect to PostgreSQL
- [ ] Build out the view templates (`views/index.ejs`, `views/list.ejs`, `views/partials/`)
- [ ] Implement database queries in each route
- [ ] Build browser-side JavaScript for map and search (`public/js/map.js`, `public/js/list-map.js`)
- [ ] Add CSS styling (`public/css/style.css`)
- [ ] Create `.gitignore` to exclude secrets and dependencies

---

## Key Takeaways for This Session

1. **Middleware order matters** — express middleware runs top-to-bottom, so put `.static()` before routes
2. **Stubs first** — start with placeholder responses to test the server works, then fill in real logic
3. **Environment variables** — never hardcode passwords; use `.env` and `dotenv`
4. **Express is a router** — think of routes as "if the user visits this URL, run this code"
5. **EJS templating** — server renders HTML with data before sending to browser (unlike pure API + frontend JS approach)

