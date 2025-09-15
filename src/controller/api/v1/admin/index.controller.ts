import { RequestHandler } from 'express';
import { env } from '../../../../env/env';
import crypto from 'crypto';
import jwt from '../../../../lib/jwt';

const login: RequestHandler = async (req, res) => {
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
    {
      expiresIn: '1 day'
    }
  );

  res.json({
    token: newToken
  });
};

export const adminController = {
  login
};
