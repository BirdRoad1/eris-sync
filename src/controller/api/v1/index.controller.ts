import { RequestHandler } from 'express';

const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

const getMe: RequestHandler = async (req, res) => {
  // TODO: maybe allow admin user?
  if (!res.locals.client) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({
    user: {
      name: res.locals.client.name
    }
  });
};

export const apiController = Object.freeze({
  notFound,
  getMe
});
