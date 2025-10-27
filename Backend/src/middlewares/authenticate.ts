import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET } from '#config';

const authenticate =
  (strictLevel: 'strict' | 'lax'): RequestHandler =>
  (req, _res, next) => {
    const { accessToken } = req.cookies;

    // console.log(accessToken);

    if (!accessToken) {
      if (strictLevel === 'strict') {
        throw new Error('Access token is required', { cause: { status: 401 } });
      } else {
        return next();
      }
    }

    try {
      const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;

      if (!decoded.sub) throw new Error('Invalid access token', { cause: { status: 403 } });
      const user = {
        id: decoded.sub,
        roles: decoded.roles
      };

      req.user = user;
      next();
    } catch (error) {
      // if error is an because token was expired, call next with a 401 and `ACCESS_TOKEN_EXPIRED' code
      if (error instanceof jwt.TokenExpiredError) {
        next(new Error('Expired access token', { cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' } }));
      } else {
        // call next with a new 401 Error indicated invalid access token
        next(new Error('Invalid access token.', { cause: { status: 401 } }));
      }
    }
  };

export default authenticate;
