import { Router } from 'express';
import { login, logout, me, refresh, register } from '#controllers';
import { validateZod } from '#middlewares';
import { loginSchema, registerAuthSchema } from '#schemas';

const authRouter = Router();

authRouter.post('/register', validateZod(registerAuthSchema, 'body'), register);

authRouter.post('/login', validateZod(loginSchema, 'body'), login);

authRouter.post('/refresh', refresh);

authRouter.delete('/logout', logout);

authRouter.get('/me', me);

export default authRouter;
