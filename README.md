# VentureIQ — Smart Startup Due Diligence Co-Pilot

**VentureIQ** is an institutional-grade, full-stack web application designed to help venture capitalists, angel investors, and accelerators automate, store, and analyze startup due diligence.

Instead of parsing through endless spreadsheets, pitch decks, and filings, VentureIQ aggregates startup profiles, runs automated scraper signal checks, hosts dilution modeling simulators, and lets you interrogate a dedicated **AI Diligence Co-pilot** about specific business models, unit economics, or cash runway stress tests.

---

## 🏗️ Architecture Overview

VentureIQ is built as a modular full-stack application:

```text
                  ┌────────────────────────────────┐
                  │       Vite + React Client      │
                  │   (Terminal, Simulators, UI)   │
                  └───────────────┬────────────────┘
                                  │ (HTTP / JSON)
                                  ▼
                  ┌────────────────────────────────┐
                  │      Node.js + Express API     │
                  │   (Controllers, Chat Routing)  │
                  └───────────────┬────────────────┘
                                  ├────────────────────────┐
                                  ▼ (FS Read/Write)        ▼ (SDK API Call)
                  ┌────────────────────────────────┐ ┌────────────────────────┐
                  │    Persistent JSON Database    │ │   Google Gemini API    │
                  │   (Startups, Notes, Scenarios) │ │ (Report & Chat Agent)  │
                  └────────────────────────────────┘ └────────────────────────┘
```

- **Frontend**: **React** (v19) powered by **Vite** for fast, optimized hot reloads. Customized using a premium **Vanilla CSS** design system with native light/dark theme attributes and responsive typography layouts.
- **Backend**: **Node.js** with **Express** server acting as a REST API gateway. Serves endpoints for user authentication states, deal simulator scenarios, note threads, and live signal feeds.
- **Database**: Safe, lightweight, async file-based **JSON database** (`server/db.json`). Eliminates platform-dependent native compiler issues on Windows/Linux environments while supporting transactional updates, consensus recalculations, and note deletion cycles.
- **AI Integrations**: Native SDK integration with **Google Generative AI** (Gemini models). Supports a seamless, local rule-based synthesis engine fallback when no API key is supplied, assuring 100% features work offline.

---

## 🚀 Key Full-Stack Capabilities

### 1. 🔍 Dynamic Scrape & Diligence Generation
Submit any startup name and optional URL. The backend runs validation checks, generates a due diligence report containing overall/segmented grade matrices (Team, Market, Product, Finances, Risks), drafts a formal VC investment memo, and persists the record to the database.

### 2. 💬 Conversational AI Due Diligence Co-pilot
Chat directly with the AI co-pilot inside the startup details page. Ask targeted questions (*"What is their customer churn rate?"*, *"What happens if their monthly cash burn doubles?"*) or launch stress-testing prompts from the quick actions sidebar.

### 3. 👥 Consensus voting & Collaboration board
- **Analyst Note Boards**: Analysts can publish, review, and delete notes or checklists on a startup due diligence page, saving logs instantly to the database.
- **Consensus Rating**: Cast thumbs-up/down (Invest / Watch / Pass) votes. The backend automatically averages all votes to dynamically shift the Consensus Recommendation badge.

### 4. 📈 Cap Table Preset Manager
Simulate option pool dilutions, liquidation multipliers (1x/2x), and participation payouts (Double Dipping). Save calculator slider coordinates under custom preset names (e.g. *Series A Flat Round*) to recall them later.

### 5. 📡 Live Scraper Signals timeline
Monitors real-time alerts including WHOIS database extensions, social engineering mentions, and IP trademark filings using a connected timeline feed.

---

## 📂 Project Structure

```text
├── server/                     # Backend Source Code
│   ├── db.json                 # Persistent database storage
│   ├── db.js                   # Async Database CRUD managers
│   ├── index.js                # Express Server controllers & AI Router
│   └── package.json            # Node backend dependencies
│
├── src/                        # Frontend React Application
│   ├── components/
│   │   ├── Dashboard.jsx       # Deal flow listings and general metrics
│   │   ├── DealCalculator.jsx  # Cap table simulator & scenario presets
│   │   ├── StartupDetail.jsx   # Tabbed view: chatbot, notes, signals
│   │   ├── NewAnalysisForm.jsx # Scraper wizard with parallel API hooks
│   │   └── LandingPage.jsx     # Institutional landing homepage
│   │
│   ├── utils/
│   │   └── reportGenerator.js  # Core mathematical Synthesis logic
│   │
│   ├── App.jsx                 # Main state coordinator & router
│   ├── index.css               # Core theme tokens (Dark & Light variables)
│   └── main.jsx                # React DOM mount point
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Installation
Install root modules (including concurrently) and server dependencies:

```bash
# In the root workspace
npm install

# Inside the server directory
cd server
npm install
cd ..
```

### 3. Configure Environment Variables
Create a `.env` file in the root workspace (you can copy `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and configure:
```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
```
> **Note**: If `GEMINI_API_KEY` is left blank, the application will automatically activate the local rules-based compiler fallback.

### 4. Running the Application
Launch both the Vite client and the Express backend simultaneously with a single command:

```bash
npm run dev
```

- **Frontend client** runs on: `http://localhost:5173`
- **Backend API server** runs on: `http://localhost:5000`

---

## 🔌 API Documentation

### User Routes
- `GET /api/user` — Returns current credit capacity and subscription type (Free vs Pro).
- `POST /api/user/upgrade` — Upgrades the user account to a Pro Analyst (Sets credits to `Infinity`).
- `POST /api/user/reset` — Resets the account status to Free (1 credit).

### Startup Analysis Routes
- `GET /api/startups` — Lists all analyzed startups.
- `POST /api/startups` — Runs AI diligence (Gemini or local synthesis) and persists the report.
- `DELETE /api/startups/:id` — Deletes a startup report and all its linked comments/votes.
- `GET /api/startups/:id/signals` — Fetches real-time web signal timeline logs.

### Collaboration & Voting Routes
- `GET /api/startups/:id/comments` — Gets discussion notes.
- `POST /api/startups/:id/comments` — Adds a new note.
- `DELETE /api/startups/:id/comments/:commentId` — Deletes a note.
- `GET /api/startups/:id/votes` — Returns consensus vote tallies.
- `POST /api/startups/:id/vote` — Registers or toggles a user vote (`invest`, `watch`, `pass`).

### Deal Calculator Routes
- `GET /api/deal-calculator/scenarios` — Returns all saved cap table presets.
- `POST /api/deal-calculator/scenarios` — Saves current slider settings.

### Chat Router
- `POST /api/chat` — Feeds current message, conversation history, and startup ID to the AI Diligence agent. Returns conversational analytical replies.
