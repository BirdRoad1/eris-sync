import { db } from '../db/db';
import { queries } from '../db/queries';

export class Client {
  static async create(name: string, privateToken: string) {
    await db.query(queries.INSERT_CLIENT, [name, privateToken]);
  }

  static async delete(id: number) {
    return (await db.query(queries.DELETE_CLIENT, [id])).rowCount;
  }

  static async getAll(): Promise<
    { id: string; name: string; last_seen: Date; private_token: string }[]
  > {
    return (await db.query(queries.SELECT_ALL_CLIENTS)).rows;
  }

  static async getByToken(token: string) {
    return (
      (await db.query(queries.SELECT_CLIENT_BY_TOKEN, [token])).rows[0] ?? null
    );
  }

  static async getToken(id: number): Promise<string | null> {
    return (
      (await db.query(queries.SELECT_CLIENT_BY_ID, [id])).rows[0]
        ?.private_token ?? null
    );
  }

  static async updateToken(id: number, token: string) {
    await db.query(queries.UPDATE_CLIENT_TOKEN, [token, id]);
  }
}
