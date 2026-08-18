# 🩺 DR. PHYSIO - Comprehensive Project Overview

## 📖 Executive Summary
**DR. PHYSIO** is a full-stack tele-health and physiotherapy platform enabling secure doctor-patient video consultations, automated appointment booking with CSV persistence, dynamic room OTP access control, patient authentication, real-time messaging, file exchange, and post-consultation diagnosis resources.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Web Browser Client (Patient / Doctor)] -->|HTTP / REST API| ExpressServer[Node.js Express Server]
    Client -->|WebSocket / Signaling| SocketServer[Socket.IO Server]
    Client <-->|WebRTC Peer-to-Peer Media Stream| WebRTCPeer[Remote Patient/Doctor Video Stream]
    
    ExpressServer --> AuthStore[(users.json - Auth DB)]
    ExpressServer --> ApptStore[(appointments.csv - Booking DB)]
    ExpressServer --> FeedbackStore[(feedback.txt - Feedback Logs)]
    ExpressServer --> Mailer[Nodemailer / Gmail SMTP]
    ExpressServer --> Scheduler[Node-Schedule Cron Engine]
    ExpressServer --> TestRunner[test.js - Assert-Based Self-Check]
```

---

## 🔑 Core Features & Modules

### 1. WebRTC Peer-to-Peer Video Calling
- **Technology:** WebRTC `RTCPeerConnection` with Google Public STUN servers (`stun:stun.l.google.com:19302`).
- **Features:**
  - Real-time video/audio streaming with low latency.
  - Multi-camera support (switch between front/back or external USB webcams).
  - Audio mute/unmute and video enable/disable controls.
  - Automatic call termination with graceful redirection to post-consultation diagnosis (`Dignosis.html`).

### 2. Multi-Room Management (`web1` & `web2`)
- **Room 1 (`/web1`):** Dedicated consultation room for Dr. Smith.
- **Room 2 (`/web2`):** Dedicated consultation room for Dr. Jones.
- **Signaling Isolation:** Signaling (`offer`, `answer`, `icecandidate`, `end-call`) and chat events are scoped to individual rooms via Socket.IO rooms.

### 3. Dynamic OTP Security System
- **Generation:** 6-digit random numeric codes generated on server boot and hourly.
- **Pre-appointment Trigger:** 5 minutes before any booked appointment, an OTP email is dispatched to both patient and doctor.
- **Access Barrier:** Users must verify their OTP via `/verify-otp` before entering any video room.

### 4. Appointment Booking & Management
- **Persistence:** Appointments are recorded in `appointments.csv`.
- **Validation:** Automatic collision detection prevents double-booking for the same doctor, date, and time slot.
- **Confirmation:** Dispatches automated email confirmations to both doctor and patient upon successful booking.

### 5. In-Call Messaging & Media Exchange
- **Live Text Chat:** Instant text messaging between doctor and patient during calls.
- **Image File Transfer:** Direct image file sharing (up to 900KB) with instant preview and download links.

### 6. User Authentication & Profile
- **Storage:** Stored locally in `users.json`.
- **Capabilities:** User Sign Up, Login with session ID generation, Logout, and Password Updates (`/change-password`).

### 7. Zero-Dependency Self-Testing Pipeline
- **Script:** `test.js` (`npm test`)
- **Implementation:** Uses Node.js standard libraries (`node:assert`, `node:child_process`, `fetch`) to validate all HTTP routes, authentication flows, CSV persistence, and OTP endpoints without external testing frameworks.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | `{ name, email, password }` |
| `POST` | `/login` | Authenticate existing user | `{ email, password }` |
| `POST` | `/change-password` | Update user password | `{ email, currentPassword, newPassword }` |
| `POST` | `/logout` | Invalidate current session | — |
| `POST` | `/appointment` | Book doctor consultation | `{ doctor, name, email, date, time }` |
| `GET` | `/appointments` | Query booked time slots | `?doctor=dr_smith&date=2026-08-15` |
| `POST` | `/verify-otp` | Validate room entry OTP | `{ room, otp }` |
| `POST` | `/feedback` | Submit patient feedback | `{ name, email, feedback }` |

---

## 🗄️ Data Storage Specifications

### 1. `users.json`
Key-value store mapping user email addresses to their credentials:
```json
{
  "tirthnarwal10@gmail.com": {
    "name": "tirth",
    "password": "narwal10"
  }
}
```

### 2. `appointments.csv`
Tabular appointment logs containing:
- `Doctor` (e.g. `dr_smith`, `dr_jones`)
- `Name` (Patient name)
- `Email` (Patient email)
- `Date` (YYYY-MM-DD)
- `Time` (HH:MM)

### 3. `feedback/feedback.txt`
Appended logs with ISO timestamps:
```text
2026-08-18T06:00:00.000Z: Great consultation experience with Dr. Smith.
```

---

## 👥 Pre-Configured Test Accounts

| Name | Email / Username | Password |
| :--- | :--- | :--- |
| **tirth** | `tirthnarwal10@gmail.com` | `narwal10` |
| **tirth** | `tirthnarwal5@gmail.com` | `asdfghjkl` |
| **narwal** | `narwalkku8@gmail.com` | `asdfghjkl` |

---

## 📜 Licensing & Legal Compliance

- **Project License:** [MIT License](file:///Users/tirth/Downloads/my%20project/DR_PHSYIO_oldVersion/LICENSE)
- **Dependency Audit:** All dependencies (`express`, `socket.io`, `nodemailer`, `node-schedule`, `csv-writer`, `csv-parser`, `open`) are licensed under permissive open-source licenses (MIT, ISC, BSD-3-Clause).
- **Compliance Status:** Fully compliant. No GPL/AGPL copyleft restrictions exist in the dependency tree.
