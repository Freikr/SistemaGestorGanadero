const API_BASE_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

function removeToken() {
  localStorage.removeItem('token');
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.mensaje || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Error de formato en la respuesta del servidor');
    }
    throw error;
  }
}

async function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

async function post(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

async function put(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

async function patch(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

module.exports = {
  getToken,
  setToken,
  removeToken,
  get,
  post,
  put,
  patch,
  delete: del,
};
