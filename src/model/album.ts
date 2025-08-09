import { db } from '../db/db';

export class Album {
  static async create(
    name: string,
    cover_path?: string,
    genre?: string,
    release_year?: number
  ) {
    await db.query(
      'INSERT INTO album (name, cover_path, genre, release_year) VALUES ($1, $2, $3, $4)',
      [name, cover_path ?? null, genre ?? null, release_year ?? null]
    );
  }

  static async delete(id: number) {
    return (await db.query('DELETE FROM spng WHERE id=$1 RETURNING id', [id]))
      .rowCount;
  }

  static async getAll() {
    return (
      await db.query(
        'SELECT id,title,album_id,cover_path,release_year,duration_seconds,lyrics_url,genre,track_number FROM song'
      )
    ).rows;
  }

  static async getById(id: number) {
    return (
      (
        await db.query(
          'SELECT id,title,album_id,cover_path,release_year,duration_seconds,lyrics_url,genre,track_number WHERE id=$1',
          [id]
        )
      ).rows[0] ?? null
    );
  }
}
