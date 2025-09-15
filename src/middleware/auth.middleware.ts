import { RequestHandler } from 'express';
import { Client } from '../model/client';
import jwt from '../lib/jwt';

export const authenticate =
  (config?: { requiresAdmin?: boolean }): RequestHandler =>
  async (req, res, next) => {
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
    if (!config?.requiresAdmin) {
      const client = await Client.getByToken(token);
      if (client !== null) {
        res.locals.token = token;
        res.locals.client = client;
        return next();
      }
    }

    // Try admin JWT
    try {
      const payload = jwt.verify(token);
      if (typeof payload === 'object' && payload['role'] === 'admin') {
        res.locals.token = token;
        res.locals.admin = true;
        return next();
      }
    } catch {
      /* */
    }

    return res.status(401).json({ error: 'Unauthorized' });
  };
