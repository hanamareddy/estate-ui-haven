const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const mongoAuthService = {
  setAuthData: (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken: () => {
    return localStorage.getItem('token') || '';
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  loginWithGoogle: async (credential: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      if (!response.ok) {
        throw new Error('Google authentication failed');
      }

      const data = await response.json();
      
      // Save token and user data
      if (data.token && data.user) {
        mongoAuthService.setAuthData(data.token, data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },
};

export default mongoAuthService;
