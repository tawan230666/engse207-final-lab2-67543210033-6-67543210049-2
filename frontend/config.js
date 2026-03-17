const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

window.APP_CONFIG = {
  AUTH_URL: isLocal ? 'http://localhost:3001' : 'https://auth-service-production-1320.up.railway.app',
  TASK_URL: isLocal ? 'http://localhost:3002' : 'https://task-service-production-2930.up.railway.app', 
  USER_URL: isLocal ? 'http://localhost:3003' : 'https://user-service-production-901e.up.railway.app'
};
