import axios from 'axios';
import TokenManager from './tokenManager';
import CookieConfigManager from './cookieConfig';
import VercelConfigManager from './vercelConfig';
import { logAuthEvent } from './authDebugger';

// Get Vercel-optimized configuration
const axiosConfig = VercelConfigManager.getAxiosConfig();

const axiosInstance = axios.create(axiosConfig);

// Log configuration info in development and validate environment
if (process.env.NODE_ENV !== 'production') {
  CookieConfigManager.logConfigInfo();
  VercelConfigManager.logEnvironmentInfo();
  
  const validation = VercelConfigManager.validateEnvironment();
  if (!validation.isValid) {
    console.warn('Environment validation failed:', validation.errors);
  }
}

// Request interceptor to add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const authHeader = TokenManager.getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logAuthEvent.authFailed({ 
        reason: '401 Unauthorized', 
        url: error.config?.url 
      });
      
      // Clear stored tokens on 401 Unauthorized
      TokenManager.clearTokens();
      
      // Only redirect if we're on the client side and not already on signin page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/signin')) {
        console.log('401 Unauthorized - redirecting to signin');
        window.location.href = '/signin';
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      logAuthEvent.networkError({ 
        type: 'timeout', 
        url: error.config?.url 
      });
    } else if (error.response?.status >= 500) {
      logAuthEvent.networkError({ 
        status: error.response.status, 
        url: error.config?.url 
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;