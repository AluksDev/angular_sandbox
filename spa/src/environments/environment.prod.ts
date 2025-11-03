export const environment = {
  production: true,
  hmr: false,

  /**
   * URL base para las llamadas a la API REST.
   */
  apiUrl: "/services/sandbox",
  apiRetries: 12,
  apiCacheSize: 1000,

  /**
   * Tiempo máximo (en milisegundos) que la app esperará respuesta de la API
   */
  API_TIMEOUT: 30000,
  STORAGE_PREFIX: 'trivia_app_',
};
