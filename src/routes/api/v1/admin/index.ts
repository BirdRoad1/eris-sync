import express from 'express';
import crypto from 'crypto';
import { env } from '../../../../env/env';
import jwt from 'jsonwebtoken';
export const adminRouter = express.Router();

adminRouter.post('/auth', async (req, res) => {
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
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const newToken = jwt.sign(
    {
      role: 'admin'
    },
    env.JWT_PRIVATE_KEY,
    {
      expiresIn: '1 day'
    }
  );

  res.json({
    token: newToken
  });
});
