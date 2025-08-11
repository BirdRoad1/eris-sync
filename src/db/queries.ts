export const queries = {
  INSERT_CLIENT:
    'INSERT INTO client (name, private_token) VALUES ($1::text, $2::text)',
  DELETE_CLIENT: 'DELETE FROM client WHERE id=$1 RETURNING id',
  SELECT_ALL_CLIENTS: 'SELECT id,name,device_model,last_seen FROM client',
  SELECT_CLIENT_BY_TOKEN:
    'SELECT id,name,device_model,last_seen FROM client WHERE private_token=$1::text',
  SELECT_CLIENT_BY_ID: 'SELECT private_token FROM client WHERE id=$1',
  UPDATE_CLIENT_TOKEN: 'UPDATE client SET private_token=$1 WHERE id=$2',
  INSERT_SONG_MEDIA:
    'INSERT INTO song_media (mime_type, file_path, song_id) VALUES ($1, $2, $3) RETURNING id',
  SELECT_SONG_MEDIA_BY_SONG:
    'SELECT id,mime_type,file_path FROM song_media WHERE song_id=$1',
  INSERT_ALBUM:
    'INSERT INTO album (name, cover_path, genre, release_year) VALUES ($1, $2, $3, $4)',
  INSERT_SONG:
    'INSERT INTO song (title, artist_id, cover_path, release_year, duration_seconds, lyrics_url, genre, track_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
  DELETE_SONG: 'DELETE FROM song WHERE id=$1 RETURNING id',
  SELECT_ALL_SONGS: `SELECT s.id,s.title,s.album_id,s.cover_path,s.release_year,s.duration_seconds,s.lyrics_url,s.genre,s.track_number, COALESCE(CAST(m.media_count AS INTEGER), 0) as media_count, a.name as album_name, a.cover_path as album_cover_path, artist.name as artist_name
        FROM song s
        LEFT JOIN 
          (
            SELECT song_id,COUNT(*) as media_count
            FROM song_media
            GROUP BY song_id
          ) m
          ON s.id = m.song_id
        LEFT JOIN
          album AS a
          ON s.album_id = a.id
        LEFT JOIN
          artist AS artist
          ON s.artist_id = artist.id;`,
  SELECT_SONG_BY_ID: `SELECT s.id,s.title,s.album_id,s.cover_path,s.release_year,s.duration_seconds,s.lyrics_url,s.genre,s.track_number,COALESCE(CAST(m.media_count AS INTEGER), 0) as media_count, a.name as album_name, a.cover_path as album_cover_path
  FROM song s
  LEFT JOIN 
      (
        SELECT song_id,COUNT(*) as media_count
        FROM song_media
        GROUP BY song_id
      ) m
      ON m.song_id = s.id
    LEFT JOIN
      album AS a
      ON a.id = s.album_id
    WHERE s.id = $1;`,
  UPDATE_SONG_COVER: 'UPDATE song SET cover_path=$2 WHERE id=$1',
  INSERT_ARTIST: 'INSERT INTO artist (name) VALUES ($1) RETURNING id',
  SELECT_ALL_ARTISTS: `SELECT a.id,a.name,a.cover_path,COALESCE(CAST(s.song_count AS INTEGER), 0) as song_count
  FROM artist a
  LEFT JOIN 
      (
        SELECT artist_id,COUNT(*) as song_count
        FROM song
        GROUP BY artist_id
      ) s
      ON s.artist_id = a.id
  `,
  SELECT_ARTIST_BY_ID: `SELECT a.name,a.cover_path,COALESCE(CAST(s.song_count AS INTEGER), 0) as song_count
  FROM artist a
  LEFT JOIN 
      (
        SELECT artist_id,COUNT(*) as song_count
        FROM song
        GROUP BY artist_id
      ) s
      ON s.artist_id = a.id
  WHERE id=$1`,
  UPDATE_ARTIST_COVER: 'UPDATE artist SET cover_path=$2 WHERE id=$1',
  DELETE_ARTIST: 'DELETE FROM artist WHERE id=$1 RETURNING id',
  SEARCH_ARTIST: `SELECT * FROM artist WHERE name LIKE '%' || $1 || '%'`
};
