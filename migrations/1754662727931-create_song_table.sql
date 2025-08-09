CREATE TABLE IF NOT EXISTS artist (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  cover_path TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS album (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  cover_path TEXT,
  genre TEXT,
  release_year INT CHECK (release_year > 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS album_artist (
  album_id INT NOT NULL,
  artist_id INT NOT NULL,

  PRIMARY KEY (album_id, artist_id),
  CONSTRAINT fk_album_artist_album FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE,
  CONSTRAINT fk_album_artist_artist FOREIGN KEY(artist_id) REFERENCES artist(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS song (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  album_id INT,
  cover_path TEXT,
  release_year INT CHECK (release_year > 0),
  duration_seconds INT CHECK (duration_seconds > 0),
  lyrics_url TEXT,
  genre TEXT,
  track_number INT CHECK (track_number > 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE (album_id, track_number),
  CONSTRAINT fk_song_album FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS song_artist (
  song_id INT NOT NULL,
  artist_id INT NOT NULL,

  PRIMARY KEY (song_id, artist_id),
  CONSTRAINT fk_song_artist_song FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE,
  CONSTRAINT fk_song_artist_artist FOREIGN KEY(artist_id) REFERENCES artist(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS song_media (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mime_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  song_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_song_media_song FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_album_artist_album_id ON album_artist(album_id);
CREATE INDEX IF NOT EXISTS idx_album_artist_artist_id ON album_artist(artist_id);
CREATE INDEX IF NOT EXISTS idx_song_album_id ON song(album_id);
CREATE INDEX IF NOT EXISTS idx_song_artist_song_id ON song_artist(song_id);
CREATE INDEX IF NOT EXISTS idx_song_artist_artist_id ON song_artist(artist_id);
CREATE INDEX IF NOT EXISTS idx_song_media_song_id ON song_media(song_id);