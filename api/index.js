import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import chatRouter from './routes/chat.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import Chat from './models/chat.model.js'; 

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
});

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173' }));

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('user online', (user) => {
    onlineUsers.set(socket.id, user);
    io.emit('online users', Array.from(onlineUsers.values()));
  });

  socket.on('chat message', async (msg) => {
    const timestamp = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    const newMessage = new Chat({ ...msg, timestamp });
    await newMessage.save();
    io.emit('chat message', { ...msg, timestamp });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('online users', Array.from(onlineUsers.values()));
    console.log('user disconnected');
  });
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/chat', chatRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
