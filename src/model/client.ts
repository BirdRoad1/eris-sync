import { db } from '../db/db';

export class Client {
  static async create(name: string) {
    await db.query('INSERT INTO client (name) VALUES ($1::text)', [name]);
  }

  static async getAll(): Promise<
    { id: string; name: string; last_seen: Date; private_token: string }[]
  > {
    return (await db.query('SELECT id,name,last_seen FROM client')).rows;
  }

  static async getByToken(token: string) {
    return (
      (
        await db.query(
          'SELECT id,name,last_seen FROM client WHERE private_token=$1::text',
          [token]
        )
      ).rows[0] ?? null
    );
  }
}
