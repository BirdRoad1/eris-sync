import { API } from './API.js';

/**
 * @returns {HTMLDivElement}
 */
function createSongElement(song) {
  const songDiv = document.createElement('div');
  songDiv.classList.add('song');

  const pTitle = document.createElement('p');
  pTitle.textContent = song.title;
  pTitle.classList.add('song-title');
  songDiv.appendChild(pTitle);

  const album = document.createElement('p');
  album.textContent =
    song.album_name !== null ? 'Album: ' + song.album_name : 'Single';
  album.classList.add('song-album');
  songDiv.appendChild(album);

  if (song.release_year !== null) {
    const released = document.createElement('p');
    released.textContent = `Released: ${song.release_year}`;
    released.classList.add('song-release');
    songDiv.appendChild(released);
  }

  const mediaCount = document.createElement('p');
  mediaCount.textContent = 'Available media: ' + song.media_count;
  mediaCount.classList.add('song-media');
  songDiv.appendChild(mediaCount);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('buttons');
  songDiv.appendChild(buttonsDiv);

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
const filesDiv = document.getElementById('files');

/**
 * @type {File[]}
 */
let files = [];

function updateFiles() {
  filesDiv.replaceChildren();

  for (const file of files) {
    const elem = document.createElement('div');
    elem.classList.add('file');
    elem.addEventListener('click', () => {
      files = files.filter(f => f !== file);
      updateFiles();
    });
    const txt = document.createElement('p');
    txt.classList.add('file-text');
    txt.textContent = file.name;
    elem.appendChild(txt);

    filesDiv.appendChild(elem);
  }
}

/**
 * @type {HTMLInputElement}
 */
const uploadInput = document.getElementById('upload');
uploadInput.addEventListener('change', async () => {
  console.log(1);
  for (const file of uploadInput.files) {
    files.push(file);
  }

  updateFiles();
  // const reader = new Int8Array(await uploadInput.files[0].arrayBuffer());
});

const titleInput = document.getElementById('title-input');
const form = document.getElementById('create-song-form');
form.addEventListener('submit', async ev => {
  ev.preventDefault();
  ev.stopPropagation();

  // Create song
  const songId = await API.createSong(titleInput.value);
  console.log('Song id:', songId);

  // Upload files to new song
  for (const file of files) {
    console.log(`Uploading ${file.name}`);
    try {
      await API.uploadMedia(songId, file);
    } catch (err) {
      alert(`Failed to upload ${file.name}: ${err.message}`);
    }
  }

  createSongDialog.close();
});
