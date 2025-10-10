Project Overview

This backend powers the Admissions Management System, enabling seamless handling of student applications, interviews, performance tracking, attendance, and communication between students, mentors, and administrators.

The system is built for scalability, reliability, and automation, integrating email/SMS notifications, scheduling, and real-time attendance tracking.

 Core Features

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

Setup Instructions
Prerequisites

Node.js: v18 or later

npm: v9 or later

PostgreSQL: v14 or later

Git installed and configured

(Optional) Docker for local database setup

git clone 
npm install

Setup Environment Variables
.env
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

Setup the Database
npx prisma migrate dev
npx prisma generate

 Run the Server
 npm run dev

Production
npm run build
npm start


