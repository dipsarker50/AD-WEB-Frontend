import TokenManager from './tokenManager';
import { verifyAuthCSR } from './authCSR';
import axiosInstance from './axios';

/**
 * Test utility to debug authentication issues
 */
export const testAuth = {
  /**
   * Test token storage and retrieval
   */
  async testTokens() {
    console.group('🧪 Testing Token Operations');
    
    // Test token storage
    const testToken = 'test.token.value';
    const testAgentId = 'test-agent-123';
    
    console.log('1. Storing test tokens...');
    TokenManager.setTokens({
      access_token: testToken,
      agentId: testAgentId
    });
    
    console.log('2. Retrieving stored tokens...');
    const retrieved = TokenManager.getTokenData();
    console.log('Retrieved:', retrieved);
    
    console.log('3. Checking authentication status...');
    const isAuth = TokenManager.isAuthenticated();
    console.log('Is authenticated:', isAuth);
    
    console.log('4. Cleaning up test tokens...');
    TokenManager.clearTokens();
    
    console.groupEnd();
    return { success: !!retrieved, retrieved };
  },

  /**
   * Test CSR authentication with current tokens
   */
  async testCSR() {
    console.group('🧪 Testing CSR Authentication');
    
    console.log('1. Current token status...');
    const tokenData = TokenManager.getTokenData();
    console.log('Token data:', tokenData);
    
    if (!tokenData) {
      console.log('❌ No tokens found - cannot test CSR');
      console.groupEnd();
      return { success: false, error: 'No tokens' };
    }
    
    console.log('2. Testing CSR verification...');
    try {
      const result = await verifyAuthCSR();
      console.log('✅ CSR result:', result);
      console.groupEnd();
      return { success: result.authenticated, result };
    } catch (error) {
      console.log('❌ CSR failed:', error);
      console.groupEnd();
      return { success: false, error };
    }
  },

  /**
   * Test backend connectivity
   */
  async testBackend() {
    console.group('🧪 Testing Backend Connectivity');
    
    console.log('1. Testing basic connectivity...');
    console.log('Base URL:', axiosInstance.defaults.baseURL);
    
    try {
      // Try a simple request (you might need to adjust this endpoint)
      const response = await axiosInstance.get('/health');
      console.log('✅ Backend is reachable:', response.status);
      console.groupEnd();
      return { success: true, status: response.status };
    } catch (error: any) {
      console.log('❌ Backend connectivity failed:', {
        message: error.message,
        status: error.response?.status,
        baseURL: axiosInstance.defaults.baseURL
      });
      console.groupEnd();
      return { success: false, error };
    }
  },

  /**
   * Full authentication flow test
   */
  async testFullFlow() {
    console.group('🧪 Testing Full Authentication Flow');
    
    const results = {
      tokens: false,
      backend: false,
      csr: false
    };
    
    console.log('Testing token operations...');
    const tokenTest = await this.testTokens();
    results.tokens = tokenTest.success;
    
    console.log('Testing backend connectivity...');
    const backendTest = await this.testBackend();
    results.backend = backendTest.success;
    
    console.log('Testing CSR authentication...');
    const csrTest = await this.testCSR();
    results.csr = csrTest.success;
    
    console.log('📊 Test Results Summary:', results);
    console.groupEnd();
    
    return results;
  }
};

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).testAuth = testAuth;
}

export default testAuth;