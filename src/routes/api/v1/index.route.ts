import express from 'express';
import { adminRouter } from './admin/index.route';
import { apiController } from '../../../controller/api/v1/index.controller';

export const apiRouterV1 = express.Router();

apiRouterV1.use('/admin', adminRouter);

apiRouterV1.use(apiController.notFound);
