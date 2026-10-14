# Bolt Bucket - DIY Delight

Submitted by: **Yugant Nagralawala**

Bolt Bucket is a car personalizer. Users pick an exterior, roof, wheels and interior, watch the car and price update live, then save, view, edit and delete their builds. Data lives in a Render PostgreSQL database behind an Express API.

Time spent: **X hours**

## Required Features

- [x] The web app uses React to display data from the API
- [x] The web app is connected to a PostgreSQL database, with a table that matches the data displayed (`custom_items`, plus `options` and `incompatible_options`)
- [x] The app provides multiple customizable features (exterior, roof, wheels, interior), each with multiple options
- [x] The price updates dynamically as options are selected
- [x] The visual interface changes in response to selections (SVG car changes color, roof, wheels and seats)
- [x] Users can save a new custom car and view the list of saved cars
- [x] Impossible combinations show an error message (validated on the server and returned to the user)
- [x] Users can edit and delete saved cars from the list view (and the detail page)

## Stretch Features

- [x] Users are alerted to impossible combos early (live warning banner and per-option conflict notes before submitting)

## Setup

```bash
npm install
# fill in server/.env (PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE) from your Render database
npm run reset   # creates and seeds the tables
npm run dev     # client on :5173, API on :3000
```

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/options` | all options with prices and colors |
| GET | `/api/incompatibilities` | pairs of options that cannot be combined |
| GET/POST | `/api/customcars` | list / create |
| GET/PATCH/DELETE | `/api/customcars/:id` | read / update / delete |

## Walkthrough

![walkthrough gif](walkthrough.gif)
