import { RequestHandler } from 'express';
import {
  createAlbumSchema,
  searchAlbumSchema
} from '../../../schema/album-schema';
import { Album } from '../../../model/album';
import { clientQuerySchema } from '../../../schema/admin-schema';
import { ContentDelivery } from '../../../cdn/content-delivery';
import { pipeline } from 'stream/promises';
import {
  StreamByteLimitExceededError,
  StreamByteLimitTransform
} from '../../../streams/stream-byte-limit-transform';

const getAll: RequestHandler = async (req, res) => {
  const albums = await Album.getAll();

  res.json({ results: albums });
};

const postAlbum: RequestHandler = async (req, res) => {
  const parsed = createAlbumSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { name, genre, release_year, artistIds: artist_id } = parsed.data;

  const id = await Album.create(
    name,
    artist_id,
    undefined,
    genre,
    release_year
  );
  res.json({ id });
};

const deleteAlbum: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const deleted = await Album.delete(parsed.data.id);
  if (deleted !== null && deleted > 0) {
    res.status(200).json({});
  } else {
    res.status(404).json({ error: 'Album not found' });
  }
};

const postCover: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const album = await Album.getById(parsed.data.id);
  if (!album) {
    res.status(404).json({ error: 'Album does not exist' });
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
      id: await Album.updateCover(parsed.data.id, writeStream.relativePath)
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

const search: RequestHandler = async (req, res) => {
  const parsed = searchAlbumSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Missing name' });
  }

  const { name } = parsed.data;

  res.json({ results: await Album.search(name) });
};

export const albumsController = {
  getAll,
  postAlbum,
  deleteAlbum,
  postCover,
  search
};
