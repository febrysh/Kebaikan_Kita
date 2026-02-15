// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    return authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  verify: async () => {
    return authFetch('/auth/verify');
  },

  logout: async () => {
    return authFetch('/auth/logout', { method: 'POST' });
  },
};

// Campaigns API
export const campaignsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return authFetch(`/campaigns${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return authFetch(`/campaigns/${id}`);
  },

  create: async (campaignData) => {
    return authFetch('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  },

  update: async (id, campaignData) => {
    return authFetch(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  },

  delete: async (id) => {
    return authFetch(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return authFetch('/campaigns/stats/summary');
  },
};

// Donations API
export const donationsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return authFetch(`/donations${queryString ? `?${queryString}` : ''}`);
  },

  create: async (donationData) => {
    return authFetch('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  },

  verify: async (id, status) => {
    return authFetch(`/donations/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id) => {
    return authFetch(`/donations/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return authFetch('/donations/stats/summary');
  },
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    return authFetch('/settings');
  },

  getByKey: async (key) => {
    return authFetch(`/settings/${key}`);
  },

  update: async (key, value) => {
    return authFetch(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  },

  bulkUpdate: async (settings) => {
    return authFetch('/settings/bulk', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  },

  create: async (key, value, type) => {
    return authFetch('/settings', {
      method: 'POST',
      body: JSON.stringify({ key, value, type }),
    });
  },

  delete: async (key) => {
    return authFetch(`/settings/${key}`, {
      method: 'DELETE',
    });
  },
};

// Upload API
export const uploadAPI = {
  logo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('type', 'logos');

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload/logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  },

  banner: async (file) => {
    const formData = new FormData();
    formData.append('banner', file);
    formData.append('type', 'banners');

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload/banner`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  },

  campaignImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'campaigns');

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload/campaign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  },

  deleteFile: async (type, filename) => {
    return authFetch(`/upload/${type}/${filename}`, {
      method: 'DELETE',
    });
  },
};

// Helper to save token
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper to remove token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};
