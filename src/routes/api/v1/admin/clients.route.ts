import express from 'express';
import { clientsController } from '../../../../controller/api/v1/admin/clients.controller';

export const clientsRouter = express.Router();

clientsRouter.get('/', clientsController.getClients);

clientsRouter.post('/', express.json(), clientsController.createClient);

clientsRouter.delete('/:id', clientsController.deleteClient);

clientsRouter.get('/:id/token', clientsController.getToken);

clientsRouter.post('/:id/reset-token', clientsController.resetToken);
