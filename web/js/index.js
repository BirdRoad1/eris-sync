import { API } from './API.js';

API.isLoggedIn().then(loggedIn => {
  if (loggedIn) {
    location.href = '/panel';
  } else {
    location.href = '/login';
  }
});
