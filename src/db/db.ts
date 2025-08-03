import { Client } from 'pg';
export const db = new Client();
await db.connect();
