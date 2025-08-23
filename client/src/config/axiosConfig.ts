import axios from 'axios';

// Configuration globale d'Axios pour l'authentification
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

// Intercepteur de requête - S'exécute AVANT chaque requête
axios.interceptors.request.use(
  (config) => {
    console.log(`[AXIOS] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[AXIOS] Request error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - S'exécute APRÈS chaque réponse
axios.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('[AXIOS] 401 Unauthorized - Token expired or invalid');
      // Future : refresh token automatique ici
    }
    console.error(`[AXIOS] Error ${error.response?.status}:`, error.response?.data);
    return Promise.reject(error);
  }
);

export default axios;