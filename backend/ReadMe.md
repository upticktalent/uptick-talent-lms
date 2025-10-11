# Project Overview

This backend powers the Admissions Management System, enabling seamless handling of student applications, interviews, performance tracking, attendance, and communication between students, mentors, and administrators.

The system is built for scalability, reliability, and automation, integrating email/SMS notifications, scheduling, and real-time attendance tracking.

 # Core Features

Admissions Management: Create, update, and manage applicants and interviews.

Scheduling & Automation: Cron jobs for reminders, interview notifications, and periodic updates.

Database Management: Manage students, mentors, alumni, and ventures in a structured PostgreSQL schema.

Communication: Send email and SMS notifications using Nodemailer and Twilio.

Attendance Tracking: Real-time attendance monitoring with Socket.IO and Google Meet integration.

File Uploads: Handle document and assignment uploads using Multer.

Performance Tracking: Store and analyze grading data with feedback support.


| Layer             | Technology                 | Purpose                                                            |
| ----------------- | -------------------------- | ------------------------------------------------------------------ |
| Server            | **Node.js + Express**      | RESTful API framework for handling requests and routing            |
| Database          | **PostgreSQL**             | Relational database for structured data and relationships          |
| ORM               | **Prisma**                 | Schema migrations, type-safe queries, and database synchronization |
| Scheduler         | **node-cron**              | Scheduled tasks for reminders and automation                       |
| Communication     | **Nodemailer**, **Twilio** | Email and SMS notifications                                        |
| Real-Time         | **Socket.IO**              | Real-time communication (attendance and status updates)            |
| Video Integration | **Google Meet API**        | Auto-attendance from meeting participation                         |
| File Uploads      | **Multer**                 | Handling uploads for assignments and documents                     |

# Setup Instructions
Prerequisites

Node.js: v18 or later

npm: v9 or later

PostgreSQL: v14 or later

Git installed and configured

(Optional) Docker for local database setup

# Clone Repository
git clone https://github.com/<your-org>/uptick-talent-lms.git
cd uptick-talent-lms/backend

# Install Dependencies
yarn install
# or
npm install


# Setup Environment Variables
.env

# Start the Server
yarn dev
# or
npm run dev

# Scripts
| Command       | Description                              |
| ------------- | ---------------------------------------- |
| `yarn dev`    | Start development server with hot reload |
| `yarn build`  | Compile TypeScript                       |
| `yarn start`  | Run built project                        |
| `yarn lint`   | Check for linting issues                 |
| `yarn format` | Format code with Prettier                |

# Application
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/admissions_db?schema=public"

# Email (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Meet Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri

# JWT or Auth Keys (if applicable)
JWT_SECRET=your_jwt_secret

# Setup the Database
npx prisma migrate dev
npx prisma generate

 # Run the Server
 npm run dev

# Production
npm run build
npm start

# API Documentation

API routes are documented using  Swagger.

Swagger UI: http://localhost:5000/api-docs

# Folder Structure
backend/
│
├── src/
│   ├── config/           # Configuration files (database, environment variables)
│   ├── prisma/           # Prisma schema and migration files
│   ├── routes/           # Express route definitions
│   ├── controllers/      # Request handlers (bridge between routes & services)
│   ├── services/         # Business logic and reusable functions
│   ├── middleware/       # Authentication, validation, error handling
│   ├── utils/            # Helper utilities (email, tokens, etc.)
│   ├── validations/      # Joi/Zod validation schemas
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Application entry point
│
├── prisma/schema.prisma  # Prisma schema definition
├── .env.example          # Sample environment variables
├── package.json
├── yarn.lock
├── tsconfig.json
└── README.md

# Tech Stack

| Layer               | Technology           |
| ------------------- | -------------------- |
| **Runtime**         | Node.js              |
| **Framework**       | Express.js           |
| **ORM**             | Prisma               |
| **Database**        | PostgreSQL           |
| **Language**        | TypeScript           |
| **Authentication**  | JWT                  |
| **Email Service**   | Nodemailer           |
| **Validation**      | Joi / Zod            |
| **Task Scheduling** | node-cron (optional) |



# Naming Conventions
| Type              | Convention                 | Example                                                     |
| ----------------- | -------------------------- | ----------------------------------------------------------- |
| Folders           | **kebab-case**             | `user-routes`, `email-service`, `auth-middleware`           |
| Files             | **kebab-case**             | `auth.controller.ts`, `user.service.ts`, `error-handler.ts` |
| Prisma schema     | **snake_case**             | `user_profile`, `student_record`                            |
| Environment files | **dot-prefixed lowercase** | `.env`, `.env.example`                                      |


# Variable & Function Naming
| Type               | Convention                             | Example                                              |
| ------------------ | -------------------------------------- | ---------------------------------------------------- |
| Variables          | **camelCase**                          | `studentName`, `totalApplicants`, `isVerified`       |
| Functions          | **camelCase (verb + noun)**            | `sendEmail()`, `calculateAverage()`, `getUserById()` |
| Constants          | **UPPER_CASE_SNAKE**                   | `MAX_RETRY_COUNT`, `JWT_SECRET_KEY`                  |
| Classes            | **PascalCase**                         | `UserService`, `AuthController`, `EmailProvider`     |
| Interfaces / Types | **PascalCase**                         | `UserInput`, `ApplicantStatus`, `ApiResponse`        |
| Enums              | **PascalCase with UPPER_CASE members** | `enum UserRole { ADMIN, STUDENT, MENTOR }`           |

# API Route Naming

| Type          | Convention                | Example                                                    |
| ------------- | ------------------------- | ---------------------------------------------------------- |
| Base route    | **plural nouns**          | `/api/users`, `/api/courses`                               |
| Single item   | **:id param**             | `/api/users/:id`, `/api/courses/:courseId`                 |
| Nested routes | **resource relationship** | `/api/users/:id/certificates`, `/api/courses/:id/students` |
