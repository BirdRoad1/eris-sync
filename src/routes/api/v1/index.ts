import express from 'express';
import { Client } from '../../../model/client';
import { adminRouter } from './admin';

export const apiRouterV1 = express.Router();

apiRouterV1.use('/admin', adminRouter);

apiRouterV1.post('/', async (req, res) => {
  const authorization = req.get('Authorization');
  if (authorization === undefined || !authorization.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Unauthorized' });
  }

  const token = authorization.substring(7);
  console.log(await Client.getByToken(token));

  res.end();
});

apiRouterV1.post('/auth', async (req, res) => {
  const authorization = req.get('Authorization');
  if (authorization === undefined || !authorization.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Unauthorized' });
  }

  const token = authorization.substring(7);
  console.log(await Client.getByToken(token));

  res.end();
});
