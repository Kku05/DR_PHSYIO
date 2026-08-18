# 📋 DR. PHYSIO - System & Environment Requirements

This document defines the formal software, hardware, runtime, network, and environmental requirements for running and developing **DR. PHYSIO**.

---

## 💻 1. Operating System & Platform Compatibility

| Platform | Minimum Version | Recommended Version | Architecture |
| :--- | :--- | :--- | :--- |
| **macOS** | macOS 12 Monterey | macOS 14 Sonoma / macOS 15 Sequoia | Apple Silicon (`arm64`: M1/M2/M3/M4) or Intel (`x86_64`) |
| **Linux** | Ubuntu 20.04 LTS / Debian 11 | Ubuntu 22.04+ LTS | `x86_64` or `aarch64` |
| **Windows** | Windows 10 (Build 19041+) | Windows 11 / WSL2 | `x64` |

---

## ⚙️ 2. Runtime & Dependency Requirements

| Component | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` (LTS) | `v20.x` or `v22.x` (LTS) | `node -v` |
| **npm** | `v9.0.0` | `v10.x` | `npm -v` |

### Production Dependencies (Node.js)
- `express` (`^4.17.1`): Core HTTP routing and static asset serving.
- `socket.io` (`^4.8.1`): Real-time signaling for WebRTC peer exchange, text chat, and file sharing.
- `nodemailer` (`^6.9.16`): SMTP email dispatch for OTP and appointment notifications.
- `node-schedule` (`^2.1.1`): Cron-like scheduling for hourly OTP rotation and pre-consultation reminders.
- `csv-writer` (`^1.6.0`): Tabular record persistence for booked appointments.
- `csv-parser` (`^3.2.0`): CSV parsing utilities.
- `open` (`^8.4.0`): Cross-platform browser launcher on server start.

---

## 🌐 3. Browser & Client Media Requirements

### Supported Web Browsers
- **Google Chrome / Chromium / Brave / Edge:** Version 90+ (Full WebRTC & MediaDevices API support).
- **Apple Safari:** Version 15+ (Requires camera/microphone permission allowance).
- **Mozilla Firefox:** Version 90+.

### Client Hardware Requirements
- **Webcam:** Built-in FaceTime HD camera or external USB UVC webcam.
- **Microphone & Speaker/Headset:** Built-in or external audio input/output devices.
- **RAM:** Minimum 4 GB (8 GB recommended for smooth video encoding/decoding).

---

## 🔒 4. Network, Firewall & Security Requirements

| Protocol / Port | Direction | Purpose | Notes |
| :--- | :--- | :--- | :--- |
| **HTTP (Port `3000`)** | Inbound | Web UI & REST APIs | Configurable via `PORT` environment variable |
| **WebSocket (`ws://` / `wss://`)** | Inbound / Outbound | Socket.IO signaling | Runs over HTTP server port |
| **UDP (STUN / WebRTC)** | Outbound | NAT traversal & ICE candidate exchange | Uses Google Public STUN (`stun:stun.l.google.com:19302`) on port `19302` |
| **SMTP (`smtp.gmail.com:465` / `587`)** | Outbound | Email delivery | Requires active internet connection |

---

## 🔐 5. Environment Variables Configuration

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `3000` | Port on which the Express & Socket.IO server listens |
| `NO_OPEN` | String | *(unset)* | Set to `1` or `true` to prevent auto-opening the browser (used for tests and headless CI) |
| `EMAIL_USER` | String | `106.nerd@gmail.com` | Gmail address used by Nodemailer to dispatch OTPs and confirmations |
| `EMAIL_PASS` | String | *(app-specific pass)* | 16-character Google App Password for the SMTP sender account |
| `DOCTOR_EMAIL` | String | `tirthnarwal5@gmail.com` | Notification recipient email for doctors |

---

## 🛡️ 6. Open Source Licensing & Compliance Matrix

All runtime and development dependencies utilized by this project are distributed under permissive open-source licenses:

| License Type | Dependency Count | Copyleft Obligation | Commercial / Private Use |
| :--- | :--- | :--- | :--- |
| **MIT License** | 91 packages | ❌ None | ✅ Allowed |
| **ISC License** | 2 packages | ❌ None | ✅ Allowed |
| **MIT-0 License** | 1 package | ❌ None | ✅ Allowed |
| **BSD-3-Clause** | 1 package | ❌ None | ✅ Allowed |

> [!NOTE]
> There are zero GPL, AGPL, or restrictive copyleft dependencies. The project can be distributed publicly on GitHub under the **MIT License** without licensing conflicts.
