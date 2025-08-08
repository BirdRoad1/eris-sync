import express from 'express';
import { clientsRouter } from './clients.route';
import { adminController } from '../../../../controller/api/v1/admin/index.controller';

export const adminRouter = express.Router();

adminRouter.post('/auth', adminController.authenticate);

adminRouter.use(adminController.validateAuth);

adminRouter.get('/', adminController.getRoot);

adminRouter.use('/clients', clientsRouter)