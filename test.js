import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const PORT = 3098;
const BASE_URL = `http://localhost:${PORT}`;

console.log('🚀 Starting DR. PHYSIO self-check on macOS...');

const proc = spawn('node', ['main.js'], {
  env: { ...process.env, PORT: String(PORT), NO_OPEN: '1' },
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverReady = false;
let output = '';

proc.stdout.on('data', (d) => {
  output += d.toString();
  if (output.includes('Main server running')) {
    serverReady = true;
  }
});

// Wait for server ready
for (let i = 0; i < 40; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 100));
}

assert.ok(serverReady, 'Server failed to start in time');

try {
  // 1. Root route
  const resRoot = await fetch(`${BASE_URL}/`);
  assert.equal(resRoot.status, 200, 'Root endpoint should return 200');
  const textRoot = await resRoot.text();
  assert.ok(textRoot.includes('DR.PHYSIO'), 'Root page should contain DR.PHYSIO');

  // 2. Room routes
  const resWeb1 = await fetch(`${BASE_URL}/web1/`);
  assert.equal(resWeb1.status, 200, 'web1 route should return 200');

  const resWeb2 = await fetch(`${BASE_URL}/web2/`);
  assert.equal(resWeb2.status, 200, 'web2 route should return 200');

  // 3. Auth signup & login
  const testEmail = `test_${Date.now()}@example.com`;
  const resSignup = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Mac Tester', email: testEmail, password: 'secretpassword' })
  });
  const signupData = await resSignup.json();
  assert.equal(signupData.success, true, 'Signup should succeed');

  const resLogin = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'secretpassword' })
  });
  const loginData = await resLogin.json();
  assert.equal(loginData.success, true, 'Login should succeed');
  assert.equal(loginData.user.name, 'Mac Tester');

  // 4. Change password
  const resPwd = await fetch(`${BASE_URL}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, currentPassword: 'secretpassword', newPassword: 'newsecretpassword' })
  });
  const pwdData = await resPwd.json();
  assert.equal(pwdData.success, true, 'Change password should succeed');

  // 5. Book Appointment
  const resAppt = await fetch(`${BASE_URL}/appointment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doctor: 'dr_smith',
      name: 'Mac Tester',
      email: testEmail,
      date: '2026-09-01',
      time: '10:00'
    })
  });
  const apptData = await resAppt.json();
  assert.equal(apptData.success, true, 'Appointment booking should succeed');

  // 6. Query appointments
  const resQuery = await fetch(`${BASE_URL}/appointments?doctor=dr_smith&date=2026-09-01`);
  const queryData = await resQuery.json();
  assert.ok(Array.isArray(queryData) && queryData.length > 0, 'Appointments query should return booked slot');

  // 7. Verify OTP endpoint (rejection of wrong OTP)
  const resOtp = await fetch(`${BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room: 'web1', otp: '000000' })
  });
  const otpData = await resOtp.json();
  assert.equal(otpData.success, false, 'Invalid OTP should fail');

  // 8. Submit feedback
  const resFeedback = await fetch(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback: 'Test feedback from macOS test runner' })
  });
  const fbData = await resFeedback.json();
  assert.equal(fbData.success, true, 'Feedback submission should succeed');

  console.log('✅ All DR. PHYSIO self-checks passed successfully on macOS!');
} finally {
  proc.kill('SIGTERM');
}
