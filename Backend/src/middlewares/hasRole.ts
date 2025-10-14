import type { RequestHandler } from 'express';
import { UserCard } from '#models';

const hasRole = (...AllowRoles: string[]): RequestHandler => {
  return async (request, response, next) => {
    if (!request.user) {
      next(new Error('unauthorized', { cause: { status: 401 } }));
      return;
    }
    // console.log(request.user);
    const { id } = request.params;
    const { roles: userRoles, id: userId } = request.user;
    let userCard: InstanceType<typeof UserCard> | null = null;

    if (id) {
      userCard = await UserCard.findById(id);
      if (!userCard) {
        next(new Error('post not found', { cause: { status: 404 } }));
        return;
      }

      request.userCard = userCard;
    }
    // console.log(userCard);
    if (userRoles.includes('admin')) {
      next();
    } else if (AllowRoles.includes('self')) {
      if (userId !== userCard?.userId.toString()) {
        next(new Error('Not authorized', { cause: { status: 403 } }));
        return;
      }
      next();
      return;
    }

    // check for other roles
    if (
      !AllowRoles.some(role => {
        return userRoles.includes(role);
      })
    ) {
      next(new Error('Role not allowes', { cause: { status: 403 } }));
    }
    next();
  };
};

export default hasRole;
