import { db } from '../db/db';
import { queries } from '../db/queries';

export class Album {
  static async create(
    name: string,
    cover_path?: string,
    genre?: string,
    release_year?: number
  ) {
    await db.query(queries.INSERT_ALBUM, [
      name,
      cover_path ?? null,
      genre ?? null,
      release_year ?? null
    ]);
  }
}
