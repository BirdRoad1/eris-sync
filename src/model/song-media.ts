import { ContentDelivery } from '../cdn/content-delivery';
import { db } from '../db/db';
import { queries } from '../db/queries';

export class SongMedia {
  private static transform(media: any) {
    media = { ...media };

    const file_path: string | null = media.file_path;
    delete media.file_path;
    if (!file_path) {
      media.url = null;
    } else {
      media.url = ContentDelivery.fileToUrl(file_path);
    }

    return media;
  }

  static async create(
    mimeType: string,
    filePath: string,
    songId: number
  ): Promise<number> {
    return (
      await db.query(queries.INSERT_SONG_MEDIA, [mimeType, filePath, songId])
    ).rows[0].id;
  }

  static async publicFindBySong(songId: number) {
    return (
      await db.query(queries.SELECT_SONG_MEDIA_BY_SONG, [songId])
    ).rows.map(m => this.transform(m));
  }
}
