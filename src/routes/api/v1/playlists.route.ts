import express from 'express';
import { playlistsController } from '../../../controller/api/v1/playlists.controller';
import { validateData } from '../../../middleware/validation.middlware';
import { createPlaylistSchema } from '../../../schema/playlist-schema';
export const playlistsRouter = express.Router();

playlistsRouter.get('/', playlistsController.getPlaylists);
playlistsRouter.post('/', express.json(), validateData(createPlaylistSchema), playlistsController.createPlaylist);
playlistsRouter.post('/:id/song', express.json(), playlistsController.postSong);
playlistsRouter.delete('/:id', playlistsController.deletePlaylist);
playlistsRouter.delete('/:id/song', express.json(), playlistsController.deleteSong);
