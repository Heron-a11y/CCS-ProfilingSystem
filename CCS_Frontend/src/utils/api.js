const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Utility function to handle API requests.
 * Automatically adds headers for JSON and handles error parsing.
 */
export const fetchApi = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Attempt to parse JSON response
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`Fetch API Error on ${endpoint}:`, error);
    throw error;
  }
};

// API Endpoints
export const api = {
  students: {
    getAll: () => fetchApi('/students'),
    get: (id) => fetchApi(`/students/${id}`),
    create: (data) => fetchApi('/students', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/students/${id}`, { method: 'DELETE' }),
  },
  departments: {
    getAll: () => fetchApi('/departments'),
  },
  courses: {
    getAll: () => fetchApi('/courses'),
  },
  faculties: {
    getAll: () => fetchApi('/faculties'),
    get: (id) => fetchApi(`/faculties/${id}`),
    create: (data) => fetchApi('/faculties', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/faculties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/faculties/${id}`, { method: 'DELETE' }),
  },
  subjects: {
    getAll: () => fetchApi('/subjects'),
    create: (data) => fetchApi('/subjects', { method: 'POST', body: JSON.stringify(data) }),
  },
  sections: {
    getAll: () => fetchApi('/sections'),
  },
  schedules: {
    getAll: () => fetchApi('/schedules'),
    create: (data) => fetchApi('/schedules', { method: 'POST', body: JSON.stringify(data) }),
  },
  events: {
    getAll: () => fetchApi('/events'),
    get: (id) => fetchApi(`/events/${id}`),
    create: (data) => fetchApi('/events', { method: 'POST', body: JSON.stringify(data) }),
  }
};
