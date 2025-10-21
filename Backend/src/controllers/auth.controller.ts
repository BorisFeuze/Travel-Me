import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { User, RefreshToken } from '#models';
import { ACCESS_JWT_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL, SALT_ROUNDS } from '#config';
import type { RegisterInputDTO, LoginInputDTO, UserProfileAuthSchemaDTO, UserAuthInputDTO } from '../types/types.ts';

type MeType = SuccessMsg & { user: UserProfileAuthSchemaDTO };

export const register: RequestHandler<{}, SuccessMsg, RegisterInputDTO> = async (req, res) => {
  const { firstName, lastName, email, password, roles, phoneNumber } = req.body;

  //check if user has that email already
  const userExists = await User.exists({ email });
  if (userExists) throw new Error('Email already exists', { cause: { status: 409 } });

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPW = await bcrypt.hash(password, salt);
  // create a new user
  const user = await User.create<UserAuthInputDTO>({
    firstName,
    lastName,
    email,
    phoneNumber,
    password: hashedPW,
    roles
  });

  const refreshToken = randomUUID();
  await RefreshToken.create({ token: refreshToken, userId: user._id });

  // Issue an access and a refresh token and put them in cookies
  const payload = { roles: user.roles };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: user._id.toString()
  };
  const accessToken = jwt.sign(payload, secret, tokenOptions);

  console.log(accessToken);
  //add access token to cookie
  const isProduction = process.env.NODE_env === 'production';
  const cookieOptions = {
    httponly: true,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction
  };

  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_TTL * 1000 });

  res.cookie('accessToken', accessToken, cookieOptions);
  // Also store the refresh token in your db
  res.status(201).json({ message: 'Registered' });
};

export const login: RequestHandler<{}, SuccessMsg, LoginInputDTO> = async (req, res) => {
  // TODO: Implement user login
  const { email, password } = req.body;
  // console.log(email, password);
  // Check if the user exists in the database
  const user = await User.findOne({ email }).lean();
  // console.log(user);
  if (!user) throw new Error('invalid email or the password is incorrect', { cause: { status: 401 } });
  // Compare the password from the request with the hash in your db
  const ok = await bcrypt.compare(password, user.password);
  // console.log(ok);
  if (!ok) throw new Error('invalid email or the password is incorrect', { cause: { status: 401 } });
  // Send an Error "Incorrect credentials" if either no user is found (invalid email) or the password is incorrect

  //delete all existing Refreshtoken in db
  await RefreshToken.deleteMany({ userId: user._id });

  // create a new refresh token
  const refreshToken = randomUUID();
  await RefreshToken.create({ token: refreshToken, userId: user._id });

  // Issue an access and a refresh token and put them in cookies
  const payload = { roles: user.roles };

  // console.log(payload);
  const secret = ACCESS_JWT_SECRET;
  // console.log(secret);
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: user._id.toString()
  };
  const accessToken = jwt.sign(payload, secret, tokenOptions);
  //add access token to cookie
  const isProduction = process.env.NODE_env === 'production';
  const cookieOptions = {
    httponly: true,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction
  };

  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_TTL * 1000 });

  res.cookie('accessToken', accessToken, cookieOptions);
  // Also store the refresh token in your db
  res.status(200).json({ message: 'Logged-in' });
};

export const refresh: RequestHandler<{}, SuccessMsg> = async (req, res) => {
  // TODO: Implement access token refresh and refresh token rotation
  const { refreshToken } = req.cookies;
  // Get the refresh token from the cookies and verify it
  const refreshtokenInfo = await RefreshToken.findOne({ token: refreshToken }).lean();
  // Look up the refresh token in the database, throw and error, if it canot be found
  if (!refreshtokenInfo) throw new Error('Refreshtocken cannot be found', { cause: { status: 403 } });

  // delete the old refresh token, look up the user and issue new tokens
  await RefreshToken.findByIdAndDelete(refreshtokenInfo._id);

  const currentUser = await User.findById(refreshtokenInfo.userId).lean();

  if (!currentUser) throw new Error('user not found', { cause: { status: 404 } });

  // create a new refresh token
  const newRefreshToken = randomUUID();
  await RefreshToken.create({ token: newRefreshToken, userId: currentUser._id });

  // store the new refresh token in your db and send both access and refresh token via cookies
  // Issue an access and a refresh token and put them in cookies
  const payload = { roles: currentUser.roles };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: currentUser._id.toString()
  };
  const newAccessToken = jwt.sign(payload, secret, tokenOptions);
  //add access token to cookie
  const isProduction = process.env.NODE_env === 'production';
  const cookieOptions = {
    httponly: true,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction
  };

  res.cookie('refreshToken', newRefreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_TTL * 1000
  });

  res.cookie('accessToken', newAccessToken, cookieOptions);

  res.status(200).json({ message: 'new Token generated' });
};

export const logout: RequestHandler<{}, SuccessMsg> = async (req, res) => {
  // TODO: Implement logout by removing the tokens
  // Get the tokens from the cookies
  const { refreshToken, accessToken } = req.cookies;

  // console.log(refreshToken);
  // Delete the refresh token from your database
  // get the token_id from the refreshtoken
  const tokenExists = await RefreshToken.exists({ token: refreshToken });

  //delele toke from db
  await RefreshToken.findByIdAndDelete(tokenExists?._id);
  // Clear both cookies
  // A longer living access token, or a token in a higher risk use case would need to be put on a token blacklist - another entry in your db - and checked on validation
  const payload = jwt.verify(accessToken, ACCESS_JWT_SECRET);
  // console.log(payload);
  // Since our access tokens are valid for a couple of minutes the risk here is acceptable
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out' });
};

export const me: RequestHandler<{}, MeType> = async (req, res, next) => {
  const { refreshtoken, accessToken } = req.cookies;
  // console.log(accessToken);
  if (!accessToken) throw new Error('Access token is required', { cause: { status: 401 } });
  // Get the access token and use it to retrieve the user's data
  try {
    // extrahing the user._Id (payload.sub) from accessToken with the function jwt.verify
    const payload = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub) throw new Error('Invalid access token', { cause: { status: 403 } });
    // console.log(payload);
    // find the data from user with the help of the user._id(payload.sub)
    const user = await User.findById(payload.sub).select('-password').lean();
    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    res.status(200).json({ message: 'current user', user });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new Error('Expired access token', { cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' } }));
    } else {
      next(new Error('invalid access token', { cause: { status: 401 } }));
    }
  }
};
