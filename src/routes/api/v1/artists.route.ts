import express from 'express';
import { artistsController } from '../../../controller/api/v1/artists.controller';
import { validateData } from '../../../middleware/validation.middlware';
import { createArtistSchema, searchArtistSchema } from '../../../schema/artist-schema';
export const artistsRouter = express.Router();

artistsRouter.get('/', artistsController.getArtists);
artistsRouter.post('/', express.json(), validateData(createArtistSchema), artistsController.createArtist);
artistsRouter.delete('/:id', artistsController.deleteArtist);
artistsRouter.post('/:id/cover', artistsController.postCover);
artistsRouter.get('/search', validateData(searchArtistSchema), artistsController.search);
