import type { RequestHandler } from 'express';
import { JobOffer } from '#models';

const hasRole2 = (...AllowRoles: string[]): RequestHandler => {
  return async (request, response, next) => {
    if (!request.user) {
      next(new Error('unauthorized', { cause: { status: 401 } }));
      return;
    }
    // console.log(request.user);
    const { id } = request.params;
    const { roles: userRoles, id: userId } = request.user;
    let jobOffer;

    if (id) {
      jobOffer = await JobOffer.findById(id).populate('userProfileId', 'userId');

      console.log(jobOffer);

      if (!jobOffer) {
        next(new Error('jobOffer not found', { cause: { status: 404 } }));
        return;
      }

      request.jobOffer = jobOffer;
    }
    // console.log(jobOffer);
    if (userRoles.includes('admin')) {
      next();
    } else if (AllowRoles.includes('self')) {
      if (userId !== jobOffer!.userProfileId.userId.toString()) {
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

export default hasRole2;
