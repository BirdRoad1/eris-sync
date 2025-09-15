import express from 'express';
import { albumsController } from '../../../controller/api/v1/albums.controller';
import { validateData } from '../../../middleware/validation.middlware';
import { createAlbumSchema, searchAlbumSchema } from '../../../schema/album-schema';
export const albumsRouter = express.Router();

albumsRouter.get('/', albumsController.getAll);
albumsRouter.post('/', express.json(), validateData(createAlbumSchema), albumsController.postAlbum);
albumsRouter.post('/:id/cover', albumsController.postCover);
albumsRouter.delete('/:id', albumsController.deleteAlbum);
albumsRouter.get('/search', validateData(searchAlbumSchema), albumsController.search);
