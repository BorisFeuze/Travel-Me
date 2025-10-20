import http from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();

const server = http.createServer(app);

//initiallize socket.io server
export const io = new Server(server, { cors: { origin: '*' } });

// store online users

export const userSocketMap: userSocketMapType = {}; //{userId: sockedId}

// socket .io connection handler
io.on('connection', socket => {
  const userId = socket.handshake.query.userId;
  console.log('user Connected', userId);

  if (userId) {
    userSocketMap.userId = socket.id;
  }
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User Disconnected', userId);
    delete userSocketMap.userId;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export * from './tools.ts';
