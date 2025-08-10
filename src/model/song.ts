import { db } from '../db/db';
import { queries } from '../db/queries';

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
      queries.INSERT_SONG,
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
    return (await db.query(queries.DELETE_SONG, [id]))
      .rowCount;
  }

  static async getAll() {
    console.log( (
      await db.query(
        queries.SELECT_ALL_SONGS
      )
    ).rows)
    return (
      await db.query(
        queries.SELECT_ALL_SONGS
      )
    ).rows;
  }

  static async getById(id: number) {
    return (
      (
        await db.query(
          queries.SELECT_SONG_BY_ID,
          [id]
        )
      ).rows[0] ?? null
    );
  }
}
