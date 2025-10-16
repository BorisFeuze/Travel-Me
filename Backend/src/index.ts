import cors from 'cors';
import express from 'express';
import '#db';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from '#middlewares';
import { usersRouter, userProfilesRouter, completionsRouter, authRouter } from '#routes';
import { CLIENT_BASE_URL, BACKEND_USER_URL } from '#config';

const app = express();
const port = process.env.PORT || 8000;
// const port = BACKEND_USER_URL;

app.use(
  cors({
    origin: CLIENT_BASE_URL, // for use with credentials, origin(s) need to be specified
    credentials: true, // sends and receives secure cookies
    exposedHeaders: ['WWW-Authenticate'] // needed to send the 'refresh trigger''
  })
);
app.use(express.json(), cookieParser());

app.use('/users', usersRouter);

app.use('/userProfiles', userProfilesRouter);

app.use('/auth', authRouter);

app.use('/ai', completionsRouter);

app.use('/*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`\x1b[34mServer listening on http://localhost:${port}\x1b[0m`));
// app.listen(port, () => console.log(`\x1b[34mServer listening on ${port}\x1b[0m`));
