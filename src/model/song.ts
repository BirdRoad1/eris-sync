import { db } from '../db/db';

export class Song {
  static async create(
    title: string,
    cover_path?: string,
    release_year?: string,
    duration_seconds?: string,
    lyrics_url?: string,
    genre?: string,
    track_number?: string
  ): Promise<number> {
    return (await db.query(
      'INSERT INTO song (title, cover_path, release_year, duration_seconds, lyrics_url, genre, track_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [
        title,
        cover_path ?? null,
        release_year ?? null,
        duration_seconds ?? null,
        lyrics_url ?? null,
        genre ?? null,
        track_number ?? null
      ]
    )).rows[0].id;
  }

  static async delete(id: number) {
    return (await db.query('DELETE FROM song WHERE id=$1 RETURNING id', [id]))
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
          'SELECT id,title,album_id,cover_path,release_year,duration_seconds,lyrics_url,genre,track_number FROM song WHERE id=$1',
          [id]
        )
      ).rows[0] ?? null
    );
  }
}
