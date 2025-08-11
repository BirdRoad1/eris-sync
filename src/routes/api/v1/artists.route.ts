import express from 'express';
import { artistsController } from '../../../controller/api/v1/artists.controller';
export const artistsRouter = express.Router();

artistsRouter.get('/', artistsController.getArtists);
artistsRouter.post('/', express.json(), artistsController.createArtist);
artistsRouter.delete('/:id', artistsController.deleteArtist);
artistsRouter.post('/:id/cover', artistsController.postCover);
artistsRouter.get('/search', artistsController.search);
