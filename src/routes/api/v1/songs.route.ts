import express from 'express';
import { songsController } from '../../../controller/api/v1/songs.controller';

export const songsRouter = express.Router();

songsRouter.get('/', songsController.getSongs);
songsRouter.post('/', express.json(), songsController.postSongs);
songsRouter.get('/:id/media', songsController.getMedia);
songsRouter.post('/:id/media', songsController.postMedia);
songsRouter.post('/:id/cover', songsController.postCover);
songsRouter.delete('/:id', songsController.deleteSong);
