/**
 * Centralized API Configuration for LogiTrack Frontend
 * Reads from VITE_API_URL environment variable in production,
 * falling back to http://localhost:5000 in local development.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export default API_BASE_URL;
