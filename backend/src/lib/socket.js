import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});


export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Retrieve the socket ID for the given user ID
}

const userSocketMap = {}; // Store userId to socketId mapping
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id; // Store the mapping
    console.log('User connected:', userId, 'Socket ID:', socket.id);
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Emit the online users to all clients
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    delete userSocketMap[userId]; // Remove the mapping on disconnect
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Emit the updated online users to all clients
  });

  // You can add more event listeners here
});
export { io, app, server };
