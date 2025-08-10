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

const getSongs: RequestHandler = async (req, res) => {
  res.json({
    result: await Song.getAll()
  });
};

const postSongs: RequestHandler = async (req, res) => {
  const parsed = CreateSongSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Malformed request' });
    return;
  }

  const id = await Song.create(parsed.data.title);
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
      id: await SongMedia.create('', writeStream.path, parsed.data.id)
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

export const songsController = { getSongs, postSongs, deleteSong, postMedia };
