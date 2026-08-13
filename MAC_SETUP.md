# 🍏 macOS Setup & System Requirements Guide

This guide provides step-by-step instructions for configuring, running, and troubleshooting **DR. PHYSIO** on macOS (Apple Silicon M1/M2/M3/M4 and Intel Macs).

---

## 📋 System Requirements

| Requirement | Minimum Specification | Recommended |
| :--- | :--- | :--- |
| **Operating System** | macOS 12 Monterey | macOS 14 Sonoma / macOS 15 Sequoia |
| **Processor** | Apple Silicon (M1+) or Intel Core i5+ | Apple Silicon (M1/M2/M3/M4) |
| **Memory (RAM)** | 4 GB RAM | 8 GB+ RAM |
| **Node.js** | `v18.0.0` | `v20.x` or `v22.x` (LTS) |
| **npm** | `v9.0.0` | `v10.x` |
| **Browser** | Chrome 90+, Safari 15+, Firefox 90+ | Chrome or Safari with WebRTC support |
| **Hardware** | Built-in or USB Webcam & Microphone | FaceTime HD Camera + Built-in Mic |

---

## 🛠️ Step-by-Step macOS Setup

### 1. Check Node.js and npm Installation
Open **Terminal** (`Command + Space`, type `Terminal`, and press `Enter`):

```bash
node -v
npm -v
```

If Node.js is not installed, install it using [Homebrew](https://brew.sh):
```bash
brew install node
```

---

### 2. Navigate to Project Directory
```bash
cd "/Users/tirth/Downloads/my project/DR_PHSYIO_oldVersion"
```

---

### 3. Install Project Dependencies
Run the install command inside the project directory:
```bash
npm install
```

---

### 4. Grant macOS Camera & Microphone Permissions

WebRTC peer-to-peer video requires camera and microphone permissions on macOS.

1. Open **System Settings** (Apple Menu  $\rightarrow$ **System Settings**).
2. Go to **Privacy & Security** in the sidebar.
3. Click on **Camera**: Ensure your browser (e.g., Google Chrome or Safari) is toggled **ON**.
4. Click on **Microphone**: Ensure your browser is toggled **ON**.
5. When opening `http://localhost:3000` in the browser, click **"Allow"** when prompted for camera/mic access.

---

## 🚀 Running the Application

### Start the Server:
```bash
npm start
```

When started, your terminal will display:
```text
🩺 Main server running at http://localhost:3000

=========================================
🔑 Active Room OTPs:
   👉 Room 1 (web1): 482910
   👉 Room 2 (web2): 839201
=========================================
```
The application will automatically open `http://localhost:3000` in your default browser.

### Stop the Server:
Press `Ctrl + C` in the Terminal window.

---

## 🔧 macOS Troubleshooting & FAQ

### Port 3000 is already in use (`EADDRINUSE`)
If another background process is using port 3000, kill it using:
```bash
lsof -ti :3000 | xargs kill -9
```
Then run `npm start` again.

### Camera / Microphone not loading in Video Room
- Ensure no other app (FaceTime, Zoom, Photobooth) is locking the webcam.
- In Chrome, click the camera icon on the right side of the URL address bar and verify that the correct camera input is selected.
- In Safari, go to **Safari $\rightarrow$ Settings $\rightarrow$ Websites $\rightarrow$ Camera** and set `localhost` to **Allow**.

### File not found error (`ENOENT: no such file or directory`)
Ensure you are inside the `DR_PHSYIO_oldVersion` subfolder and not the parent `my project` directory before running `npm start`.
