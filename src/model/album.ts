import { ContentDelivery } from '../cdn/content-delivery';
import { db } from '../db/db';
import { queries } from '../db/queries';

export class Album {
  static transform(album: any) {
    if (album === null) return null;

    album = { ...album };

    const cover_path: string | null = album.cover_path;
    delete album.cover_path;
    if (!cover_path) {
      album.cover_url = null;
    } else {
      album.cover_url = ContentDelivery.fileToUrl(cover_path);
    }

    return album;
  }

  static async create(
    name: string,
    artist_ids?: number[],
    cover_path?: string,
    genre?: string,
    release_year?: number
  ) {
    const id = (
      await db.query(queries.INSERT_ALBUM, [
        name,
        cover_path ?? null,
        genre ?? null,
        release_year ?? null
      ])
    ).rows[0].id;

    if (artist_ids !== undefined) {
      for (const artist_id of artist_ids) {
        await db.query(queries.CONNECT_ALBUM_TO_ARTIST, [id, artist_id]);
      }
    }

    return id;
  }

  static async getById(id: number): Promise<Album | null> {
    const rows = (await db.query(queries.SELECT_ALBUM_BY_ID, [id])).rows.map(
      r => this.transform(r)
    );

    if (rows.length === 0) return null;

    // join by id
    const artists = [];
    for (const row of rows) {
      if (row.artist_name === null) continue;
      artists.push(row.artist_name);
    }

    return { ...rows[0], artist_name: undefined, artists };
  }

  static async getAll(): Promise<Album[]> {
    const rows = (await db.query(queries.SELECT_ALL_ALBUMS)).rows.map(a =>
      this.transform(a)
    );

    const artistMap = new Map<number, any>();
    for (const row of rows) {
      if (artistMap.has(row.id) && row.artist_name !== null) {
        artistMap.get(row.id).artists.push(row.artist_name);
      } else {
        artistMap.set(row.id, {
          ...row,
          artist_name: undefined,
          artists: row.artist_name === null ? [] : [row.artist_name]
        });
      }
    }

    return [...artistMap.values()];
  }

  static async search(name: string) {
    return (await db.query(queries.SEARCH_ALBUM, [name])).rows;
  }

  static async updateCover(id: number, path: string) {
    return this.transform(
      (await db.query(queries.UPDATE_ALBUM_COVER, [id, path])).rows[0]
    );
  }

  static async delete(id: number) {
    return (await db.query(queries.DELETE_ALBUM, [id])).rowCount;
  }
}
