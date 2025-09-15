import express from 'express';
import { songsController } from '../../../controller/api/v1/songs.controller';
import { validateData } from '../../../middleware/validation.middlware';
import { CreateSongSchema } from '../../../schema/songs-schema';

export const songsRouter = express.Router();

songsRouter.get('/', songsController.getSongs);
songsRouter.post(
  '/',
  express.json(),
  validateData(CreateSongSchema),
  songsController.postSongs
);
songsRouter.get('/:id/media', songsController.getMedia);
songsRouter.post('/:id/media', songsController.postMedia);
songsRouter.post('/:id/cover', songsController.postCover);
songsRouter.delete('/:id', songsController.deleteSong);
