import cors from 'cors';
import express from 'express';
import '#db';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from '#middlewares';
import {
  usersRouter,
  userProfilesRouter,
  /* completionsRouter,*/ authRouter,
  jobOffersRouter,
  chatUsersRouter
} from '#routes';
import { CLIENT_BASE_URL } from '#config';

const app = express();

const server = http.createServer(app);

//initiallize socket.io server
export const io = new Server(server, { cors: { origin: CLIENT_BASE_URL, methods: ['GET', 'POST'] } });

// store online users

export const userSocketMap: userSocketMapType = {}; //{userId: sockedId}

// socket .io connection handler
io.on('connection', socket => {
  const userId = socket.handshake.query.userId;
  console.log('user Connected', userId);

  if (userId) {
    userSocketMap.userId = socket.id;
  }

  //Emit online users to all connected
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User Disconnected', userId);
    delete userSocketMap.userId;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Middleware setup

app.use(express.json(), cookieParser());

app.use(
  cors({
    origin: CLIENT_BASE_URL, // for use with credentials, origin(s) need to be specified
    credentials: true, // sends and receives secure cookies
    exposedHeaders: ['WWW-Authenticate'] // needed to send the 'refresh trigger''
  })
);

app.use('/chats', chatUsersRouter);

app.use('/users', usersRouter);

app.use('/userProfiles', userProfilesRouter);

app.use('/jobOffers', jobOffersRouter);

app.use('/auth', authRouter);

// app.use('/ai', completionsRouter);

app.use('/*splat', notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`\x1b[34mServer listening on http://localhost:${port}\x1b[0m`));
