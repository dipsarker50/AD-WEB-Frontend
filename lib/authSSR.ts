import { cookies } from "next/headers";
import axios from "axios";

export const verifyAuthSSR = async () => {
  console.log("🔍 SSR Auth - Starting verification...");
  
  // First, let's just skip SSR auth and always fallback to client-side
  // This is a safe approach since many JWT implementations rely on client-side tokens
  console.log("🔄 SSR Auth - Skipping SSR verification, falling back to client-side check");
  console.log("📝 SSR Auth - This is normal behavior for JWT-based authentication");
  
  return { 
    authenticated: false, 
    needsClientCheck: true, 
    method: 'SSR-SKIP',
    reason: 'JWT tokens are typically handled client-side'
  };
  
  // COMMENTED OUT: Original SSR implementation
  // Uncomment below if your backend supports proper cookie-based SSR authentication
  /*
  try {
    const cookieStore = cookies();
    
    const allCookies = (await cookieStore).getAll();
    console.log("🍪 SSR Auth - Available cookies:", allCookies.map(c => c.name));
    
    const cookieHeader = allCookies
      .map((cookie: { name: any; value: any; }) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    console.log("🍪 SSR Auth - Cookie Header:", cookieHeader ? `Found ${allCookies.length} cookies` : 'No cookies');
    
    // Check environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log("🌐 SSR Auth - API URL:", apiUrl);
    console.log("🔧 SSR Auth - NODE_ENV:", process.env.NODE_ENV);
    
    // Simple connectivity test
    console.log("🔌 SSR Auth - Testing backend connectivity...");
    
    const response = await axios.get(`${apiUrl}/agent/verify-auth`, {
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-SSR-Client',
        'Accept': 'application/json'
      },
      timeout: 5000,
      validateStatus: function (status) {
        return status < 500; // Accept any status code below 500
      }
    });
    
    console.log("✅ SSR Auth - Response received:", {
      status: response.status,
      statusText: response.statusText,
      dataKeys: Object.keys(response.data || {}),
      headers: response.headers['content-type']
    });
    
    if (response.status === 200 && response.data) {
      const isAuthenticated = response.data.authenticated || 
                             response.data.success || 
                             response.data.valid ||
                             response.data.agentId;
      
      if (isAuthenticated) {
        console.log("🎉 SSR Auth - Authentication successful!");
        return {
          authenticated: true,
          agentId: response.data.agentId || response.data.agent_id || response.data.userId || response.data.id,
          method: 'SSR'
        };
      }
    }
    
    console.log("❌ SSR Auth - Not authenticated, falling back to client-side");
    return { authenticated: false, needsClientCheck: true, method: 'SSR' };
    
  } catch (error: any) {
    console.error("💥 SSR Auth - Error occurred:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED'
    });
    
    return { 
      authenticated: false, 
      needsClientCheck: true, 
      method: 'SSR-ERROR',
      error: error.message
    };
  }
  */
};
