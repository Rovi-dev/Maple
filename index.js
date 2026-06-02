// index.js — main entry for Maple
// Sets up Express, basic routes, and starts the server on localhost

require('dotenv').config(); // load environment variables from .env (if present)
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming request bodies (forms and JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from the `public` folder (CSS, client JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup (we installed EJS). You can add EJS templates later in `views/`.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ------------------ Page routes ------------------

// Home / Find page
app.get('/', (req, res) => {
  // TODO: replace with `res.render('index')` after creating `views/index.ejs`
  res.send('<h1>Find Places — placeholder</h1><p>Create `views/index.ejs` to render the full page.</p>');
});

// Places to Go page
app.get('/to-go', (req, res) => {
  // TODO: replace with `res.render('list', { title: 'Places to Go', places: [] })`
  res.send('<h1>Places to Go — placeholder</h1>');
});

// Visited page
app.get('/visited', (req, res) => {
  // TODO: replace with `res.render('list', { title: 'Visited', places: [] })`
  res.send('<h1>Visited — placeholder</h1>');
});

// ------------------ Basic API placeholders ------------------
// These endpoints are included as stubs so front-end code can be wired up later.

// Search proxy (calls out to Nominatim in the future)
app.get('/api/search', (req, res) => {
  res.json({ ok: false, message: 'Search proxy not implemented yet' });
});

// Save a place (expects JSON body)
app.post('/places', (req, res) => {
  // Example: { name, address, latitude, longitude, category, notes }
  res.status(501).json({ ok: false, message: 'Save endpoint not implemented yet' });
});

// ------------------ Start server ------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
