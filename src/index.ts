import express from 'express';
import { env } from './env/env';
import { apiRouterV1 } from './routes/api/v1';

const app = express();

app.use('/api/v1', apiRouterV1);

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT}`);
});
