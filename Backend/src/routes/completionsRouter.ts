import { Router } from 'express';
import {
  createSimpleChatCompletion,
  createChatCompletion,
  createPersonalizedChatCompletion,
  getChatHistory
} from '#controllers';
import { validateZod, authenticate } from '#middlewares';
import { promptBodySchema } from '#schemas';

const completionsRouter = Router();
completionsRouter.get('/history/:id', getChatHistory);

completionsRouter.use(validateZod(promptBodySchema, 'body'));
completionsRouter.post('/simple-chat', createSimpleChatCompletion);
completionsRouter.post('/chat', createChatCompletion);
completionsRouter.post('/agent', authenticate, createPersonalizedChatCompletion);

export default completionsRouter;
