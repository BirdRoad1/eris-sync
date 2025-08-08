import { Client } from 'pg';
import { env } from '../env/env';
export const db = new Client(env.DATABASE_URL);
await db.connect();
