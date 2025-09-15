import express from 'express';
import { clientsRouter } from './clients.route';
import { adminController } from '../../../../controller/api/v1/admin/index.controller';
import { authenticate } from '../../../../middleware/auth.middleware';

export const adminRouter = express.Router();

adminRouter.post('/auth', adminController.login);

adminRouter.use(authenticate({ requiresAdmin: true }));

adminRouter.get('/', (req, res) => {
  res.json({});
});

adminRouter.use('/clients', clientsRouter);
