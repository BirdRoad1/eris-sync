import { API } from './API.js';

API.getSongs()
  .then(songs => {
    console.log(songs);
  })
  .catch(err => {
    alert('Failed to get songs: ' + err.message);
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

const form = document.getElementById('create-song-form');
form.addEventListener('submit', async ev => {
  ev.preventDefault();
  ev.stopPropagation();

  // Create song
  const songId = await API.createSong('Hello, world!');
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
