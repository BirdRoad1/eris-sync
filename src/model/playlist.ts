import { ContentDelivery } from '../cdn/content-delivery';
import { db } from '../db/db';
import { queries } from '../db/queries';

export class Playlist {
  static async create(name: string) {
    await db.query(queries.INSERT_PLAYLIST, [name]);
  }

  static async delete(id: number) {
    return (await db.query(queries.DELETE_PLAYLIST, [id])).rowCount;
  }

  static async getAll() {
    const rows = (await db.query(queries.SELECT_ALL_PLAYLISTS)).rows;

    if (rows.length === 0) return [];

    const playlistMap = new Map<number, any>();
    for (const row of rows) {
      if (
        playlistMap.has(row.id) &&
        row.song_id !== null &&
        row.song_title !== null
      ) {
        playlistMap.get(row.id).songs.push({
          name: row.song_title,
          id: row.song_id,
          cover_url: row.song_cover_path
            ? ContentDelivery.fileToUrl(row.song_cover_path)
            : null
        });
      } else {
        playlistMap.set(row.id, {
          ...row,
          song_title: undefined,
          song_id: undefined,
          song_cover_path: undefined,
          songs:
            row.song_title === null || row.song_id === null
              ? []
              : [
                  {
                    title: row.song_title,
                    id: row.song_id,
                    cover_url: row.song_cover_path
                      ? ContentDelivery.fileToUrl(row.song_cover_path)
                      : null
                  }
                ]
        });
      }
    }
    return [...playlistMap.values()];
  }

  static async addSongToPlaylist(songId: number, playlistId: number) {
    return (await db.query(queries.ADD_SONG_TO_PLAYLIST, [songId, playlistId]))
      .rows;
  }

  static async removeSongFromPlaylist(songId: number, playlistId: number) {
    return (
      await db.query(queries.REMOVE_SONG_FROM_PLAYLIST, [songId, playlistId])
    ).rows;
  }
}
