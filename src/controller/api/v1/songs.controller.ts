import { RequestHandler } from 'express';
import { Song } from '../../../model/song';
import { CreateSongSchema } from '../../../schema/songs-schema';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import {
  StreamByteLimitExceededError,
  StreamByteLimitTransform
} from '../../../streams/stream-byte-limit-transform';

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

const postMedia: RequestHandler = async (req, res) => {
  const name = req.get('file-name');
  if (!name) {
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

  console.log(req.headers);

  const writeStream = fs.createWriteStream('test.txt');

  // TODO: real file uploading!

  try {
    await pipeline(req, new StreamByteLimitTransform(1), writeStream);
    res.json({});
  } catch (err) {
    console.log('Upload error:', err);
    writeStream.close();
    fs.rmSync('test.txt');

    if (err instanceof StreamByteLimitExceededError) {
      res.status(400).json({ error: 'File too large' });
    } else {
      res.status(500).json({ error: 'Internal server error while uploading' });
    }

    return;
  }
};

export const songsController = { getSongs, postSongs, postMedia };
