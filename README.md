# 🩺 DR. PHYSIO - Tele-Physiotherapy Platform

A full-stack Node.js and WebRTC-based tele-physiotherapy platform designed for seamless remote doctor-patient consultations, appointment scheduling, and diagnosis sharing.

---

## 📋 Table of Contents
1. [Project Overview & Key Features](#-project-overview--key-features)
2. [macOS System Requirements](#-macos-system-requirements)
3. [macOS Quickstart Guide](#-macos-quickstart-guide)
4. [User Accounts & OTP Access](#-user-accounts--otp-access)
5. [macOS Camera & Microphone Permissions](#-macos-camera--microphone-permissions)
6. [Project Structure](#-project-structure)
7. [Git Workflow on macOS](#-git-workflow-on-macos)

---

## 🌟 Project Overview & Key Features

- **Peer-to-Peer Video Consultations (WebRTC):** Direct audio/video streaming between doctor and patient with camera switching and audio mute controls.
- **Dual Room Support (`web1` & `web2`):** Multi-room routing for Dr. Smith (Room 1) and Dr. Jones (Room 2).
- **OTP Security System:** Room access is protected by dynamic 6-digit OTPs generated on startup, hourly, and 5 minutes prior to scheduled appointments.
- **Appointment Scheduling:** Interactive booking system with date/time availability checks and persistence in `appointments.csv`.
- **Live In-Call Chat & File Sharing:** Real-time text chat and image file sharing (up to 900KB) during video calls.
- **User Authentication:** Sign up, login, session management, and password update functionality stored in `users.json`.
- **Feedback System:** Patient feedback submission logged automatically with timestamps to `feedback/feedback.txt`.

---

## 💻 macOS System Requirements

- **Operating System:** macOS Monterey (12.0) or newer (Apple Silicon M1/M2/M3/M4 or Intel).
- **Node.js:** `v18.0.0` or newer (Tested and verified on Node `v22.x`).
- **Package Manager:** `npm` (`v9.x` or `v10.x`).
- **Web Browser:** Google Chrome, Safari, Brave, or Firefox with WebRTC support.
- **Default Port:** `3000` (Can be customized via `PORT=3000`).

---

## 🚀 macOS Quickstart Guide

### 1. Open Terminal and navigate to the project directory:
```bash
cd "/Users/tirth/Downloads/my project/DR_PHSYIO_oldVersion"
```

### 2. Install Dependencies (First time only):
```bash
npm install
```

### 3. Start the Application:
```bash
npm start
```
The server will boot up and automatically launch `http://localhost:3000` in your default macOS browser.

---

## 🔑 User Accounts & OTP Access

### Registered Test Accounts (`users.json`)
You can log in with any of the following accounts or click **Sign Up** on the login page:

| Name | Email (Username) | Password |
| :--- | :--- | :--- |
| **tirth** | `tirthnarwal10@gmail.com` | `narwal10` |
| **tirth** | `tirthnarwal5@gmail.com` | `asdfghjkl` |
| **narwal** | `narwalkku8@gmail.com` | `asdfghjkl` |

### Room OTPs
- When `npm start` is executed, the active 6-digit OTPs are automatically generated and **printed in the macOS Terminal**:
  ```text
  =========================================
  🔑 Active Room OTPs:
     👉 Room 1 (web1): 123456
     👉 Room 2 (web2): 654321
  =========================================
  ```
- Enter the corresponding OTP on the **Room** page (`/index.html`) to access Room 1 or Room 2.

---

## 📹 macOS Camera & Microphone Permissions

When you first join a video room, your browser will ask for camera and microphone permissions:

1. Click **"Allow"** when prompted in the browser.
2. If video does not appear, ensure macOS system-level permissions are granted:
   - Open **System Settings** (Apple menu  $\rightarrow$ System Settings).
   - Go to **Privacy & Security** $\rightarrow$ **Camera** and enable your browser.
   - Go to **Privacy & Security** $\rightarrow$ **Microphone** and enable your browser.

---

## 📁 Project Structure

```text
DR_PHSYIO_oldVersion/
├── main.js                  # Main Express & Socket.IO backend server
├── package.json             # Root dependencies and scripts
├── users.json               # Local JSON user credential database
├── appointments.csv         # CSV database storing appointment bookings
├── .gitignore               # Configured with macOS (.DS_Store) & env rules
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

## 🛠️ Git Workflow on macOS

### Check status:
```bash
git status
```

### Save and push changes to a feature branch:
```bash
# 1. Create and switch to a branch
git checkout -b update-feature

# 2. Stage all updated files
git add .

# 3. Commit with a message
git commit -m "Update project for macOS compatibility"

# 4. Push to GitHub
git push origin update-feature
```
