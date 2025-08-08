import { RequestHandler } from 'express';

const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

export const apiController = Object.freeze({
  notFound
});
