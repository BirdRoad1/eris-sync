import { RequestHandler } from 'express';
import { env } from '../../../../env/env';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const authenticate: RequestHandler = async (req, res) => {
  const authorization = req.get('Authorization');
  if (authorization === undefined || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authorization.substring(7);
  if (
    env.ADMIN_TOKEN.length !== token.length ||
    !crypto.timingSafeEqual(
      Buffer.from(token, 'utf-8'),
      Buffer.from(env.ADMIN_TOKEN, 'utf-8')
    )
  ) {
    return res.status(401).json({ error: 'Invalid admin token' });
  }

  const newToken = jwt.sign(
    {
      role: 'admin'
    },
    env.JWT_ECDSA_PRIVATE_KEY,
    {
      expiresIn: '1 day',
      algorithm: 'ES256'
    }
  );

  res.json({
    token: newToken
  });
};

const validateAuth: RequestHandler = (req, res, next) => {
  const authorization = req.get('Authorization');
  if (authorization === undefined || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authorization.substring(7);
  const data = jwt.verify(token, env.JWT_ECDSA_PUBLIC_KEY, {
    algorithms: ['ES256']
  });
  if (typeof data === 'object' && data['role'] === 'admin') {
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const getRoot: RequestHandler = async (req, res) => {
  res.json({});
};

export const adminController = {
  authenticate,
  validateAuth,
  getRoot
};
