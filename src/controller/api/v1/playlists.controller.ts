import { RequestHandler } from 'express';
import { Playlist } from '../../../model/playlist';
import {
  addSongToPlaylistSchema,
  createPlaylistSchema
} from '../../../schema/playlist-schema';
import { clientQuerySchema } from '../../../schema/admin-schema';
import { RequestHandlerWithBody } from '../../../middleware/validation.middlware';

const getPlaylists: RequestHandler = async (req, res) => {
  res.json({
    results: await Playlist.getAll()
  });
};

const createPlaylist: RequestHandlerWithBody<typeof createPlaylistSchema> = async (req, res) => {
  res.json({
    id: await Playlist.create(req.body.name)
  });
};

const deletePlaylist: RequestHandler = async (req, res) => {
  const parsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const deleted = await Playlist.delete(parsed.data.id);
  if (deleted !== null && deleted > 0) {
    res.status(200).json({});
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
};

const postSong: RequestHandler = async (req, res) => {
  const paramsParsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!paramsParsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const parsed = addSongToPlaylistSchema.safeParse(req.body); // TODO: rename schema for better reuse
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const playlistId = paramsParsed.data.id;
  const songId = parsed.data?.id;

  await Playlist.addSongToPlaylist(songId, playlistId);

  res.json({});
};

const deleteSong: RequestHandler = async (req, res) => {
  const paramsParsed = clientQuerySchema.safeParse(req.params); // TODO: rename schema for better reuse

  if (!paramsParsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const parsed = addSongToPlaylistSchema.safeParse(req.body); // TODO: rename schema for better reuse
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const playlistId = paramsParsed.data.id;
  const songId = parsed.data?.id;

  await Playlist.removeSongFromPlaylist(songId, playlistId);

  res.json({});
};

export const playlistsController = {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  postSong,
  deleteSong
};
