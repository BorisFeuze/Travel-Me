import type { RequestHandler } from 'express';
import { JobOffer } from '#models';

const hasRole2 = (...allowedRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new Error('Unauthorized', { cause: { status: 401 } }));
      }

      const { id } = req.params;
      const { roles: userRoles, id: userId } = req.user;
      let jobOffer;

      // Wenn eine JobOffer-ID vorhanden ist, laden wir das Angebot
      if (id) {
        jobOffer = await JobOffer.findById(id).populate('userProfileId', 'userId');

        if (!jobOffer) {
          return next(new Error('Job offer not found', { cause: { status: 404 } }));
        }

        req.jobOffer = jobOffer;
      }

      // Admin darf immer
      if (userRoles.includes('admin')) {
        return next();
      }

      // Self-Check: erlaubt, wenn 'self' in allowedRoles ist
      if (allowedRoles.includes('self')) {
        if (!jobOffer) {
          return next(new Error('Job offer has no owner', { cause: { status: 403 } }));
        }

        // Prüfe Owner-ID: funktioniert auch ohne populate
        const ownerId = jobOffer.userProfileId._id
          ? jobOffer.userProfileId._id.toString()
          : jobOffer.userProfileId.toString();

        if (userId !== ownerId) {
          return next(new Error('Not authorized', { cause: { status: 403 } }));
        }

        return next();
      }

      const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasAllowedRole) {
        return next(new Error('Role not allowed', { cause: { status: 403 } }));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default hasRole2;
