import { ContentDelivery } from '../cdn/content-delivery';
import { db } from '../db/db';
import { queries } from '../db/queries';

export class Artist {
  // static async create(name: string, privateToken: string) {
  //   await db.query(queries.INSERT_CLIENT, [name, privateToken]);
  // }

  // static async delete(id: number) {
  //   return (await db.query(queries.DELETE_CLIENT, [id])).rowCount;
  // }

  static transform(artist: any) {
    artist = { ...artist };

    const cover_path: string | null = artist.cover_path;
    delete artist.cover_path;
    if (!cover_path) {
      artist.cover_url = null;
    } else {
      artist.cover_url = ContentDelivery.fileToUrl(cover_path);
    }

    return artist;
  }

  static async create(name: string) {
    return (await db.query(queries.INSERT_ARTIST, [name])).rows[0].id;
  }

  static async getAll() {
    return (await db.query(queries.SELECT_ALL_ARTISTS)).rows.map(artist =>
      this.transform(artist)
    );
  }

  static async getById(id: number) {
    return this.transform(
      (await db.query(queries.SELECT_ARTIST_BY_ID, [id])).rows[0]
    );
  }

  static async delete(id: number) {
    return await (
      await db.query(queries.DELETE_ARTIST, [id])
    ).rowCount;
  }

  static async updateCover(id: number, path: string) {
    return this.transform(
      (await db.query(queries.UPDATE_ARTIST_COVER, [id, path])).rows[0]
    );
  }

  static async search(name: string) {
    return (await db.query(queries.SEARCH_ARTIST, [name])).rows;
  }
}
