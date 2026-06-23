# VentureIQ — Institutional-Grade AI Startup Due Diligence Co-Pilot

**VentureIQ** is a full-stack, secure, institutional-grade due diligence terminal designed for venture capital analysts, angel networks, and startup accelerators to automate risk checks, run Cap Table dilution waterfalls, and conduct interactive co-pilot screenings.

Rather than manually parsing corporate registries, Cap Table coordinates, and financial reports, VentureIQ aggregates these profiles into an interactive co-pilot dashboard. Under the hood, an AI agent processes these models or falls back seamlessly to a local mathematical synthesis engine when offline.

---

## 🏗️ Architectural Topology

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
                                  ▼ (Atomic FS Writes)     ▼ (SDK API Call)
                  ┌────────────────────────────────┐ ┌────────────────────────┐
                  │    Persistent JSON Database    │ │   Google Gemini API    │
                  │   (Startups, Notes, Scenarios) │ │ (Report & Chat Agent)  │
                  └────────────────────────────────┘ └────────────────────────┘
```

- **Frontend client**: Built on **React** (v19) and **Vite** with customized **Vanilla CSS variables** supporting dynamic light and dark theme matrices, customized scrollbars, and fluid animations.
- **Interactive Graphics**: Utilizes code-based inline SVG radar sweeps, pulsing grid mesh systems, and hover-triggered 3D card perspective transformations—completely eliminating large static picture assets.
- **REST API server**: A secure **Express** gateway providing request logging, robust error-handling boundaries, and controllers for all portfolio calculations.
- **Persistent Database**: High-speed, transactional, file-based async **JSON storage** (`server/db.json`) utilizing **atomic write-staging** (writes to a temporary file before renaming) to completely eliminate corruption vectors.
- **AI Core Integration**: Connects with the **Google Generative AI SDK** (Gemini models) with a local rule-based synthesis compiler fallback that handles 100% of features offline if no API key is set.

---

## 🔌 API Gateway Interface

The backend server exposes the following endpoints (listening on port `5000` by default):

### User Account Endpoints
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user` | None | Retrieves user subscription details and remaining credit counts. |
| `POST` | `/api/user/upgrade` | None | Upgrades account to a Pro Analyst (sets credits to `Infinity`). |
| `POST` | `/api/user/reset` | None | Resets subscription status to Free Tier (limits credits to `1`). |

### Startup Registry Endpoints
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/startups` | None | Retrieves all analyzed startups saved in the database. |
| `POST` | `/api/startups` | `{ "name": "...", "websiteUrl": "..." }` | Initiates AI/synthesized due diligence scraper logs and persists the report. |
| `DELETE` | `/api/startups/:id` | None | Removes a startup report and all its associated comments and votes. |
| `GET` | `/api/startups/:id/signals` | None | Generates dynamic WHOIS, sentiment, and regulatory timeline logs. |

### Collaboration & Consensus Endpoints
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/startups/:id/comments` | None | Retrieves note feeds published by analysts for the startup. |
| `POST` | `/api/startups/:id/comments` | `{ "text": "...", "author": "..." }` | Adds a new comment note onto the collaboration board. |
| `DELETE` | `/api/startups/:id/comments/:commentId` | None | Deletes a specific comment card from the startup's thread. |
| `GET` | `/api/startups/:id/votes` | None | Gathers consensus voting stats (invest, watch, pass counts). |
| `POST` | `/api/startups/:id/vote` | `{ "voteType": "invest/watch/pass" }` | Registers or toggles a user vote, recalculating recommendations. |

### Cap Table & Chat Endpoints
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/deal-calculator/scenarios` | None | Retrieves all saved Cap Table scenarios. |
| `POST` | `/api/deal-calculator/scenarios` | `{ "name": "...", "preMoney": 20, ... }` | Saves a Cap Table slider scenario configuration. |
| `POST` | `/api/chat` | `{ "startupId": "...", "message": "...", "history": [...] }` | Interrogates the AI Co-pilot for specific metrics or stress-tests. |

---

## 🚀 Setting Up the Terminal

### 1. Pre-requisites
- **Node.js** v18.0.0 or higher.
- **npm** or standard node package managers.

### 2. Dependency Installation
Initialize the workspace modules for both the frontend client and the backend server:
```bash
# Install root orchestration modules
npm install

# Install server endpoint modules
cd server
npm install
cd ..
```

### 3. Environment Settings
Create a `.env` file in the root directory (matching the layout in `.env.example`):
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Offline Note**: If `GEMINI_API_KEY` is left blank, VentureIQ automatically routes all report queries and co-pilot chats through the rule-based local compiler.

### 4. Running the Application
Start both the React web application and Express server concurrently:
```bash
npm run dev
```
- **Vite Web Client**: Runs at `http://localhost:5173`
- **Express Server**: Runs at `http://localhost:5000`

---

## 🔒 Reliability & Platform Safeguards

1. **Atomic DB Transactions**: Every modification to `server/db.json` is staged to a temporary `db.json.tmp` file and renamed atomically, preventing database truncation or parsing crashes if the Node process gets interrupted mid-write.
2. **Colored Console Logging**: The server console registers colorized, formatted summaries detailing paths, transaction status codes, and network latency response bounds:
   ```text
   [15:46:07] POST /api/startups -> 200 OK (22ms)
   [15:46:12] GET /api/user -> 200 OK (3ms)
   ```
3. **Route Boundaries**: Centralized error middleware intercepts syntax errors, bad JSON formatting, or missing file arguments, preventing runtime crashes.
4. **Theme Consistency**: Layout elements utilize native styling attributes that sync theme variables locally across reloads.
