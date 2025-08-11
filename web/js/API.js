export class API {
  /**
   *
   * @param {string} url
   * @param {RequestInit?} options
   * @returns {Promise<Response>}
   */
  static async request(url, options) {
    const token = localStorage.getItem('token');

    options ??= {};
    options.headers ??= {};
    options.headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers
    };

    return fetch(url, options);
  }
  /**
   * @returns {Promise<boolean>}
   */
  static async isLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const res = await fetch('/api/v1/admin/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.ok;
  }

  static async login(token) {
    const res = await fetch('/api/v1/admin/auth', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }

    return json.token;
  }

  static async getClients() {
    const res = await this.request('/api/v1/admin/clients');

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }

    return json.results;
  }

  static async createDevice(name) {
    const res = await this.request('/api/v1/admin/clients', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }
  }

  static async getClientToken(id) {
    const res = await this.request(`/api/v1/admin/clients/${id}/token`, {
      method: 'GET'
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }

    return json.token;
  }

  static async resetClientToken(id) {
    const res = await this.request(`/api/v1/admin/clients/${id}/reset-token`, {
      method: 'POST'
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }
  }

  static async deleteClient(id) {
    const res = await this.request(`/api/v1/admin/clients/${id}`, {
      method: 'DELETE'
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }
  }

  static async getSongs() {
    const res = await this.request('/api/v1/songs', {
      method: 'GET'
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }

    return json.results;
  }

  static async createSong(title) {
    const res = await this.request('/api/v1/songs', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title
      })
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }

    return json.id;
  }

  static async deleteSong(id) {
    const res = await this.request(`/api/v1/songs/${id}`, {
      method: 'DELETE'
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }
  }

  /**
   *
   * @param {number} songId
   * @param {File} file
   * @returns
   */
  static async uploadMedia(songId, file) {
    const res = await this.request(`/api/v1/songs/${songId}/media`, {
      method: 'POST',
      headers: {
        'content-type': file.type || 'application/octet-stream',
        'file-name': file.name
      },
      body: file,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }
  }

    /**
   *
   * @param {number} songId
   * @param {File} file
   * @returns
   */
  static async uploadCover(songId, file) {
    const res = await this.request(`/api/v1/songs/${songId}/cover`, {
      method: 'POST',
      headers: {
        'content-type': file.type || 'application/octet-stream',
        'file-name': file.name
      },
      body: file,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }
  }
}
