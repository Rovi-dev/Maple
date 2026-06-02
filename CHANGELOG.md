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

## Next Session

- [ ] Create view templates with Tailwind classes
- [ ] Choose CDN vs Build process
- [ ] Create `.env` file
- [ ] Create `db.js` for PostgreSQL connection

---
- [ ] Update `.gitignore` to exclude secrets and dependencies

---

## Key Takeaways So Far

1. **Git workflow**: local changes → stage → commit → push to remote
2. **Merge conflicts** — not scary, just manual decisions
3. **Branch naming** — `master` → `main` is now GitHub's default
4. **Remote tracking** — `git push -u origin main` links your local branch to the remote

