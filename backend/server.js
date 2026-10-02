const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const dns = require('dns');
const net = require('net');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const customerRoutes = require('./routes/customerRoutes');
const staffRoutes = require('./routes/staffRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json());

// Make io accessible in routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/api/db-debug', async (req, res) => {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 3306);
  const result = {
    host,
    port,
    dnsResolved: false,
    dnsAddress: null,
    tcpConnected: false,
    error: null
  };

  try {
    const address = await new Promise((resolve, reject) => {
      dns.lookup(host, (err, address) => {
        if (err) reject(err);
        else resolve(address);
      });
    });
    result.dnsAddress = address;
    result.dnsResolved = true;

    await new Promise((resolve, reject) => {
      const socket = new net.Socket();
      socket.setTimeout(5000);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('TCP connection timed out'));
      });
      socket.on('error', (err) => {
        socket.destroy();
        reject(err);
      });
      socket.connect(port, host);
    });
    result.tcpConnected = true;
  } catch (err) {
    result.error = err.message;
  }
  res.json(result);
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/customers', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Forward these events to all other connected clients
  const events = ['order_status_update', 'new_order', 'table_status_update', 'notification'];
  events.forEach(event => {
    socket.on(event, (data) => {
      socket.broadcast.emit(event, data);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
