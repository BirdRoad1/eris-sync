import { RequestHandler } from 'express';
import { Artist } from '../../../model/artist';
import {
  createArtistSchema,
  searchArtistSchema
} from '../../../schema/artist-schema';
import { ContentDelivery } from '../../../cdn/content-delivery';
import { clientQuerySchema } from '../../../schema/admin-schema';
import {
  StreamByteLimitExceededError,
  StreamByteLimitTransform
} from '../../../streams/stream-byte-limit-transform';
import { pipeline } from 'stream/promises';
import { RequestHandlerWithBody } from '../../../middleware/validation.middlware';

const getArtists: RequestHandler = async (req, res) => {
  res.json({
    results: await Artist.getAll()
  });
};

const createArtist: RequestHandlerWithBody<typeof createArtistSchema> = async (req, res) => {
  res.json({
    id: await Artist.create(req.body.name)
  });
};

const deleteArtist: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const deleted = await Artist.delete(parsed.data.id);
  if (deleted !== null && deleted > 0) {
    res.status(200).json({});
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
};

const postCover: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const artist = await Artist.getById(parsed.data.id);
  if (!artist) {
    res.status(404).json({ error: 'Artist does not exist' });
    return;
  }

  const fileName = req.get('file-name');
  if (!fileName) {
    return res.status(400).json({ error: 'Missing file name' });
  }

  const contentLengthStr = req.get('content-length');
  let contentLength: number;
  if (
    !contentLengthStr ||
    !Number.isFinite((contentLength = Number(contentLengthStr)))
  ) {
    return res.status(400).json({ error: 'No content-length' });
  }

  // 10 MB
  const maxSize = 10 * 1e6;

  if (contentLength > maxSize) {
    return res.status(400).json({ error: 'File too large!' });
  }

  const writeStream = await ContentDelivery.createObjectWriteStream(fileName);

  try {
    await pipeline(
      req,
      new StreamByteLimitTransform(200 * 1e6),
      writeStream.stream
    );

    res.json({
      id: await Artist.updateCover(parsed.data.id, writeStream.relativePath)
    });
  } catch (err) {
    console.log('Upload error:', err);
    writeStream.stream.close();
    await ContentDelivery.deleteObject(writeStream.uuid);

    if (err instanceof StreamByteLimitExceededError) {
      res.status(400).json({ error: 'File too large' });
    } else {
      res.status(500).json({ error: 'Internal server error while uploading' });
    }

    return;
  }
};

const search: RequestHandlerWithBody<typeof searchArtistSchema> = async (req, res) => {
  const { name } = req.body;

  res.json({ results: await Artist.search(name) });
};

export const artistsController = {
  getArtists,
  createArtist,
  deleteArtist,
  postCover,
  search
};
