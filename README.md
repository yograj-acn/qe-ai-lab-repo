# Breezewood Hotels — AI-Driven QE Lab Starter

A small local training app that simulates a Marriott-style hotel search and booking flow, used for the **AI-Driven Quality Engineering: Hands-On Lab** (see `AI-Driven_Quality_Engineering_Hands-On_Lab.md`).

## Requirements

- Node.js 20 LTS or later
- npm 10 or later

```bash
node --version
npm --version
```

## Install

```bash
npm ci
npx playwright install chromium
```

## Run the app

The app has three modes, used at different points in the lab. Each mode starts the server at `http://localhost:3000`.

| Mode | Command | Behavior |
|---|---|---|
| Baseline | `npm run start:baseline` | Search button reads "Search hotels". Booking confirms normally. |
| UI Change | `npm run start:ui-change` | Search button is renamed to "Find hotels". Booking confirms normally. |
| Booking Defect | `npm run start:booking-defect` | Search button reads "Search hotels". The reservation endpoint (`POST /api/book`) always returns HTTP 500, so booking confirmation fails. |

Keep the app running in one terminal. Open a second terminal to run the Playwright tests.

## Run the tests

```bash
npx playwright test
```

Generated test scripts live under `tests/`. The suite is empty until you generate `TC-001` and `TC-002` from `test_cases.xlsx` (see lab section 3).

## Seeded data

- **Property:** `BLR-001` — Breezewood Residency Bengaluru (city: `Bengaluru`)
- **Rooms:** Deluxe King Room (`RM-101`, ₹7,500/night), Executive Suite (`RM-102`, ₹11,200/night)
- **Seeded stay dates:** Check-in `2026-12-10`, Check-out `2026-12-12`
- **Synthetic guest:** Asha Rao, asha.rao@example.com, +91-9876543210

The room selection page is reachable directly at `rooms.html?propertyId=BLR-001`, which `TC-002` uses as its starting point.

## Stable test IDs

Every interactive element exposes a `data-testid` attribute so locators can be repaired without depending on visible labels (e.g. the search button's accessible name changes between modes, but `[data-testid="search-submit"]` does not).

## Project layout

```
server/            Express app: API routes + mode handling (server/index.js)
public/            Static frontend: search page (index.html) and room/booking page (rooms.html)
test_cases.xlsx     The two manual test cases (TC-001, TC-002)
tests/              Playwright scripts generated during the lab
playwright.config.ts
.cursor/mcp.json    Playwright MCP and Atlassian MCP server configuration
```
