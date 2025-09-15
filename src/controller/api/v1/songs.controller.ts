import { RequestHandler } from 'express';
import { Song } from '../../../model/song';
import { CreateSongSchema } from '../../../schema/songs-schema';
import { pipeline } from 'stream/promises';
import {
  StreamByteLimitExceededError,
  StreamByteLimitTransform
} from '../../../streams/stream-byte-limit-transform';
import { ContentDelivery } from '../../../cdn/content-delivery';
import { SongMedia } from '../../../model/song-media';
import { clientQuerySchema } from '../../../schema/admin-schema';
import { RequestHandlerWithBody } from '../../../middleware/validation.middlware';

const getSongs: RequestHandler = async (req, res) => {
  res.json({
    results: await Song.getAll()
  });
};

const postSongs: RequestHandlerWithBody<typeof CreateSongSchema> = async (
  req,
  res
) => {
  const { title, artistId, albumId } = req.body;

  const id = await Song.create(title, artistId, albumId);
  res.json({ id });
};

const deleteSong: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const deleted = await Song.delete(parsed.data.id);
  if (deleted !== null && deleted > 0) {
    res.status(200).json({});
  } else {
    res.status(404).json({ error: 'Song not found' });
  }
};

const getMedia: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const song = await Song.getById(parsed.data.id);
  if (!song) {
    res.status(404).json({ error: 'Song not found' });
    return;
  }

  const media = await SongMedia.publicFindBySong(song.id);

  return res.json({ results: media });
};

const postMedia: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
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

  const maxSize = 200 * 1e6;

  if (contentLength > maxSize) {
    // 200 MB
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
      id: await SongMedia.create(
        '', // TODO: mime type
        writeStream.relativePath,
        parsed.data.id
      )
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

const postCover: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const song = await Song.getById(parsed.data.id);
  if (!song) {
    res.status(404).json({ error: 'Song does not exist' });
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
      id: await Song.updateCover(parsed.data.id, writeStream.relativePath)
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

export const songsController = {
  getSongs,
  postSongs,
  deleteSong,
  getMedia,
  postMedia,
  postCover
};
