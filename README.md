# JobPortal — Full‑Stack Job Board

JobPortal is a full‑stack job board application with a Node/Express backend and a React (Vite) frontend. It supports user authentication with HTTP‑only cookies, recruiter company management, job posting, and job applications, and ships with a modern UI powered by Tailwind CSS and Radix UI.

## Overview
- Backend: Express API with MongoDB via Mongoose, JWT auth, file uploads (Multer), optional Cloudinary integration, and CORS configured for local development.
- Frontend: React + Vite, React Router, Redux Toolkit + Redux Persist, Tailwind CSS with utility plugins and Radix UI components.
- Build: The backend can serve the built frontend SPA from `frontend/dist` for production.

## Tech Stack
- Backend
  - `node`, `express`, `mongoose`
  - `jsonwebtoken` for auth, `bcryptjs` for password hashing
  - `cookie-parser` and `cors` for cookies/CORS
  - `multer` for uploads (in‑memory)
  - `cloudinary` (optional; integration is scaffolded)
  - `dotenv` for environment variables
- Frontend
  - `react`, `react-router-dom`
  - `@reduxjs/toolkit`, `react-redux`, `redux-persist`
  - `vite` (dev/build), `@vitejs/plugin-react`
  - `tailwindcss`, `tailwindcss-animate`, `clsx`, `tailwind-merge`
  - Radix UI (`@radix-ui/*`), `lucide-react`, `sonner` for toasts

## Project Structure
```
jobportal/
├── backend/
│   ├── configure/db.js
│   ├── controllers/
│   │   ├── application.controller.js
│   │   ├── company.controller.js
│   │   ├── job.controller.js
│   │   └── user.controller.js
│   ├── index.js
│   ├── middlewares/
│   │   ├── isAuthenticated.js
│   │   └── mutler.js
│   ├── models/
│   │   ├── application.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── application.route.js
│   │   ├── company.route.js
│   │   ├── job.route.js
│   │   └── user.route.js
│   └── utils/
│       ├── cloudinary.js
│       └── datauri.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/* (auth, admin, shared, ui)
│   │   └── redux/*
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── package.json (root)
```

## Environment Variables
Create a `.env` file at the project root (used by backend):
```
# Server
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/jobportal

# Auth
SECRET_KEY=replace_with_a_strong_secret

# Cloudinary (optional; for profile resume/logo uploads)
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

Notes:
- Cloudinary is optional; related code is scaffolded but currently commented in controllers. To enable, set the variables above and uncomment the Cloudinary/DataURI lines in `user.controller.js` and `company.controller.js`.
- CORS is currently set to `http://localhost:5173` and `credentials: true` in `backend/index.js`. Adjust if your frontend runs elsewhere.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or reachable via `MONGO_URI`

### Install Dependencies
At the project root:
```
npm install
```

Install frontend dependencies (if not already installed by root scripts):
```
npm install --prefix frontend
```

### Run in Development
- Start the backend (Express API):
```
npm run dev
```

- Start the frontend (Vite dev server):
```
cd frontend
npm run dev
```

The backend defaults to `PORT` or `3000`. The frontend runs on `5173` by default.

Cookie/Auth tip: when calling the API from the frontend, ensure requests send credentials so the HTTP‑only JWT cookie is included. With Axios, either set `axios.defaults.withCredentials = true` or per request `{ withCredentials: true }`.

### Build for Production
Build the frontend and prepare for serving via Express:
```
npm run build
```

This installs dependencies and builds the frontend into `frontend/dist`. The backend is configured to serve static assets from that directory.

Start the server in production mode (serving the built SPA):
```
node backend/index.js
```

Note: the root `start` script uses `nodemon` (dev). For production a plain `node` is recommended.

## Backend API
Base URL: `http://localhost:<PORT>/api/v1`

### Auth/User (`/user`)
- `POST /user/register` — Register a new user (roles: `student` or `recruiter`). Supports optional file upload field `file` (Cloudinary integration is commented).
- `POST /user/login` — Login with `{ email, password, role }`. Sets an HTTP‑only `token` cookie.
- `GET /user/logout` — Clears the auth cookie.
- `POST /user/profile/update` — Update profile fields; accepts optional `file` upload for resume when Cloudinary is enabled. Requires auth.

### Company (`/company`) — Recruiter
- `POST /company/register` — Register a company with `{ companyName }`. Requires auth.
- `GET /company/get` — List companies for the current recruiter. Requires auth.
- `GET /company/get/:id` — Get company by ID. Requires auth.
- `PUT /company/update/:id` — Update company details; optional logo upload when Cloudinary is enabled. Requires auth.

### Jobs (`/job`)
- `POST /job/post` — Create a new job. Body includes fields like `title`, `description`, `requirements` (comma‑separated), `salary`, `location`, `jobType`, `experience`, `position`, `companyId`. Requires auth.
- `GET /job/get` — Get jobs, optional `?keyword=` search over `title` and `description`. Requires auth.
- `GET /job/getadminjobs` — Get jobs created by the current recruiter. Requires auth.
- `GET /job/get/:id` — Get a job by ID with populated `applications`. Requires auth.

### Applications (`/application`)
- `GET /application/apply/:id` — Apply to a job by job ID. Requires auth. (Note: uses GET here.)
- `GET /application/get` — Get applications for the current user (populates job and company). Requires auth.
- `GET /application/:id/applicants` — Recruiter view: list applicants for a job. Requires auth.
- `POST /application/status/:id/update` — Update an application status to `pending|accepted|rejected`. Requires auth.

### Authentication Details
- `isAuthenticated` middleware reads the JWT from the `token` cookie and sets `req.id` to the user ID.
- JWT is signed with `SECRET_KEY` and currently expires in 1 day.

## Data Models (Summary)
- `User`
  - `fullname`, `email` (unique), `phoneNumber`, `password`, `role: 'student'|'recruiter'`
  - `profile`: `bio`, `skills[]`, `resume` URL, `resumeOriginalName`, `company` ref, `profilePhoto`
- `Company`
  - `name` (unique), `description`, `website`, `location`, `logo`, `userId` (recruiter ref)
- `Job`
  - `title`, `description`, `requirements[]`, `salary`, `experienceLevel`, `location`, `jobType`, `position`
  - `company` ref, `created_by` (recruiter ref), `applications[]` refs
- `Application`
  - `job` ref, `applicant` ref, `status: 'pending'|'accepted'|'rejected'` (default `pending`)

## Frontend Routes
- `/` — Home
- `/login` and `/signup`
- `/jobs` — Browse jobs
- `/description/:id` — Job detail
- `/browse` — Company/job browsing
- `/profile` — Profile page
- Admin (protected)
  - `/admin/companies`, `/admin/companies/create`, `/admin/companies/:id`
  - `/admin/jobs`, `/admin/jobs/create`, `/admin/jobs/:id/applicants`

## Development Notes
- Adjust the CORS origin in `backend/index.js` if your frontend dev server runs at a different host/port.
- If enabling Cloudinary uploads, uncomment the DataURI/Cloudinary lines in controllers and ensure `singleUpload` expects `file` field.
- Ensure Axios calls include `withCredentials: true` to send/receive the auth cookie.

## Scripts
- Root
  - `npm run dev` — Start backend with nodemon
  - `npm run build` — Install deps and build frontend
  - `npm start` — Start backend with nodemon (dev)
- Frontend
  - `npm run dev` — Vite dev server
  - `npm run build` — Build SPA to `dist`
  - `npm run preview` — Preview built SPA locally

## License
No license specified.
