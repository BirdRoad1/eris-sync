import express from 'express';
import { env } from './env/env';

const app = express();

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT}`);
});
