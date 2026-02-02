import axiosInstance from "./axios";
import TokenManager from "./tokenManager";
import { logAuthEvent } from "./authDebugger";

export const verifyAuthCSR = async () => {
  try {
    // Check if we have a token using TokenManager
    const token = TokenManager.getAccessToken();
    console.log('CSR Auth - Token status:', token ? 'Found and valid' : 'Not found or expired');
    
    if (!token) {
      console.log('CSR Auth - No valid token available');
      logAuthEvent.authFailed({ reason: 'No token available for CSR verification' });
      return { authenticated: false };
    }
    
    console.log('CSR Auth - Sending verification request to:', `${axiosInstance.defaults.baseURL}/agent/verify-auth`);
    
    const response = await axiosInstance.get(`/agent/verify-auth`);
    console.log('CSR Auth Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    
    // Handle different response formats
    if (response.data) {
      // Check for different possible success indicators
      const isAuthenticated = response.data.authenticated || 
                             response.data.success || 
                             response.data.valid || 
                             (response.status === 200 && response.data.agentId);
      
      if (isAuthenticated) {
        logAuthEvent.authVerified({ 
          method: 'CSR',
          agentId: response.data.agentId || response.data.agent_id || response.data.userId
        });
        
        // Ensure we return the expected format
        return {
          authenticated: true,
          agentId: response.data.agentId || response.data.agent_id || response.data.userId || response.data.id,
          ...response.data
        };
      } else {
        console.log('CSR Auth - Server says not authenticated:', response.data);
        logAuthEvent.authFailed({ 
          reason: 'Server verification failed',
          response: response.data 
        });
        TokenManager.clearTokens();
        return { authenticated: false };
      }
    } else {
      console.error('CSR Auth - Empty response from server');
      logAuthEvent.authFailed({ reason: 'Empty response from server' });
      return { authenticated: false };
    }
    
  } catch (error: any) {
    console.error('CSR Auth Failed - Full error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    
    logAuthEvent.authFailed({ 
      error: error.message,
      status: error.response?.status,
      method: 'CSR'
    });
    
    // Only clear tokens on certain errors (not network errors)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('CSR Auth - Clearing tokens due to auth error');
      TokenManager.clearTokens();
    }
    
    return { authenticated: false };
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return TokenManager.isAuthenticated();
};

// Helper function to logout
export const logout = () => {
  TokenManager.clearTokens();
  
  // Redirect to signin after logout
  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
};
