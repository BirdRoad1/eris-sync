import { ContentDelivery } from '../cdn/content-delivery';
import { db } from '../db/db';
import { queries } from '../db/queries';

export class Song {
  private static transformSong(song: any) {
    song = { ...song };

    const cover_path: string | null = song.cover_path;
    delete song.cover_path;
    if (!cover_path) {
      song.cover_url = null;
    } else {
      song.cover_url = ContentDelivery.fileToUrl(cover_path);
    }

    return song;
  }

  static async create(
    title: string,
    artist_id?: number,
    album_id?: number,
    cover_path?: string,
    release_year?: string,
    duration_seconds?: string,
    lyrics_url?: string,
    genre?: string,
    track_number?: string
  ): Promise<number> {
    return (
      await db.query(queries.INSERT_SONG, [
        title,
        artist_id ?? null,
        album_id ?? null,
        cover_path ?? null,
        release_year ?? null,
        duration_seconds ?? null,
        lyrics_url ?? null,
        genre ?? null,
        track_number ?? null
      ])
    ).rows[0].id;
  }

  static async updateCover(id: number, coverPath: string) {
    await db.query(queries.UPDATE_SONG_COVER, [id, coverPath]);
  }

  static async delete(id: number) {
    return (await db.query(queries.DELETE_SONG, [id])).rowCount;
  }

  static async getAll() {
    return (await db.query(queries.SELECT_ALL_SONGS)).rows.map(s =>
      this.transformSong(s)
    );
  }

  static async getById(id: number) {
    const row = (await db.query(queries.SELECT_SONG_BY_ID, [id])).rows[0];
    if (!row) return null;

    return this.transformSong(row);
  }
}
