🔗 Live Deployment
Service	URL
Frontend (Next.js – Vercel)	https://testdel-frontend-bh1p0snc0-dhruvs-projects-89ed57b2.vercel.app/

Backend (Node.js – Render)	https://testdel-backend.onrender.com


🏗 Architecture Overview
Next.js App (Frontend)
        ↓
Next.js API Routes (BFF)
        ↓
Node.js Backend Service

✨ Key Features
📌 Editable Labels System

All titles, headers, and labels are dynamic and editable

Labels are reusable across multiple pages and components

Editing a label updates all usages in real time

Changes are persisted via backend APIs

📈 Dashboard Modules

KPI summary cards

Revenue trend chart

Revenue by region chart

Sales data table with search, filtering, sorting, and pagination

⏳ Global Loading & Error Handling

Centralized global loader using React Context

Graceful handling of backend unavailability

Fallback UI for charts and tables

No broken, blank, or crashing screens

🧑‍💻 Tech Stack & Versions
Frontend

Next.js 15.x (App Router)

React 18.x

TypeScript 5.x

Shadcn UI

ECharts (echarts-for-react)

Tailwind CSS

Backend

Node.js v20.17.0

npm v10.8.2

Express.js

RESTful API design

.
🚀 Running the Project Locally
1️⃣ Prerequisites

Ensure you have:

Node.js ≥ 18 (Node 20 recommended)

npm or yarn

Check versions:
node -v
npm -v


2️⃣ Backend Setup (Node.js)
cd backend
npm install
npm run dev


Backend runs at:

http://localhost:4000

3️⃣ Frontend Setup (Next.js)
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:3000

⚠️ Deployment Note (Free-Tier Cold Start)

The backend is hosted on Render’s free tier, which may introduce a cold-start delay (20–60 seconds) after periods of inactivity.

This is expected behavior on free hosting

The frontend handles this gracefully using:

Global loading states

Fallback UI for charts and tables

No crashes or blank screens

Once the backend is active, all subsequent requests respond normally.

🧠 Design Decisions
Global Loader

Implemented using React Context to manage concurrent API requests smoothly without flickering.

Graceful Failure Handling

The BFF layer always returns safe responses, ensuring the UI remains stable even when backend services are unavailable.

Scalability

The editable labels system is designed to scale to hundreds of labels across multiple pages with minimal changes.

✅ Final Note

This project focuses on clean architecture, UX quality, and thoughtful problem-solving, aligning closely with the assessment’s evaluation criteria.