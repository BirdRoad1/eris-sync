import express from 'express';
import { playlistsController } from '../../../controller/api/v1/playlists.controller';
export const playlistsRouter = express.Router();

playlistsRouter.get('/', playlistsController.getPlaylists);
playlistsRouter.post('/', express.json(), playlistsController.createPlaylist);
playlistsRouter.post('/:id/song', express.json(), playlistsController.postSong);
playlistsRouter.delete('/:id', playlistsController.deletePlaylist);
