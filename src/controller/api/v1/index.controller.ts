import { RequestHandler } from 'express';
import { Client } from '../../../model/client';
import jwt from 'jsonwebtoken';
import { env } from '../../../env/env';

const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

const authenticate: RequestHandler = async (req, res, next) => {
  const authorization = req.get('Authorization');
  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const split = authorization.split(' ');
  if (split.length !== 2 || split[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = split[1];

  // Try user token
  const client = await Client.getByToken(token);
  if (client !== null) {
    return next();
  }

  // Try admin JWT
  try {
    const payload = jwt.verify(token, env.JWT_ECDSA_PUBLIC_KEY, {
      algorithms: ['ES256']
    });
    if (typeof payload === 'object' && payload['role'] === 'admin') {
      return next();
    }
  } catch (err) {
    console.log(
      'Failed to validate JWT:',
      err instanceof Error ? err.message : String(err)
    );
  }

  return res.status(401).json({ error: 'Unauthorized' });
};

export const apiController = Object.freeze({
  notFound,
  authenticate
});
