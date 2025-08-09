import express from 'express';
import { adminRouter } from './admin/index.route';
import { apiController } from '../../../controller/api/v1/index.controller';
import { songsRouter } from './songs.route';

export const apiRouterV1 = express.Router();

apiRouterV1.use('/admin', adminRouter);

apiRouterV1.use(apiController.authenticate);

apiRouterV1.use('/songs', songsRouter);

apiRouterV1.use(apiController.notFound);
