export const environment = {
  production: false,
  hmr: true,

  /**
   * URL base para las llamadas a la API REST.
   */
  apiUrl: "/services/sandbox",
  apiRetries: 0,
  apiCacheSize: 1000,

  /**
   * Tiempo máximo (en milisegundos) que la app esperará respuesta de la API
   */
  API_BASE_URL: 'http://localhost:8000',
  API_TIMEOUT: 30000,
  STORAGE_PREFIX: 'trivia_app_',
};
