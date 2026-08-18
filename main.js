import express from 'express';
import { createServer } from 'http';
import nodemailer from 'nodemailer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
import { Server } from 'socket.io';
import { existsSync } from 'fs';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { createObjectCsvWriter } from 'csv-writer';
import schedule from 'node-schedule';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = createServer(app);
const mainPort = process.env.PORT || 3000;
const USERS_FILE = join(__dirname, 'users.json');
const sessions = {};
const io = new Server(server);
const roomOTPs = {
  web1: '',
  web2: ''
};
const rooms = {
  web1: {},
  web2: {}
};

const SENDER_EMAIL = process.env.EMAIL_USER || '106.nerd@gmail.com';
const SENDER_PASS = process.env.EMAIL_PASS || 'qpwp hwvg jzhs thqr';
const DOCTOR_EMAIL = process.env.DOCTOR_EMAIL || 'tirthnarwal5@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASS
  }
});

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to generate and send OTPs
function generateAndSendOTPs() {
  roomOTPs.web1 = generateOTP();
  roomOTPs.web2 = generateOTP();

  console.log(`\n=========================================`);
  console.log(`🔑 Active Room OTPs:`);
  console.log(`   👉 Room 1 (web1): ${roomOTPs.web1}`);
  console.log(`   👉 Room 2 (web2): ${roomOTPs.web2}`);
  console.log(`=========================================\n`);

  const mailOptions = {
    from: SENDER_EMAIL,
    to: DOCTOR_EMAIL,
    subject: 'New Room OTPs',
    text: `New OTPs for rooms:\nRoom 1: ${roomOTPs.web1}\nRoom 2: ${roomOTPs.web2}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email (network/auth):', error.message);
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
}

// Schedule OTP generation every hour from 8:59 AM to 9:59 PM
for (let hour = 8; hour <= 21; hour++) {
  schedule.scheduleJob({ hour, minute: 50 }, generateAndSendOTPs);
}

// ...existing code...

// In-memory storage for appointments
const appointments = [];

// CSV writer setup
const csvWriter = createObjectCsvWriter({
  path: join(__dirname, 'appointments.csv'),
  header: [
    { id: 'doctor', title: 'Doctor' },
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'date', title: 'Date' },
    { id: 'time', title: 'Time' }
  ],
  append: true // Append to the file if it exists
});
// ...existing code...

// ...existing code...

// Handle appointment booking
app.post('/appointment', async (req, res) => {
  const { doctor, name, email, date, time } = req.body;

  // Check if the slot is already booked for the selected doctor
  const isSlotTaken = appointments.some(appointment => appointment.doctor === doctor && appointment.date === date && appointment.time === time);

  if (isSlotTaken) {
    return res.json({ success: false, message: 'Time slot is already booked for the selected doctor.' });
  }

  // Save the appointment in memory
  const appointment = { doctor, name, email, date, time };
  appointments.push(appointment);

  // Write the appointment to the CSV file
  try {
    await csvWriter.writeRecords([appointment]);
    console.log('Appointment saved to CSV file.');
  } catch (error) {
    console.error('Error writing to CSV file:', error);
    return res.json({ success: false, message: 'Error saving appointment.' });
  }

  // Determine the room based on the doctor
  const doctorEmails = {
    dr_smith: DOCTOR_EMAIL,
    dr_jones: DOCTOR_EMAIL
  };
  const room = doctor === 'dr_smith' ? 'web1' : 'web2';
  const doctorEmail = doctorEmails[doctor];
  const doctorName = doctor === 'dr_smith' ? 'Dr. Smith' : 'Dr. Jones';

  // Send confirmation email to the user
  const userMailOptions = {
    from: SENDER_EMAIL,
    to: email,
    subject: 'Appointment Confirmation',
    text: `Dear ${name},\n\nYour appointment with ${doctorName} is confirmed for ${date} at ${time}.\n\nThank you!`
  };

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email to user:', error);
    } else {
      console.log('Confirmation email sent to user:', info.response);
    }
  });

  // Send confirmation email to the doctor
  const doctorMailOptions = {
    from: SENDER_EMAIL,
    to: doctorEmail,
    subject: 'New Appointment Booked',
    text: `Dear ${doctorName},\n\nA new appointment has been booked by ${name} for ${date} at ${time}.\n\nThank you!`
  };

  transporter.sendMail(doctorMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email to doctor:', error);
    } else {
      console.log('Confirmation email sent to doctor:', info.response);
    }
  });

  // Schedule OTP email to be sent 5 minutes before the appointment time
  const [hour, minute] = time.split(':').map(Number);
  const appointmentDate = new Date(date);
  appointmentDate.setHours(hour, minute - 5, 0, 0); // Schedule 5 minutes before the appointment time

  schedule.scheduleJob(appointmentDate, () => {
    const otp = roomOTPs[room];
    const otpMailOptions = {
      from: SENDER_EMAIL,
      to: `${email}, ${doctorEmail}`,
      subject: 'Room OTP',
      text: `Dear ${name},\n\nYour OTP for the room ${room} is ${otp}.`
    };

    transporter.sendMail(otpMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
      } else {
        console.log('OTP email sent:', info.response);
      }
    });
  });

  // Check for concurrent bookings and cancel one if detected
  const concurrentBookings = appointments.filter(appointment => appointment.doctor === doctor && appointment.date === date && appointment.time === time);
  if (concurrentBookings.length > 1) {
    const canceledAppointment = concurrentBookings.pop(); // Remove the last booked appointment
    appointments.splice(appointments.indexOf(canceledAppointment), 1); // Remove from appointments array

    // Send cancellation email to the user
    const cancellationMailOptions = {
      from: SENDER_EMAIL,
      to: canceledAppointment.email,
      subject: 'Appointment Canceled',
      text: `Dear ${canceledAppointment.name},\n\nYour appointment with ${doctorName} on ${date} at ${time} has been canceled due to multiple bookings. Please book again.\n\nThank you!`
    };

    transporter.sendMail(cancellationMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending cancellation email:', error);
      } else {
        console.log('Cancellation email sent:', info.response);
      }
    });
  }

  res.json({ success: true });
});

// ...existing code...
// Add this endpoint to fetch booked appointments
app.get('/appointments', (req, res) => {
  const { doctor, date } = req.query;
  const bookedAppointments = appointments.filter(appointment => appointment.doctor === doctor && appointment.date === date);
  res.json(bookedAppointments);
});

// Add OTP verification endpoint
app.post('/verify-otp', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ success: false, error: 'Missing request body' });
  }
  const { room, otp } = req.body;
  if (!room || !otp) {
    return res.status(400).json({ success: false, error: 'Missing room or OTP' });
  }
  if (roomOTPs[room] === otp) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

async function loadUsers() {
  try {
    const data = await readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save users to file
async function saveUsers(users) {
  await writeFile(USERS_FILE, JSON.stringify(users));
}

// Add these routes
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const users = await loadUsers();

  if (users[email]) {
    res.json({ success: false, message: 'Email already exists' });
    return;
  }

  users[email] = { name, password };
  await saveUsers(users);
  res.json({ success: true });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await loadUsers();

  if (users[email] && users[email].password === password) {
    const sessionId = Math.random().toString(36).substring(7);
    sessions[sessionId] = { email, name: users[email].name };

    res.json({
      success: true,
      sessionId,
      user: {
        name: users[email].name,
        email: email
      }
    });
  } else {
    res.json({ success: false });
  }
});

// Add logout endpoint
app.post('/logout', (req, res) => {
  res.json({ success: true });
});

// Change password endpoint
app.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const users = await loadUsers();
    if (users[email] && users[email].password === currentPassword) {
      users[email].password = newPassword;
      await saveUsers(users);
      return res.json({ success: true });
    }
    res.json({ success: false, message: 'Invalid current password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  let currentRoom = null;

  socket.on('join-user', (data) => {
    const { username, room } = data;
    currentRoom = room;
    rooms[currentRoom][username] = { username, id: socket.id };
    socket.join(currentRoom);
    io.to(currentRoom).emit('joined', rooms[currentRoom]);
  });

  socket.on("offer", ({ from, to, offer }) => {
    if (rooms[currentRoom][to]) {
      io.to(rooms[currentRoom][to].id).emit("offer", { from, to, offer });
    }
  });

  socket.on("answer", ({ from, to, answer }) => {
    if (rooms[currentRoom][from]) {
      io.to(rooms[currentRoom][from].id).emit("answer", { from, to, answer });
    }
  });

  socket.on("chat-message", ({ from, to, message, room }) => {
    if (rooms[room][to]) {
      io.to(rooms[room][to].id).emit("chat-message", { from, message });
    }
  });

  socket.on("file-message", ({ from, to, file, fileName, fileType, room }) => {
    if (rooms[room][to]) {
      io.to(rooms[room][to].id).emit("file-message", {
        from,
        fileName,
        file,
        fileType
      });
    }
  });

  // For end-call event
  socket.on("end-call", ({ from, to }) => {
    if (currentRoom && rooms[currentRoom]?.[to]) {
      io.to(rooms[currentRoom][to].id).emit("end-call", { from, to });
    }
  });

  socket.on("call-ended", (caller) => {
    if (caller && caller.length === 2) {
      caller.forEach(username => {
        // Check both rooms for the user
        Object.keys(rooms).forEach(room => {
          if (rooms[room][username]) {
            io.to(rooms[room][username].id).emit("call-ended", caller);
          }
        });
      });
    }
  });

  // In main.js
  socket.on('icecandidate', ({ candidate, to }) => {
    if (currentRoom && rooms[currentRoom]?.[to]) {
      io.to(rooms[currentRoom][to].id).emit('icecandidate', candidate);
    }
  });

  socket.on('disconnect', () => {
    if (!currentRoom) return;
    for (let username in rooms[currentRoom]) {
      if (rooms[currentRoom][username].id === socket.id) {
        delete rooms[currentRoom][username];
        break;
      }
    }
    io.to(currentRoom).emit('user-disconnected', rooms[currentRoom]);
  });
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'front.html'));
});

app.post('/feedback', async (req, res) => {
  try {
    const { feedback } = req.body;
    const feedbackDir = join(__dirname, 'feedback');
    const feedbackPath = join(feedbackDir, 'feedback.txt');

    if (!existsSync(feedbackDir)) {
      await mkdir(feedbackDir, { recursive: true });
    }

    // Append feedback with timestamp
    const feedbackEntry = `${new Date().toISOString()}: ${feedback}\n`;
    await writeFile(feedbackPath, feedbackEntry, { flag: 'a' });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use(express.static(join(__dirname, 'public')));
app.use('/web1', express.static(join(__dirname, 'web1/public')));
app.use('/web2', express.static(join(__dirname, 'web2/public')));
app.use('/socket.io', express.static(join(__dirname, 'node_modules/socket.io/client-dist')));

const createWebRoutes = (webName, port) => {
  const webPath = join(__dirname, webName);
  app.use(`/${webName}`, express.static(join(webPath, 'public')));
  app.get(`/${webName}`, (req, res) => {
    res.sendFile(join(webPath, 'public', 'index.html'));
  });
};

createWebRoutes('web1', 9001);
createWebRoutes('web2', 9002);
server.listen(mainPort, () => {
  console.log(`🩺 Main server running at http://localhost:${mainPort}`);
  generateAndSendOTPs();
  if (!process.env.NO_OPEN) {
    open(`http://localhost:${mainPort}`);
  }
});