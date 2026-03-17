const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
window.APP_CONFIG = {
  AUTH_URL: isLocal ? 'http://localhost:3001' : 'https://auth-service-production-7268.up.railway.app',
  TASK_URL: isLocal ? 'http://localhost:3002' : 'https://task-service-production-747e.up.railway.app',
  USER_URL: isLocal ? 'http://localhost:3003' : 'https://user-service-production-57b1.up.railway.app'
};
