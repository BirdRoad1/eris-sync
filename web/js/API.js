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

    return json.result;
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
}
