import { db } from '../db/db';
import { queries } from '../db/queries';

export class SongMedia {
  static async create(
    mimeType: string,
    filePath: string,
    songId: number
  ): Promise<number> {
    return (
      await db.query(queries.INSERT_SONG_MEDIA, [mimeType, filePath, songId])
    ).rows[0].id;
  }

  static async findBySong(songId: number) {
    return (await db.query(queries.SELECT_SONG_MEDIA_BY_SONG, [songId])).rows;
  }
}
