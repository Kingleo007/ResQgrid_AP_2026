// User management and login endpoints.
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { config } from '../config/env.js';
import authenticate from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/authValidator.js';
import { createUserSchema } from '../validators/validators.js';

export const authRouter = Router();
export const usersRouter = Router();

// Login: POST /api/auth/login
authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({ where: { email: req.body.email } });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    );
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.nodeEnv === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

// Logout: POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Current user: GET /api/auth/me
authRouter.get('/me', authenticate, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Create user: POST /api/users (requires login)
usersRouter.post('/', authenticate, validate(createUserSchema), async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const existing = await prisma.user.findFirst({ where: { email: req.body.email } });
    if (existing) {
      const err = new Error('A user with that email already exists');
      err.status = 409;
      return next(err);
    }
    const user = await prisma.user.create({
      data: { name: req.body.name, email: req.body.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (err) { next(err); }
});
