# LearnHub - MERN Stack Learning Management System

LearnHub is a full-stack Learning Management System built with **MongoDB, Express, React and Node.js**.
Students browse and enroll in courses, instructors create courses and upload lessons, and admins manage
users, courses and view analytics. Authentication uses **JWT + Bcrypt** with **role-based access control**.

> Final Project - React & Node JS (MERN Stack), Hunarmand Punjab, Batch 3

## Features
- Public pages: Home, Course Listing (search + category filter), Course Detail, Login, Register
- JWT authentication, Bcrypt password hashing, secrets in `.env`
- Three roles: **Admin**, **Instructor**, **Student**
- Instructor: create / edit / delete own courses, upload lessons
- Student: enroll in courses, view enrolled courses with progress tracking
- Admin: manage users (change role / delete), manage all courses, view analytics
- Protected backend routes (middleware) and protected frontend dashboards (role-based)
- Clear error/success feedback for invalid input and failed requests

## Tech Stack
| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router v6, Axios, Bootstrap 5, React Bootstrap |
| Backend | Node.js, Express 4, Mongoose, JSON Web Token, bcryptjs, dotenv, cors |
| Database | MongoDB |

## Project Structure
```
learnhub/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # User, Course, Enrollment (Mongoose)
│   ├── controllers/            # auth, course, enrollment, admin logic
│   ├── routes/                 # REST routes
│   ├── middleware/             # auth (JWT + roles), error handler
│   ├── seed.js                 # demo data
│   ├── test-api.js             # end-to-end API test script
│   └── server.js
└── frontend/
    └── src/
        ├── components/         # Navbar, CourseCard, CourseForm, ProtectedRoute
        ├── pages/              # Home, Courses, CourseDetail, Login, Register, dashboards
        ├── context/            # AuthContext
        ├── services/api.js     # Axios instance
        └── App.jsx             # routes
```

## Installation

**Requirements:** Node.js 18+, MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. clone
git clone <your-repo-url>
cd learnhub

# 2. install dependencies for both folders
npm run install:all

# 3. configure environment
cp backend/.env.example backend/.env      # then edit JWT_SECRET (and MONGO_URI if using Atlas)

# 4. load demo data (optional but recommended)
npm run seed

# 5. run (two terminals)
npm run dev:backend      # API on http://localhost:5000
npm run dev:frontend     # App on http://localhost:5173
```

### Demo accounts (after `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Admin | admin@learnhub.com | admin123 |
| Instructor | instructor@learnhub.com | instructor123 |
| Student | student@learnhub.com | student123 |

## Environment Variables (`backend/.env`)
| Variable | Description |
|---|---|
| PORT | API port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign tokens (never commit the real one) |
| JWT_EXPIRES_IN | Token lifetime, e.g. `7d` |
| CLIENT_URL | Allowed CORS origin |

## API Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/register | Public | Register (student / instructor) |
| POST | /api/login | Public | Login, returns JWT |
| GET | /api/me | Logged in | Current user |
| GET | /api/courses | Public | List courses (`?search=&category=`) |
| GET | /api/courses/:id | Public | Course detail |
| POST | /api/courses | Instructor, Admin | Create course |
| PUT | /api/courses/:id | Owner, Admin | Update course |
| DELETE | /api/courses/:id | Owner, Admin | Delete course |
| POST | /api/courses/:id/lessons | Owner, Admin | Upload lesson |
| POST | /api/enroll | Student | Enroll in course |
| GET | /api/my-courses | Student | Enrolled courses |
| PUT | /api/enroll/:id/progress | Student | Update progress |
| GET | /api/admin/users | Admin | List users |
| PUT | /api/admin/users/:id | Admin | Change role |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| GET | /api/admin/stats | Admin | Analytics |

## Testing
With the backend running and the database seeded:
```bash
npm run test:api
```
This runs 26 automated checks covering register, login, validation errors, role protection,
course CRUD, lessons, enrollment, progress and admin routes.

## Deployment
```bash
npm run build     # builds React into frontend/dist
npm start         # Express serves the API and the built React app on one port
```
Deploy the repository to Render / Railway as a single Node service
(build command `npm run install:all && npm run build`, start command `npm start`),
use MongoDB Atlas for `MONGO_URI`, and set `JWT_SECRET` in the host's environment settings.

## Author
Your Name - Hunarmand Punjab, Batch 3
