import express from 'express';
import {
  clientQuerySchema,
  createClientSchema
} from '../../../../schema/admin-schema';
import { Client } from '../../../../model/client';
import crypto from 'crypto';

// 256-bit
function generateToken() {
  return crypto.randomBytes(256 / 8).toString('hex');
}

const getClients: express.RequestHandler = async (req, res) => {
  res.json({ results: await Client.getAll() });
};

const createClient: express.RequestHandler = async (req, res) => {
  const parsed = createClientSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const { name } = parsed.data;

  const privateToken = generateToken();

  await Client.create(name, privateToken);

  res.json({});
};

const deleteClient: express.RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params);

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const rowCount = await Client.delete(parsed.data.id);
  if (rowCount) {
    res.json({});
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
};

const getToken: express.RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const token = await Client.getToken(parsed.data.id);
  if (token === null) {
    res.status(404).json({ error: 'The user has no token' });
    return;
  }

  res.json({ token });
};

const resetToken: express.RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  await Client.updateToken(parsed.data.id, generateToken());

  res.json({});
};

export const clientsController = Object.freeze({
  getClients,
  createClient,
  deleteClient,
  getToken,
  resetToken
});
