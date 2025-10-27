import type { RequestHandler } from 'express';
import { UserProfile } from '#models';

const hasRole1 = (...AllowRoles: string[]): RequestHandler => {
  return async (request, response, next) => {
    if (!request.user) {
      next(new Error('unauthorized', { cause: { status: 401 } }));
      return;
    }
    // console.log(request.user);
    const { id } = request.params;
    const { roles: userRoles, id: userId } = request.user;
    let userProfile: InstanceType<typeof UserProfile> | null = null;
    if (id) {
      userProfile = await UserProfile.findById(id);

      if (!userProfile) {
        next(new Error('userProfile not found', { cause: { status: 404 } }));
        return;
      }

      request.userProfile = userProfile;
    }
    // console.log(userProfile);
    if (userRoles.includes('admin')) {
      next();
    } else if (AllowRoles.includes('self')) {
      if (userId !== userProfile!.userId.toString()) {
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

export default hasRole1;
