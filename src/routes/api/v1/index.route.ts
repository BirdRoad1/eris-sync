import express from 'express';
import { adminRouter } from './admin/index.route';
import { apiController } from '../../../controller/api/v1/index.controller';
import { songsRouter } from './songs.route';
import { env } from '../../../env/env';
import fs from 'fs';
import { artistsRouter } from './artists.route';
import { albumsRouter } from './albums.route';

export const apiRouterV1 = express.Router();
function getVersion() {
  try {
    const content = fs.readFileSync('package.json', 'utf-8');
    const parsed = JSON.parse(content);
    return parsed.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

apiRouterV1.get('/', (req, res) => {
  res.json({
    server: 'eris-sync',
    version: getVersion()
  });
});


apiRouterV1.use('/admin', adminRouter);

apiRouterV1.use(apiController.authenticate);

apiRouterV1.use('/me', apiController.getMe);

apiRouterV1.use('/songs', songsRouter);

apiRouterV1.use('/artists', artistsRouter);

apiRouterV1.use('/albums', albumsRouter);

apiRouterV1.use('/storage', express.static(env.STORAGE_PATH));

apiRouterV1.use(apiController.notFound);
