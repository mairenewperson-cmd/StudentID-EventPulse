require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');

const authRoutes = require('./routes/authroutes');
const eventRoutes = require('./routes/eventroutes');
const registrationRoutes = require('./routes/registrationroutes');
const announcementRoutes = require('./routes/annoucementroutes');
const categoryRoutes = require('./routes/categoryroutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io);

app.use(morgan('dev'));
app.use(express.json());

// SAFE SANITIZATION WRAPPER: Skips immutable req.query getter
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/categories', categoryRoutes);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('join-event', (eventId) => {
    socket.join(eventId);
  });
  socket.on('disconnect', () => {});
});

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = app;