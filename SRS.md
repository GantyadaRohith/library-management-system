# Library Management System — Software Requirements Specification (SRS)

Version: 1.1  
Date: 2025-10-09

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes the functional and non-functional requirements for the Library Management System (LMS). The document serves as a contract among stakeholders (students, librarians, admins, developers, testers) and guides design, implementation, testing, and deployment.

### 1.2 Scope
The LMS is a full‑stack web application that enables students to discover and request books and enables librarians/admins to manage inventory, requests, and overdue notifications.

- Frontend: React (Create React App)  
- Backend: Express (Node.js) or serverless functions  
- Database: MongoDB (Mongoose ODM)  
- Email: SMTP via Nodemailer  
- Auth: JWT-based authentication  

Key capabilities:
- User registration and login (student, librarian/admin roles)
- Book catalog browsing, search, and filters
- Request queue for borrowing and returning books
- Due date tracking, overdue detection, and email notifications
- Admin dashboard for user and inventory management

### 1.3 Definitions, Acronyms, and Abbreviations
- LMS: Library Management System
- JWT: JSON Web Token
- CRUD: Create, Read, Update, Delete
- NFR: Non-Functional Requirement

### 1.4 References
- Repository README: ./README.md
- Backend docs: ./server/README.md
- Frontend docs: ./client/README.md
- Environment: ./server/.env.example
- Data models: `server/models/*.js`

### 1.5 Overview
Section 2 describes background and related systems; Section 3 summarizes the product perspective and users; Section 4 lists detailed requirements; Sections 5–9 describe architecture, data model, APIs, UI, and testing; remaining sections cover risks and glossary.

---

## 2. Background and Related Systems (Literature Survey)
Traditional libraries rely on manual tracking of inventory and loans, which is error-prone and lacks real-time visibility. Modern LMS solutions centralize catalog management, streamline requests, and automate notifications. This LMS adopts a standard web architecture with React, Express, and MongoDB to support scalability, usability, and extensibility.

---

## 3. Overall Description / Problem Analysis

### 3.1 Product Perspective
The LMS is a standalone web application with:
- React SPA frontend consuming REST APIs
- Express or serverless backend exposing `/api` endpoints
- MongoDB for persistent storage
- SMTP integration for email notifications

### 3.2 Existing vs. Proposed System
- Existing: Manual spreadsheets or legacy tools with limited automation
- Proposed: Centralized, role-based system with self-service for students, request workflows, and automated reminders

### 3.3 User Classes and Characteristics
- Student: Browses catalog, requests/returns books, views “My Books” and due dates
- Librarian: Manages requests, processes returns, updates books
- Admin: All librarian capabilities plus user management and system settings

### 3.4 Operating Environment
- Node.js ≥16 (recommended 18+), npm ≥8  
- MongoDB ≥4.4 (local or Atlas)  
- Modern browsers (Chrome, Firefox, Safari, Edge)  
- Windows/macOS/Linux

### 3.5 Constraints
- JWT-based stateless authentication
- Email via configured SMTP provider
- CORS limited to configured frontend URL
- Data retention aligned with institutional policy

### 3.6 Assumptions and Dependencies
- Reliable MongoDB instance and SMTP credentials available
- Users have valid email addresses for notifications
- Timezone defaults to server timezone unless otherwise configured

---

## 4. System Requirements

### 4.1 Hardware Requirements
- Development: Any machine capable of running Node.js and MongoDB (≥1 CPU, ≥1GB RAM recommended)
- Production: Sized for traffic (horizontal scaling supported via stateless backend)

### 4.2 Software Requirements
- Node.js, npm  
- MongoDB (local or Atlas)  
- Optional: PM2 or platform process manager; Vercel/Netlify for serverless

### 4.3 External Interface Requirements
- User Interface: Responsive React SPA
- API Interface: REST JSON over HTTPS
- Database Interface: MongoDB via Mongoose
- Email Interface: SMTP via Nodemailer

### 4.4 Environment Variables (Backend)
Required (see `server/REQUIREMENTS.md`):
- PORT, NODE_ENV  
- MONGODB_URI  
- JWT_SECRET, JWT_EXPIRES_IN  
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM  
- FRONTEND_URL  
- ADMIN_EMAIL, ADMIN_PASSWORD  

---

## 5. Functional Requirements

Each functional requirement includes an ID, description, and acceptance criteria.

### FR-1 Authentication & Authorization
- Description: Users can register (student) and login; admins/librarians are designated by role; protected routes require valid JWT.
- Acceptance:
  - Registration persists user; duplicate email rejected.
  - Login returns JWT; invalid credentials rejected.
  - Protected endpoints return 401/403 when unauthorized/insufficient role.

### FR-2 User Management (Admin)
- Description: Admin can list, activate/suspend users, and promote to librarian.
- Acceptance: Admin-only access; changes reflected immediately; audit fields captured (e.g., `approvedBy`).

### FR-3 Book Catalog Management
- Description: Admin/librarian can add, update, delete books; catalog is searchable and filterable by title/author/genre/availability.
- Acceptance: Required fields validated (`title`, `author`); search returns results ranked by relevance (text index); filters combinable.

### FR-4 Request Queue (Borrow/Return)
- Description: Students can request a book; librarians/admins approve; system records `dueDate`; returns change status and availability.
- Acceptance: Only available books can be requested; approval sets `status=accepted`, `dueDate`; return sets `status=returned`, unsets availability appropriately.

### FR-5 My Books & Due Dates (Student)
- Description: Students can view active and past requests with due dates and status.
- Acceptance: Overdue status calculated and displayed; history accessible.

### FR-6 Overdue Detection & Notifications
- Description: Scheduled job marks overdue requests and sends emails for “before due”, “due today”, and “overdue”.
- Acceptance: Emails sent according to schedule; request `remindersSent` logged; `isOverdue`, `daysOverdue`, `lateFee` maintained when applicable.

### FR-7 Admin Dashboard
- Description: Aggregated metrics (pending requests, overdue items, user stats) and quick actions.
- Acceptance: Metrics load under 2s for typical datasets; actions navigate to relevant management screens.

### FR-8 Audit and Notes (Requests)
- Description: Librarian can add optional notes to a request.
- Acceptance: Notes persisted and visible to librarians/admins.

### FR-9 Security & Session
- Description: JWT stored client-side; logout clears client session; password hashing with bcrypt.
- Acceptance: Tokens verified on every protected request; password not stored in plaintext.

---

## 6. Non-Functional Requirements (NFRs)

### NFR-1 Performance
- Initial catalog page load ≤ 3s on broadband; searches ≤ 1s for ≤10k items with proper indexing.

### NFR-2 Security
- Strong password policy; bcrypt salt rounds ≥ 12.
- JWT signed with secret; HTTPS required in production; CORS restricted.
- Input validation and sanitization on all endpoints.

### NFR-3 Reliability & Availability
- Scheduled jobs resume after restart; idempotent operations where practical.
- Backups configured for MongoDB in production.

### NFR-4 Maintainability
- Clear module boundaries (routes, models, services, middleware).
- Linting and conventional commit messages recommended.

### NFR-5 Usability
- Responsive UI; accessible labels; keyboard navigation for main flows.

### NFR-6 Observability
- Log errors with request context (avoid sensitive data); basic metrics for job runs and email dispatch.

---

## 7. System Architecture

### 7.1 High-Level Architecture
- React client (SPA) → REST API (Express or serverless) → MongoDB
- Background scheduler (node-cron) for reminders and overdue processing

### 7.2 Modules
- Auth: registration, login, profile, JWT middleware
- Books: CRUD, search, filters
- Requests: queue, approve, return, due dates, notes
- Admin: users, dashboard, overdue management
- Services: dueDateService, reminderScheduler

### 7.3 Data Model (from `server/models`)
- User
  - name, email (unique), password (hashed), role: student|librarian|admin, status, requestedRole, approvedBy, createdAt, lastLogin
- Book
  - title, author, description, isbn, publishedYear, genre, pages, language, publisher, available, addedAt
  - Indexes: text (title, author, description, isbn, publisher), compound (genre, available), etc.
- Request
  - student (ref User), book (ref Book), status: pending|accepted|returned, requestedAt, acceptedAt, dueDate, returnedAt, isOverdue, daysOverdue, lateFee, remindersSent[], notes

### 7.4 API Endpoints (summary)
- Auth (`/api/auth`): POST /register, POST /login, GET /profile
- Books (`/api/books`): GET /, POST /, PUT /:id, DELETE /:id
- Requests (`/api/requests`): GET /, POST /, PUT /:id/approve, PUT /:id/return
- Admin (`/api/admin`): GET /dashboard, GET /users, GET /overdue

---

## 8. UML and Use Cases (Textual)

### 8.1 Actors
- Student, Librarian, Admin, Email Service (external)

### 8.2 Key Use Cases
- UC-1 Register/Login (Student)  
  Basic Flow: Submit form → validate → create user or return JWT
- UC-2 Browse & Search Books (Student)  
  Basic Flow: Load list → apply filters → view details
- UC-3 Request Book (Student)  
  Basic Flow: Click request → server validates availability → create request (pending)
- UC-4 Approve/Return (Librarian)  
  Basic Flow: Approve sets due date; Return updates status and availability
- UC-5 Manage Users (Admin)  
  Basic Flow: List users → change status/role
- UC-6 Overdue Reminders (Scheduler)  
  Basic Flow: Cron runs → detect due/overdue → send emails → log reminders

---

## 9. UI Requirements (Screens)
- Login / Register
- Catalog (BookList) with search and filters
- Book Details (modal or page)
- My Books (current and history)
- Request Queue (librarian)
- Overdue Management (librarian/admin)
- Admin Dashboard

Accessibility: provide labels, sufficient contrast, keyboard focus order, descriptive toasts.

---

## 10. Data Requirements & Policies
- Indexes maintained per models for search and filters
- Data retention policy configurable; logs retain for ≤90 days (recommendation)
- Unique email constraint; cascading deletes avoided—prefer soft logic for historical requests

---

## 11. Error Handling & Validation
- Consistent JSON error shape: `{ message, code, details? }`
- Client displays informative toasts (no sensitive info)
- Server validates inputs (type, range, required fields); sanitizes text

---

## 12. Testing Strategy

### 12.1 Test Types
- Unit tests: services, utilities, controllers
- Integration tests: API endpoints with in‑memory or test DB
- E2E smoke: critical flows (login, browse, request, approve, return)

### 12.2 Sample Test Cases
| ID | Test Case | Expected | Priority |
|----|-----------|----------|----------|
| TC-01 | Register with existing email | 409 conflict | High |
| TC-02 | Login with wrong password | 401 unauthorized | High |
| TC-03 | Search books by title | Results include matching titles | Medium |
| TC-04 | Request unavailable book | 400 validation error | High |
| TC-05 | Approve request sets dueDate | status=accepted, dueDate set | High |
| TC-06 | Overdue job marks overdue | isOverdue=true, email sent | High |

### 12.3 Acceptance Scenarios
- A student can request an available book and see it in My Books with the correct due date.
- A librarian can approve and later process a return, updating availability.
- The system sends an email the day a book is due and another when overdue.

---

## 13. Deployment & Operations
- Environments: Dev, Staging, Prod
- Configuration via `.env` (see Section 4.4)
- Health: basic `/api/health` endpoint recommended
- Background jobs: node-cron (single runner) or platform scheduler
- Monitoring & Logs: platform logs + alerts on failures (SMTP, DB)

---

## 14. Risks and Mitigations
- SMTP failures → retry with backoff; alert on persistent failures
- DB outages → retry policies, read-only fallbacks for catalog
- Token theft → short JWT TTL; revoke via rotation strategy (future)
- Data quality → validation, admin review workflows

---

## 15. Glossary
- Request: A record representing a student’s intent to borrow and its lifecycle
- Overdue: A request whose `dueDate` has passed while status is `accepted`
- Late Fee: Optional monetary penalty calculated per policy

---

## 16. Revision History
| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2025-10-09 | Project Team | Initial SRS draft |
| 1.1 | 2025-10-09 | Project Team | Expanded sections: RBAC, detailed API specs, data dictionary, error codes, email templates, security, performance, ops, traceability, change control, future enhancements |

---

## 17. Role-Based Access Control (RBAC)

| Feature | Student | Librarian | Admin |
|---------|---------|-----------|-------|
| Register/Login | ✓ | ✓ | ✓ |
| View catalog | ✓ | ✓ | ✓ |
| Request book | ✓ | ✓ (for testing) | ✓ (for testing) |
| Approve/Return requests | ✗ | ✓ | ✓ |
| Manage books (add/edit/delete) | ✗ | ✓ | ✓ |
| View My Books | ✓ | ✓ (own) | ✓ (own) |
| View all requests | ✗ | ✓ | ✓ |
| Manage users (promote/suspend) | ✗ | ✗ | ✓ |
| View admin dashboard | ✗ | ✓ (limited) | ✓ |

Notes:
- “Testing” requests by librarians/admins is optional and typically disabled in production; primarily students create requests.
- Admin inherits librarian permissions.

---

## 18. Detailed API Specification

Conventions:
- Base URL: `/api`
- Auth: Bearer JWT in `Authorization: Bearer <token>` header
- Content-Type: `application/json`
- Pagination: `?page=1&limit=20`
- Sorting: `?sort=addedAt&order=desc`
- Filtering: as documented per endpoint (e.g., `?genre=Fiction&available=true`)

### 18.1 Auth

POST `/api/auth/register`
- Public
- Body:
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "StrongPassw0rd!"
}
```
- Responses:
  - 201 Created: `{ "id": "...", "email": "alice@example.com" }`
  - 409 Conflict: `{ "code": "E_CONFLICT", "message": "Email already in use" }`
  - 400 Validation errors

POST `/api/auth/login`
- Public
- Body:
```json
{ "email": "alice@example.com", "password": "StrongPassw0rd!" }
```
- Responses:
  - 200 OK: `{ "token": "<jwt>", "user": {"id":"...","role":"student"} }`
  - 401 Unauthorized

GET `/api/auth/profile`
- Auth required
- Returns current user profile.

### 18.2 Books

GET `/api/books`
- Public
- Query params: `q` (text search), `genre`, `author`, `available`, `page`, `limit`, `sort`, `order`
- Response (200):
```json
{
  "items": [
    {"_id":"...","title":"...","author":"...","genre":"...","available":true}
  ],
  "page": 1,
  "limit": 20,
  "total": 123
}
```

POST `/api/books`
- Roles: librarian, admin
- Body (required `title`, `author`):
```json
{
  "title":"Clean Code",
  "author":"Robert C. Martin",
  "isbn":"9780132350884",
  "genre":"Software",
  "publishedYear":2008,
  "description":"..."
}
```
- Responses: 201 Created; 400 Validation; 403 Forbidden

PUT `/api/books/:id`
- Roles: librarian, admin
- Partial update; 200 OK with updated doc

DELETE `/api/books/:id`
- Roles: admin (or librarian per policy)
- 204 No Content on success

### 18.3 Requests (Borrow/Return)

GET `/api/requests`
- Roles: student (own), librarian/admin (all)
- Query: `status`, `page`, `limit`

POST `/api/requests`
- Role: student
- Body:
```json
{ "bookId": "<Book._id>" }
```
- Responses:
  - 201 Created: `{ "_id":"...","status":"pending" }`
  - 400: book unavailable or invalid

PUT `/api/requests/:id/approve`
- Roles: librarian, admin
- Body:
```json
{ "dueDate": "2025-11-01T00:00:00.000Z" }
```
- Effect: sets `status=accepted`, `acceptedAt`, `dueDate` and marks book as unavailable

PUT `/api/requests/:id/return`
- Roles: librarian, admin
- Effect: sets `status=returned`, `returnedAt`, marks book as available

### 18.4 Admin

GET `/api/admin/dashboard`
- Roles: admin
- Returns aggregates: counts of users, books, pending, overdue, etc.

GET `/api/admin/users`
- Roles: admin
- Query: `role`, `status`, pagination

GET `/api/admin/overdue`
- Roles: admin
- Returns currently overdue requests with user/book details

Error model (typical):
```json
{ "code": "E_FORBIDDEN", "message": "Insufficient role", "details": null }
```

---

## 19. Data Dictionary

### 19.1 User
- `_id`: ObjectId
- `name`: String, required
- `email`: String, required, unique, validated
- `password`: String, bcrypt hash
- `role`: Enum `student|librarian|admin`, required
- `status`: Enum `active|pending|suspended`, default `active`
- `requestedRole`: Enum `student|librarian|null`, default null
- `approvedBy`: ObjectId(User) | null
- `createdAt`: Date (default now)
- `lastLogin`: Date | null

Constraints/Indexes: unique index on `email`.

### 19.2 Book
- `_id`: ObjectId
- `title`: String, required (text-weight 10)
- `author`: String, required (text-weight 5)
- `description`: String (text-weight 1)
- `isbn`: String (text-weight 3)
- `publishedYear`: Number | null
- `genre`: String, default `General`
- `pages`: Number | null
- `language`: String, default `English`
- `publisher`: String
- `available`: Boolean, default true
- `addedAt`: Date (default now)

Indexes: text compound, `genre+available`, `author+available`, `addedAt`, `available+addedAt`.

### 19.3 Request
- `_id`: ObjectId
- `student`: ObjectId(User), required
- `book`: ObjectId(Book), required
- `status`: Enum `pending|accepted|returned`, default `pending`
- `requestedAt`: Date (default now)
- `acceptedAt`: Date | null
- `dueDate`: Date | null
- `returnedAt`: Date | null
- `isOverdue`: Boolean, default false
- `daysOverdue`: Number, default 0
- `lateFee`: Number, default 0
- `remindersSent`: Array of `{ type: 'before_due'|'due_today'|'overdue', sentAt: Date }`
- `notes`: String

Virtuals: `currentlyOverdue`, `currentDaysOverdue` (JSON/object include).

---

## 20. Error Codes & Responses

| Code | HTTP | Description |
|------|------|-------------|
| E_VALIDATION | 400 | Invalid input data |
| E_AUTH_INVALID | 401 | Invalid credentials or token |
| E_FORBIDDEN | 403 | Insufficient role/permissions |
| E_NOT_FOUND | 404 | Resource not found |
| E_CONFLICT | 409 | Conflict (e.g., duplicate email) |
| E_RATE_LIMIT | 429 | Too many requests |
| E_INTERNAL | 500 | Unexpected server error |

Error shape:
```json
{ "code": "E_VALIDATION", "message": "Title is required", "details": { "field": "title" } }
```

---

## 21. Email Notifications

Channels: SMTP via Nodemailer. All emails use `EMAIL_FROM` sender.

Templates (placeholders in {braces}):

- Before Due (e.g., 2 days prior)
  - Subject: `Reminder: "{title}" is due on {dueDate}`
  - Body: `Hi {name}, this is a friendly reminder that your borrowed book "{title}" is due on {dueDate}.`

- Due Today
  - Subject: `Due Today: "{title}"`
  - Body: `Hi {name}, your borrowed book "{title}" is due today ({dueDate}). Please return it to avoid late fees.`

- Overdue
  - Subject: `Overdue Notice: "{title}" — {daysOverdue} day(s) overdue`
  - Body: `Hi {name}, "{title}" is now overdue by {daysOverdue} day(s). Current fee: ${lateFee}. Please return promptly.`

Recommended schedule (node-cron):
- Daily at 09:00 server time: `0 9 * * *`

Logging: Append an entry to `remindersSent` with `type` and `sentAt` for each notification dispatched.

---

## 22. Security Requirements (Detailed)

- Passwords hashed with bcrypt (`BCRYPT_ROUNDS` ≥ 12)
- JWT tokens signed with `JWT_SECRET`; recommended `JWT_EXPIRES_IN` ≤ 7d
- HTTPS enforced in production (reverse proxy/hosting platform)
- CORS allow-list using `FRONTEND_URL`
- Rate limiting on auth and write endpoints (e.g., 5 req/min/login)
- Helmet for security headers; disable `x-powered-by`
- Input validation and sanitization (e.g., `validator`)
- Avoid logging secrets/PII; mask email in error logs
- Dependencies kept updated; renovate/dependabot recommended
- Secrets stored via environment variables or platform secrets

---

## 23. Performance & Scalability

Targets:
- API latency: p50 ≤ 150ms, p95 ≤ 500ms (local dev excluded)
- Search: ≤ 1s for ≤ 10k books with text indexes
- Pagination default `limit=20`, max `limit=100`

Practices:
- Use MongoDB indexes as defined; add indexes for frequent filters
- Project only needed fields in list views
- Enable gzip/deflate at proxy
- Consider connection pooling and Node cluster mode in production

---

## 24. Operations & Runbook

Health Checks:
- `GET /api/health` → `{ status: 'ok', db: 'connected', uptime: <secs> }`
- Readiness can verify DB connectivity and essential env vars

Cron Jobs:
- Reminder/Overdue job daily at 09:00; ensure a single runner instance

Backups:
- Atlas: configure automated backups
- Self-hosted: nightly `mongodump`, retention 7–30 days

Restore Procedure:
- Stop writers → restore snapshot → verify → resume

Monitoring:
- Track job run results, email send failures, DB connection errors

Incident Response:
- Roll back last deploy; disable scheduler on runaway emails; notify admins

---

## 25. Requirements Traceability

| FR | Backend Endpoints | Frontend Screens/Components |
|----|--------------------|-----------------------------|
| FR-1 | /api/auth/* | `Login.js`, `Register.js` |
| FR-2 | /api/admin/users | `AdminDashboard.js` |
| FR-3 | /api/books (CRUD) | `BookList.js`, `AddBook.js`, `BookCard.js` |
| FR-4 | /api/requests/* | `RequestQueue.js`, `RequestCard.js` |
| FR-5 | /api/requests (GET) | `MyBooks.js`, `DueDateInfo.js` |
| FR-6 | Scheduler + /api/admin/overdue | `OverdueManagement.js` |
| FR-7 | /api/admin/dashboard | `AdminDashboard.js` |
| FR-8 | /api/requests (notes) | `RequestCard.js` |
| FR-9 | Middleware (auth), config | `Navbar.js` (logout), client storage |

---

## 26. Change Management

- SRS versions follow semantic increments (1.0, 1.1, ...)
- Changes proposed via PR with reviewer approval (product + tech)
- Maintain changelog in Revision History (Section 16)

---

## 27. Future Enhancements

- Waitlist/reservations for unavailable books
- Fine payment integration (Stripe/UPI)
- Multi-branch libraries and inventory per branch
- Attach cover images and import/export (CSV)
- Internationalization (i18n) and localization
- Two-factor authentication for admins
- Webhooks for external integrations (e.g., Slack notifications)

