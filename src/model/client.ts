import { db } from '../db/db';

export class Client {
  static async create(name: string, privateToken: string) {
    await db.query(
      'INSERT INTO client (name, private_token) VALUES ($1::text, $2::text)',
      [name, privateToken]
    );
  }

  static async delete(id: number) {
    return (await db.query('DELETE FROM client WHERE id=$1 RETURNING id', [id]))
      .rowCount;
  }

  static async getAll(): Promise<
    { id: string; name: string; last_seen: Date; private_token: string }[]
  > {
    return (await db.query('SELECT id,name,device_model,last_seen FROM client'))
      .rows;
  }

  static async getByToken(token: string) {
    return (
      (
        await db.query(
          'SELECT id,name,device_model,last_seen FROM client WHERE private_token=$1::text',
          [token]
        )
      ).rows[0] ?? null
    );
  }

  static async getToken(id: number): Promise<string | null> {
    return (
      await db.query('SELECT private_token FROM client WHERE id=$1', [id])
    ).rows[0]?.private_token ?? null;
  }

  static async updateToken(id: number, token: string) {
    await db.query(
      'UPDATE client SET private_token=$1 WHERE id=$2',
      [token, id]
    );
  }
}
