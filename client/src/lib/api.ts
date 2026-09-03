// Handling authentication and token management
import axios, { AxiosHeaders } from 'axios';

export const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// this is run before any request to attach the authorization header if a token exists
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export function getToken() {
  return localStorage.getItem('spoonful_token');
}

export function getUserId() {
  const token = getToken();
  if (!token) return null; // no logged in user
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { user?: { _id?: string } };
    return payload.user?._id ?? null;
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  localStorage.setItem('spoonful_token', token);
}

export function clearToken() {
  localStorage.removeItem('spoonful_token');
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
