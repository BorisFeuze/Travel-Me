import { Router } from 'express';
import { validateZod, authenticate } from '#middlewares';
import { getUsersToChatWith, getChats, markChatAsSeen, sendChat } from '#controllers';
import { chatUsersInputSchema, paramSchema } from '#schemas';

const chatUsersRouter = Router();

chatUsersRouter.route('/').get(authenticate('strict'), getUsersToChatWith);
chatUsersRouter.route('/mark/:id').get(authenticate('strict'), validateZod(paramSchema, 'params'), markChatAsSeen);
chatUsersRouter
  .route('/send/:id')
  .post(
    authenticate('strict'),
    validateZod(paramSchema, 'params'),
    validateZod(chatUsersInputSchema, 'body'),
    sendChat
  );
chatUsersRouter.route('/:id').get(authenticate('strict'), validateZod(paramSchema, 'params'), getChats);

export default chatUsersRouter;
