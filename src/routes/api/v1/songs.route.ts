import express from 'express';
import { songsController } from '../../../controller/api/v1/songs.controller';

export const songsRouter = express.Router();

songsRouter.get('/', songsController.getSongs);
songsRouter.post('/', express.json(), songsController.postSongs);
songsRouter.post('/:id/media', songsController.postMedia);
songsRouter.delete('/:id', songsController.deleteSong);
