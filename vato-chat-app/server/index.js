import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import { requireAuth } from './middleware/auth.js';
import Message from './models/Message.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const CLIENT_ORIGIN = 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const io = new SocketIOServer(httpServer, {
  cors: { origin: CLIENT_ORIGIN, credentials: true }
});

io.on('connection', socket => {
  console.log('⚡ Socket connected:', socket.id);

  socket.on('joinRoom', ({ room }) => {
    socket.join(room);
    console.log(`➡️ ${socket.id} joined room ${room}`);
  });

  socket.on('sendMessage', async ({ room, content, senderId }) => {
    const msg = await Message.create({ room, content, sender: senderId });
    // ← updated populate call:
    const fullMsg = await msg.populate('sender', 'name');

    io.to(room).emit('newMessage', {
      _id:       fullMsg._id,
      room:      fullMsg.room,
      content:   fullMsg.content,
      sender:    fullMsg.sender,
      timestamp: fullMsg.timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log('🛑 Socket disconnected:', socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`🚀 API server listening on http://localhost:${PORT}`)
);