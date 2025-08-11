import { API } from './API.js';

/**
 * @returns {HTMLDivElement}
 */
function createSongElement(song) {
  const songDiv = document.createElement('div');
  songDiv.classList.add('song');

  const img = document.createElement('img');
  img.classList.add('song-cover');

  API.request(song.cover_url)
    .then(res => res.blob())
    .then(blob => (img.src = URL.createObjectURL(blob)));
  songDiv.appendChild(img);

  const songRight = document.createElement('div');
  songRight.classList.add('song-right');
  songDiv.appendChild(songRight);

  const pTitle = document.createElement('p');
  pTitle.textContent = song.title;
  pTitle.classList.add('song-title');
  songRight.appendChild(pTitle);

  const album = document.createElement('p');
  album.textContent =
    song.album_name !== null ? 'Album: ' + song.album_name : 'Single';
  album.classList.add('song-album');
  songRight.appendChild(album);

  if (song.release_year !== null) {
    const released = document.createElement('p');
    released.textContent = `Released: ${song.release_year}`;
    released.classList.add('song-release');
    songRight.appendChild(released);
  }

  const mediaCount = document.createElement('p');
  mediaCount.textContent = 'Available media: ' + song.media_count;
  mediaCount.classList.add('song-media');
  songRight.appendChild(mediaCount);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('buttons');
  songRight.appendChild(buttonsDiv);

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove-btn');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    API.deleteSong(song.id)
      .then(() => {
        songDiv.remove();
      })
      .catch(err => {
        alert('Delete failed: ' + err.message);
      });
  });
  buttonsDiv.appendChild(removeBtn);

  return songDiv;
}

const songsDiv = document.getElementById('songs');
document.addEventListener('DOMContentLoaded', async () => {
  let songs;
  try {
    songs = await API.getSongs();
  } catch (err) {
    alert('Failed to get songs: ' + err.message);
    return;
  }

  for (const song of songs) {
    songsDiv.appendChild(createSongElement(song));
    console.log(song);
  }
});

/**
 * @type {HTMLDialogElement}
 */
const createSongDialog = document.getElementById('create-song-dialog');

document.getElementById('new-song-btn').addEventListener('click', () => {
  createSongDialog.showModal();
});

createSongDialog.addEventListener('click', ev => {
  if (ev.target === createSongDialog) {
    createSongDialog.close();
  }
});

/**
 * @type {HTMLDivElement}
 */
const mediaFilesDiv = document.getElementById('media-files');

/**
 * @type {File[]}
 */
let mediaFiles = [];

function updateMediaFiles() {
  mediaFilesDiv.replaceChildren();

  for (const file of mediaFiles) {
    const elem = document.createElement('div');
    elem.classList.add('file');
    elem.addEventListener('click', () => {
      mediaFiles = mediaFiles.filter(f => f !== file);
      updateMediaFiles();
    });
    const txt = document.createElement('p');
    txt.classList.add('file-text');
    txt.textContent = file.name;
    elem.appendChild(txt);

    mediaFilesDiv.appendChild(elem);
  }
}

/**
 * @type {HTMLDivElement}
 */
const coverFilesDiv = document.getElementById('cover-files');

/**
 * @type {File | undefined}
 */
let coverFile;

function updateCoverFile() {
  coverFilesDiv.replaceChildren();
  if (!coverFile) return;

  const elem = document.createElement('div');
  elem.classList.add('file');
  elem.addEventListener('click', () => {
    coverFile = undefined;
    updateCoverFile();
  });

  const txt = document.createElement('p');
  txt.classList.add('file-text');
  txt.textContent = coverFile.name;
  elem.appendChild(txt);

  coverFilesDiv.appendChild(elem);
}

/**
 * @type {HTMLInputElement}
 */
const uploadMediaInput = document.getElementById('upload');
uploadMediaInput.addEventListener('change', async () => {
  for (const file of uploadMediaInput.files) {
    mediaFiles.push(file);
  }

  updateMediaFiles();
});

const uploadCoverInput = document.getElementById('upload-cover');
uploadCoverInput.addEventListener('change', async () => {
  if (uploadCoverInput.files.length === 0) return;
  coverFile = uploadCoverInput.files[0];

  updateCoverFile();
});

const titleInput = document.getElementById('title-input');
const form = document.getElementById('create-song-form');
form.addEventListener('submit', async ev => {
  ev.preventDefault();
  ev.stopPropagation();

  const title = titleInput.value;
  if (!title) {
    alert('Please enter a title');
    return;
  }

  // Create song
  let songId;
  try {
    songId = await API.createSong(title);
  } catch (err) {
    alert(`Failed to create song: ${err.message}`);
    return;
  }

  // Upload files to new song
  for (const file of mediaFiles) {
    try {
      await API.uploadMedia(songId, file);
    } catch (err) {
      alert(`Failed to upload ${file.name}: ${err.message}`);
    }
  }

  if (coverFile) {
    try {
      await API.uploadCover(songId, coverFile);
    } catch (err) {
      alert(`Failed to upload ${coverFile.name}: ${err.message}`);
    }
  }

  createSongDialog.close();
});
