import { API } from './API.js';

const noDevicesText = document.getElementById('no-devices');

/**
 * @typedef {Object} Device
 * @property {number} id
 * @property {string} name
 * @property {string | null} device_model
 * @property {string | null} last_seen
 */

/**
 * @param {Device} device
 * @returns {HTMLDivElement}
 */
function createDeviceElement(device) {
  const deviceDiv = document.createElement('div');
  deviceDiv.classList.add('device');

  const pDeviceName = document.createElement('p');
  pDeviceName.textContent = device.name;
  pDeviceName.classList.add('device-name');
  deviceDiv.appendChild(pDeviceName);

  const pModel = document.createElement('p');
  pModel.textContent = `Model: ${device.device_model ?? 'Unknown'}`;
  deviceDiv.appendChild(pModel);

  const pLastActive = document.createElement('p');
  pLastActive.textContent = `Last active: ${
    device.last_seen ? new Date(device.last_seen).toLocaleDateString() : 'N/A'
  }`;
  deviceDiv.appendChild(pLastActive);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('buttons');
  deviceDiv.appendChild(buttonsDiv);

  const resetTokenBtn = document.createElement('button');
  resetTokenBtn.classList.add('reset-token-btn');
  resetTokenBtn.textContent = 'Reset Token';
  resetTokenBtn.addEventListener('click', () => {
    API.resetClientToken(device.id)
      .then(() => {
        resetTokenBtn.textContent = 'Done!';
        setTimeout(() => {
          resetTokenBtn.textContent = 'Reset Token';
        }, 1000);
      })
      .catch(err => {
        alert('Reset token failed: ' + err.message);
      });
  });
  buttonsDiv.appendChild(resetTokenBtn);

  const copyTokenBtn = document.createElement('button');
  copyTokenBtn.classList.add('reset-token-btn');
  copyTokenBtn.textContent = 'Copy Token';
  copyTokenBtn.addEventListener('click', () => {
    API.getClientToken(device.id)
      .then(token => {
        navigator.clipboard.writeText(token);
        copyTokenBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyTokenBtn.textContent = 'Copy Token';
        }, 1000);
      })
      .catch(err => {
        alert('Failed to fetch token: ' + err.message);
      });
  });
  buttonsDiv.appendChild(copyTokenBtn);

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove-btn');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    API.deleteClient(device.id)
      .then(() => {
        location.reload();
      })
      .catch(err => {
        alert('Delete failed: ' + err.message);
      });
  });
  buttonsDiv.appendChild(removeBtn);

  return deviceDiv;
}

const devicesElem = document.getElementById('devices');

document.addEventListener('DOMContentLoaded', async () => {
  if (!(await API.isLoggedIn())) {
    location.href = '/';
    return;
  }

  try {
    const clients = await API.getClients();
    for (const client of clients) {
      const elem = createDeviceElement(client);
      devicesElem.appendChild(elem);
    }

    if (clients.length === 0) {
      noDevicesText.classList.add('visible');
    }

    console.log(clients);
  } catch (err) {
    alert('Failed to get clients: ' + err.message);
  }
});

const newDeviceBtn = document.getElementById('new-device-btn');
newDeviceBtn.addEventListener('click', () => {
  const name = prompt('Enter the device name:');
  if (!name) return;

  API.createDevice(name)
    .then(() => {
      location.reload();
    })
    .catch(err => {
      alert('Failed to create device: ' + err.message);
    });
});

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  location.href = '/';
});
