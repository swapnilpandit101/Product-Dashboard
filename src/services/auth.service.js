import api from '../lib/axios';

/**
 * ARCHITECTURAL DECISION: Authentication Service
 * 
 * WHY THIS SERVICE EXISTS:
 * Encapsulates all authentication endpoint details (POST /auth/login, GET /auth/me),
 * keeping UI components decoupled from specific endpoint URLs and payload contracts.
 */
export const authService = {
  /**
   * Log in user with DummyJSON credentials (e.g. emilys / emilyspass)
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60,
    });
    return response.data;
  },

  /**
   * Retrieve current authenticated user profile
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
