# 🩺 DR. PHYSIO - Tele-Physiotherapy Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v22%20LTS-green.svg)](https://nodejs.org/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Peer--to--Peer-blue.svg)](https://webrtc.org/)
[![macOS Compatible](https://img.shields.io/badge/macOS-Sonoma%20%7C%20Sequoia%20%7C%20Apple%20Silicon-orange.svg)](file:///Users/tirth/Downloads/my%20project/DR_PHSYIO_oldVersion/MAC_SETUP.md)

A full-stack Node.js and WebRTC-based tele-physiotherapy platform designed for seamless remote doctor-patient consultations, interactive video calls, automated appointment scheduling, and diagnosis sharing.

---

## 📋 Table of Contents
1. [🌟 Key Features](#-key-features)
2. [💻 System Requirements](#-system-requirements)
3. [🚀 Quickstart Guide](#-quickstart-guide)
4. [🧪 Testing & Verification](#-testing--verification)
5. [🔑 User Accounts & OTP Access](#-user-accounts--otp-access)
6. [📹 Camera & Microphone Permissions](#-camera--microphone-permissions)
7. [📁 Project Structure](#-project-structure)
8. [📜 License & Compliance](#-license--compliance)

---

## 🌟 Key Features

- **Peer-to-Peer Video Consultations (WebRTC):** Direct audio/video streaming between doctor and patient with camera switching (front/back/USB) and audio mute controls.
- **Dual Room Isolation (`web1` & `web2`):** Multi-room routing for Dr. Smith (Room 1) and Dr. Jones (Room 2) with room-scoped WebRTC signaling.
- **OTP Security Barrier:** Room access is protected by dynamic 6-digit OTPs generated on startup, rotated hourly, and dispatched 5 minutes prior to scheduled appointments.
- **Appointment Scheduling:** Interactive booking system with date/time collision prevention and persistence in `appointments.csv`.
- **In-Call Chat & Media Transfer:** Instant text messaging and image file sharing (up to 900KB) during live consultations.
- **User Authentication:** Sign up, login, session management, and password update functionality stored in `users.json`.
- **Patient Feedback System:** Feedback submission logged automatically with ISO timestamps to `feedback/feedback.txt`.
- **Post-Consultation Diagnosis:** Direct redirection upon call conclusion to diagnostic guides and physiotherapy exercises (`Dignosis.html`).

---

## 💻 System Requirements

- **Operating System:** macOS Monterey (12.0+), macOS Sonoma / Sequoia (Apple Silicon M1-M4 or Intel), Linux, or Windows 10/11.
- **Node.js:** `v18.0.0` or newer (Tested and verified on Node `v22.x LTS`).
- **Package Manager:** `npm` (`v9.x` or `v10.x`).
- **Web Browser:** Chrome 90+, Safari 15+, Edge 90+, or Firefox 90+ with WebRTC support.
- **Detailed Specifications:** See [REQUIREMENTS.md](file:///Users/tirth/Downloads/my%20project/DR_PHSYIO_oldVersion/REQUIREMENTS.md).

---

## 🚀 Quickstart Guide

### 1. Clone & Navigate to Project:
```bash
cd "/Users/tirth/Downloads/my project/DR_PHSYIO_oldVersion"
```

### 2. Install Dependencies:
```bash
npm run setup
```
*(Or `npm install`)*

### 3. Run Self-Checks & Tests:
```bash
npm test
```

### 4. Start the Application:
```bash
npm start
```
The server will start on port `3000` and automatically open `http://localhost:3000` in your default browser.

---

## 🧪 Testing & Verification

The project includes an assert-based zero-dependency self-test suite:
```bash
npm test
```
This tests server initialization, static routing (`/`, `/web1`, `/web2`), authentication flows (signup/login/password change), appointment scheduling, CSV writes, OTP verification, and feedback logging.

---

## 🔑 User Accounts & OTP Access

### Pre-Configured Test Accounts (`users.json`)

| Name | Email (Username) | Password |
| :--- | :--- | :--- |
| **tirth** | `tirthnarwal10@gmail.com` | `narwal10` |
| **tirth** | `tirthnarwal5@gmail.com` | `asdfghjkl` |
| **narwal** | `narwalkku8@gmail.com` | `asdfghjkl` |

### Room OTPs
- When the server starts, active 6-digit OTPs are printed to your terminal:
  ```text
  =========================================
  🔑 Active Room OTPs:
     👉 Room 1 (web1): 123456
     👉 Room 2 (web2): 654321
  =========================================
  ```
- Enter the corresponding OTP on the **Room** page (`/index.html`) to access Room 1 or Room 2.

---

## 📹 Camera & Microphone Permissions

When joining a video room, allow browser media permissions when prompted.
On macOS:
1. Open **System Settings** $\rightarrow$ **Privacy & Security**.
2. Enable your browser under **Camera** and **Microphone**.
3. For more details, consult [MAC_SETUP.md](file:///Users/tirth/Downloads/my%20project/DR_PHSYIO_oldVersion/MAC_SETUP.md).

---

## 📁 Project Structure

```text
DR_PHSYIO_oldVersion/
├── main.js                  # Main Express & Socket.IO signaling server
├── test.js                  # Zero-dependency assert test runner
├── package.json             # Root dependencies and npm scripts
├── users.json               # Local JSON user credential database
├── appointments.csv         # CSV database storing appointment bookings
├── LICENSE                  # Open-source MIT License
├── README.md                # Main project documentation
├── REQUIREMENTS.md          # Formal software and hardware specifications
├── MAC_SETUP.md             # macOS installation and troubleshooting guide
├── PROJECT_OVERVIEW.md      # Comprehensive architecture & API reference
├── feedback/                # Feedback storage directory
│   └── feedback.txt         # Timestamped patient feedback logs
├── public/                  # Main platform frontend pages
│   ├── front.html           # Landing page & About Us
│   ├── login.html           # Login & Sign Up page
│   ├── index.html           # Room selection & OTP entry
│   ├── appointment.html     # Doctor appointment booking
│   └── feedback.html        # User feedback form
├── web1/                    # Room 1 (Dr. Smith) application
│   └── public/
│       ├── index.html       # WebRTC video room interface
│       ├── Dignosis.html    # Diagnosis & exercise guide
│       ├── css/style.css    # Video call styling
│       └── js/main.js       # WebRTC peer connection logic
└── web2/                    # Room 2 (Dr. Jones) application
    └── public/
        ├── index.html       # WebRTC video room interface
        ├── Dignosis.html    # Diagnosis & exercise guide
        ├── css/style.css    # Video call styling
        └── js/main.js       # WebRTC peer connection logic
```

---

## 📜 License & Compliance

This project is licensed under the **[MIT License](file:///Users/tirth/Downloads/my%20project/DR_PHSYIO_oldVersion/LICENSE)**.

### Dependency License Audit
All third-party libraries used in this project are licensed under permissive open-source terms:
- **Express, Socket.IO, Nodemailer, Node-Schedule, CSV-Writer, Open:** MIT / ISC / BSD-3-Clause.
- **Zero Copyleft Restrictions:** No GPL, AGPL, or restrictive licenses are present. You are free to publish, host, and fork this project on GitHub without licensing violations.
