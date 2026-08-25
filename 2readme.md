# 🚀 EventPulse API Project

EventPulse is a robust, full-featured backend API built for managing events, categories, user registrations, role-based access control (RBAC), and real-time Socket.io announcements. 

---

## 🛠 Tech Stack & Tools
* **Runtime:** Node.js (v24.15.0+)
* **Framework:** Express.js 5
* **Database & ODM:** MongoDB & Mongoose
* **Real-Time Communication:** Socket.io
* **Security & Validation:** bcryptjs, jsonwebtoken (JWT), express-validator, express-mongo-sanitize, dotenv, morgan

---

## 🌟 Features
* **Authentication & RBAC:** Secure user registration, password hashing via `bcrypt`, JWT authentication (`requireAuth`), and role-based permissions (`requireRole('admin')`) for route protection.
* **Events API:** Complete CRUD operations for events with advanced query capabilities including filtering (category, city, date range), sorting, pagination, and case-insensitive text search across titles and descriptions.
* **Event Registration & Capacity Management:** Allows authenticated attendees to register for events, view their registrations, and cancel them, complete with strict database-level unique checks and capacity limits.
* **Real-Time Announcements (Socket.io):** Room-based broadcasting where attendees join dedicated event rooms upon registration, and admins broadcast announcements targeting specific event rooms. Historical messages are persisted via MongoDB and retrievable for late joiners.
* **Input Validation & Error Handling:** Comprehensive request data sanitization and validation using `express-validator` and a centralized error-handling middleware.
* **Deployment Ready:** Integrated with a Vercel deployment configuration and a comprehensive `/health` monitoring endpoint.

---

## ⚙️ Prerequisites
* **Node.js:** v24.15.0 or higher installed on your machine.
* **MongoDB:** Running locally on your machine or an active MongoDB Atlas cloud URI.
* **Package Manager:** `npm` (comes bundled with Node.js).

---

## 🔐 Environment Variables
Create a `.env` file in the root directory of your project and configure the following variables:

1. **`NODE_ENV=development`**  
   Tells Node what mode the app is running in (`development` or `production`). In development mode, detailed error messages are exposed to assist with debugging.
2. **`PORT=5000`**  
   The port number where the local backend server lives. The server listens on this port (e.g., `http://localhost:5000`).
3. **`MONGO_URI=mongodb://localhost:27017/eventpulse`**  
   The connection string used by Mongoose to communicate with your MongoDB server.
4. **`JWT_SECRET=your_super_secret_jwt_key`**  
   Secret key used for signing and verifying JSON Web Tokens.

---

## 📦 Installation & Setup Steps
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mairenewperson-cmd/eventpulse-api-project.git](https://github.com/mairenewperson-cmd/eventpulse-api-project.git)
   cd eventpulse-api-project


├── config/             # Database connection settings and configurations
├── controllers/        # Core business logic handlers for API routes
├── middleware/         # Custom middleware (Authentication, RBAC, error handling)
├── models/             # Mongoose database schemas (User, Event, Category, Registration, Message)
├── routes/             # API routing configurations and endpoint traffic controllers
├── utils/              # Helper utilities, error classes, and async handlers
├── app.js              # Express application setup, Socket.io initialization, and middleware hooking
└── vercel.json         # Vercel deployment configuration

1. Authentication (/api/auth)
POST /api/auth/register — Register a new user account (hashes password, returns JWT)

POST /api/auth/login — Authenticate user credentials and return a session token

2. Categories (/api/categories)
GET /api/categories — Fetch all event categories

GET /api/categories/:id — Fetch a single category by ID

POST /api/categories — Create a new category (Admin only)

PATCH /api/categories/:id — Update category details (Admin only)

DELETE /api/categories/:id — Remove a category (Admin only)

3. Events (/api/events)
Advanced Query Parameters in GET /api/events:

?category=ID — Filter events by category ID

?city=Cairo — Filter events by city

?startDate=2026-01-01&endDate=2026-12-31 — Filter by date range

?search=keyword — Case-insensitive search across title and description

?page=1&limit=10 — Results pagination with full metadata

?sortBy=date&order=desc — Sorting options
4. Registrations (/api/registrations)
POST /api/registrations — Register the logged-in attendee for an event (checks capacity and prevents duplicates)

GET /api/registrations/my — Fetch all events the current user is registered for (populated with event details)

DELETE /api/registrations/:id — Cancel a specific user registration by ID

5. Announcements & Real-Time Socket.io (/api/announcements)
POST /api/announcements — Create and broadcast a real-time message announcement to an event room (Admin only)

GET /api/announcements/:eventId — Fetch historical announcement messages for a specific event

🌐 Health Check Endpoint
GET /health — Returns server uptime, operational environment, timestamp, and active MongoDB connection status.

CLONE GITHUB LINK: https://github.com/mairenewperson-cmd/StudentID-EventPulse



