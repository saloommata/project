# Ryvano Café Website

The live website for Ryvano: a public site plus an admin panel for managing everything without touching code.

It uses the same Node/Express + PostgreSQL backend and React/Vite frontend architecture as the e-commerce storefront it was adapted from (same auth, same admin CRUD pattern, same config-driven approach). It has been redesigned around Ryvano's espresso, paper and brass brand identity.

## Contents

- [Project structure](#project-structure)
- [Features](#features)
- [Running locally](#running-locally)
- [Deploying](#deploying)
- [Managing content](#managing-content)
- [Brand assets](#brand-assets)

## Project structure

| Folder | What it is |
| --- | --- |
| `project/` | React/Vite app: the public site and the `/admin` panel (`/admin` is just a route in the same app) |
| `backend/` | Express/PostgreSQL API used by both |

## Features

### Public site

Code: `project/src/pages/home.tsx` and `project/src/components/sections/`

- Animated hero and an "Our Story" section
- Categorized menu with items, prices, photos, and featured/availability badges
- Guest testimonials band
- Contact and location section with hours, address, embedded map, and a WhatsApp button
- Scroll-entrance animations via `framer-motion` (see `src/components/reveal.tsx`)
- Full English/Arabic support with RTL layout
- Responsive down to about 360px

### Admin panel

Code: `project/src/pages/admin/`

- Password-protected (bcrypt hashing, rate-limited login)
- Sidebar navigation for Menu Items, Categories, Testimonials, and Settings
- Settings cover branding, theme colors, contact info, hours, social links, site copy, and SEO
- Changes go live on the public site as soon as they are saved, with no rebuild or redeploy

### Backend

Code: `backend/`

- REST API for menu items, categories, testimonials, settings, image uploads, and visitor analytics
- Admin sessions use signed HMAC tokens
- Passwords are bcrypt-hashed, and any legacy plaintext password is migrated automatically
- `/api/admin-login` is rate-limited
- Security headers are enabled via `helmet`

## Running locally

### 1. Set up the database

Create a Postgres database (default name: `ryvano_cafe`), then copy `backend/.env.example` to `backend/.env` and fill in:

- your database connection
- a fresh `ADMIN_TOKEN_SECRET` (see the comment in `.env.example` for how to generate one)
- a `DEFAULT_ADMIN_PASSWORD` for first boot

Then run:

```bash
cd backend
npm install
node migrate.js
```

This applies `schema.sql`, which also seeds Ryvano's real menu (4 categories, 15 items), 3 testimonials, and the default brand settings.

### 2. Start the backend

```bash
cd backend
npm run start    # or: node server.js
```

Runs at `http://localhost:3005` by default.

### 3. Start the frontend

```bash
cd project
npm install
npm run dev
```

Runs at `http://localhost:5173`. If the backend is not on `localhost:3005`, set `VITE_API_BASE` in `project/.env.local`.

### 4. Log in to the admin panel

Go to `/admin` and sign in with the `DEFAULT_ADMIN_PASSWORD` from step 1. Change it right away under **Settings → Admin Password**.

## Deploying

The setup needs three pieces:

1. A Node web service for `backend/`
2. A static or Node site for `project/` (run `npm run build`, then serve `project/dist/`)
3. A Postgres database

Then connect them:

| Setting | Where | Value |
| --- | --- | --- |
| `VITE_API_BASE` | Frontend | The deployed backend URL |
| `FRONTEND_ORIGIN` | Backend | The deployed frontend URL (needed for CORS) |

Dependencies such as `bcryptjs`, `express-rate-limit`, `helmet`, and `framer-motion` are installed automatically by `npm install`.

> **Note on image uploads:** Uploads are saved to local disk (`backend/routes/uploads.js`, served from `backend/uploads/`). Most platforms wipe this on every redeploy unless a persistent disk is attached. That is fine while iterating, but move to S3 or Cloudinary before real production traffic.

## Managing content

Day-to-day changes are all made in the admin panel, with no code needed.

| Tab | What you can do |
| --- | --- |
| **Menu Items / Categories** | Add, edit, delete, and reorder; mark items featured or temporarily unavailable; upload photos |
| **Testimonials** | Add and curate testimonials directly (no order verification, since a café has no order numbers to check) |
| **Settings** | Brand name and logo, all 11 theme color roles, contact info, hours, address, map link, social links, hero/about/footer copy (bilingual), SEO title and description, admin password |

### Rebranding in code

To reuse this codebase for a different café, edit `project/src/config/store.config.ts`. It is the single source of truth for default branding, content, and theme.

Whatever is saved in the live admin Settings always overrides this file at runtime. The file only controls what a brand-new, never-configured deployment shows.

## Brand assets

`project/public/logo/` contains the full Ryvano mark:

- Icon/badge, wordmark, combined lockup, and bare glyph
- Each in an **ink** variant (dark, for light backgrounds) and a **reversed** variant (light, for dark backgrounds)
- A favicon and a circle-cropped profile picture for social platforms

### Colors

| Name | Hex |
| --- | --- |
| Ink | `#2B1C12` |
| Paper | `#EFE9DD` |
| Brass | `#B1793A` |
| Brass Deep | `#86571F` |
| Line | `#D3C7AE` |

### Typography

| Role | Font |
| --- | --- |
| Display | Fraunces |
| Body / UI | IBM Plex Sans |
| Labels / prices | IBM Plex Mono |

Fonts load from Google Fonts in `project/index.html`.
