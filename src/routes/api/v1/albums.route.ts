import express from 'express';
import { albumsController } from '../../../controller/api/v1/albums.controller';
export const albumsRouter = express.Router();

albumsRouter.get('/', albumsController.getAll);
albumsRouter.post('/', express.json(), albumsController.postAlbum);
albumsRouter.post('/:id/cover', albumsController.postCover);
albumsRouter.delete('/:id', albumsController.deleteAlbum);
albumsRouter.get('/search', albumsController.search);
