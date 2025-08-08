import express from 'express';
import { env } from './env/env';
import { apiRouterV1 } from './routes/api/v1/index.route';

const app = express();

app.use('/api/v1', apiRouterV1);

app.use(
  express.static('web/', {
    extensions: ['html']
  })
);

app.use((req, res) => {
  res.status(404).send('<h1>Not found</h1>');
});

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT}`);
});
