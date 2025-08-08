import { API } from './API.js';

const errorContainer = document.getElementById('error-container');
const adminInput = document.getElementById('admin-input');
const loginForm = document.getElementById('login-form');

/**
 * @param {string | undefined} text
 */
function displayError(text) {
  if (text === undefined) {
    errorContainer.classList.remove('visible');
    errorContainer.textContent = '';
    return;
  }

  errorContainer.classList.add('visible');
  errorContainer.textContent = text;
}

loginForm.addEventListener('submit', async ev => {
  ev.preventDefault();
  ev.stopPropagation();

  const token = adminInput.value;
  if (!token) {
    displayError('Please enter a valid token.');
    return;
  }

  let adminToken;
  try {
    adminToken = await API.login(token);
  } catch (err) {
    displayError(err.message);
    return;
  }

  displayError();
  localStorage.setItem('token', adminToken);
  location.href = '/';

  // alert(token);
});
