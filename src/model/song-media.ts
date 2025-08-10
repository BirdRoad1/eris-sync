import { db } from '../db/db';
import { queries } from '../db/queries';

export class SongMedia {
  static async create(
    mime_type: string,
    file_path: string,
    song_id: number
  ): Promise<number> {
    return (
      await db.query(
        queries.INSERT_SONG_MEDIA,
        [mime_type, file_path, song_id]
      )
    ).rows[0].id;
  }
}
