# SwasthyaLink 🏥

SwasthyaLink is a comprehensive healthcare management platform designed to bridge the gap between patients, doctors, and hospitals. It provides a seamless, real-time ecosystem for appointment scheduling, medical consultations, health record management, and emergency response.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Node](https://img.shields.io/badge/Node-20-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)

## 🚀 Key Features

### 👤 Patient Portal
- **Dashboard**: Overview of upcoming appointments and health status.
- **Smart Scheduling**: Book appointments with specialists based on availability.
- **Health Records**: Securely store and access medical history and lab results.
- **Real-time Chat**: Direct messaging with doctors for follow-ups.
- **Video Consultations**: Integrated WebRTC-based video calls for remote diagnosis.
- **Medication Tracker**: Stay on top of prescriptions with automated reminders.
- **Emergency SOS**: One-tap alert system for immediate medical assistance.
- **Insurance Claims**: Track and manage insurance claims directly from the app.

### 👨‍⚕️ Doctor Portal
- **Patient Management**: Centralized view of all patients and their history.
- **Appointment Queue**: Real-time management of daily consultation schedules.
- **Digital Prescriptions**: Issue and manage digital prescriptions instantly.
- **Telemedicine Hub**: Conduct video calls and chat with patients securely.
- **Lab Reviews**: Access and analyze patient lab results.

### 🏢 Hospital Administration
- **Staff Management**: Centralized directory of associated medical professionals.
- **Operational Oversight**: Monitor all appointments across the facility.
- **Bed Inventory**: Real-time tracking of bed availability (Private, Double, Triple sharing).
- **SOS Monitoring**: Central hub for receiving and acting on emergency alerts.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Zustand (State Management), Lucide React.
- **Backend**: Node.js, Express, Socket.io (Real-time).
- **Database**: MongoDB (Mongoose ODM).
- **Communication**: WebRTC (Video Calls), Socket.io (Signaling & Chat).
- **Security**: JWT Authentication, bcrypt password hashing, Helmet, CORS.

## 📦 Project Structure

```text
├── client/           # Frontend (React + Vite)
├── server/           # Backend (Node + Express)
├── public/           # Shared assets
├── .env              # Environment configurations
└── package.json      # Root dependencies and scripts
```

## ⚙️ Installation & Setup (Local Development)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/SwasthyaLink.git
   cd SwasthyaLink
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Environment Setup** — copy the example and fill in your values:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:5174
   NODE_ENV=development
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```
   The app will be at `http://localhost:5174` (client) and `http://localhost:8000` (API).

---

## 🚀 Production Deployment

### Option 1: Render (Recommended — Free Tier)

1. Push your project to GitHub.
2. Go to [Render.com](https://render.com) → **New Web Service**.
3. Connect your repository and set:
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
4. Add these **Environment Variables** in the Render dashboard:
   ```
   MONGO_URI=your_production_mongodb_atlas_uri
   JWT_SECRET=your_production_secret
   PORT=8000
   NODE_ENV=production
   CORS_ORIGIN=https://your-app-name.onrender.com
   ```
5. Deploy — the backend will serve the built React frontend automatically.

### Option 2: Docker

Build and run the full stack with a single command:
```bash
# Copy and configure your environment file first
cp .env.example .env

# Build and start all services
docker compose up --build
```
The app will be available at `http://localhost:8000`.

### Option 3: Manual Build + Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Build the React frontend
npm run build

# 3. Start the production server (serves the frontend + API)
npm start
```

---

## 🔒 Security

- **Strict Hospital Constraints**: New doctor registrations and hospital logins are restricted to a predefined list of recognized hospitals (Apollo, AIIMS, Fortis, Max, Manipal) to ensure data integrity.
- **JWT-based Auth**: Secure access across all three portals using industry-standard tokenization.

## 📄 License

This project is licensed under the ISC License.

---
Built with ❤️ during Hacksagon by Team SwasthyaLink.
