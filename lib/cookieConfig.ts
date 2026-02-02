/**
 * Cookie configuration for production environments
 * This handles proper cookie settings for HTTPS/production deployments
 */

interface CookieConfig {
  sameSite: 'strict' | 'lax' | 'none';
  secure: boolean;
  httpOnly: boolean;
  domain?: string;
  path: string;
}

export class CookieConfigManager {
  private static isProduction = process.env.NODE_ENV === 'production';
  private static isHTTPS = typeof window !== 'undefined' ? window.location.protocol === 'https:' : true; // Default to true for SSR
  private static isVercel = typeof process !== 'undefined' && process.env.VERCEL === '1';

  /**
   * Get production-ready cookie configuration
   */
  static getConfig(): CookieConfig {
    // For Vercel and production, use stricter settings
    const isProductionEnvironment = this.isProduction || this.isVercel;
    
    return {
      sameSite: isProductionEnvironment ? 'none' : 'lax', // 'none' required for cross-origin in production
      secure: isProductionEnvironment ? true : this.isHTTPS, // Always secure in production
      httpOnly: false, // Must be false for client-side access
      path: '/',
      // Domain should be set by backend, not frontend
    };
  }

  /**
   * Get axios configuration for cookies
   */
  static getAxiosConfig() {
    return {
      withCredentials: true,
      // Additional headers for CORS in production
      headers: {
        'Access-Control-Allow-Credentials': 'true',
      }
    };
  }

  /**
   * Check if cookies are supported and working
   */
  static isCookieSupported(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      // Test cookie setting
      const testCookie = 'test_cookie_support=1';
      document.cookie = testCookie;
      const supported = document.cookie.indexOf(testCookie) !== -1;
      
      // Clean up test cookie
      document.cookie = 'test_cookie_support=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      
      return supported;
    } catch (error) {
      console.warn('Cookie support test failed:', error);
      return false;
    }
  }

  /**
   * Get environment info for debugging
   */
  static getEnvironmentInfo() {
    return {
      isProduction: this.isProduction,
      isHTTPS: this.isHTTPS,
      cookiesSupported: this.isCookieSupported(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      domain: typeof window !== 'undefined' ? window.location.hostname : 'Unknown',
      origin: typeof window !== 'undefined' ? window.location.origin : 'Unknown',
    };
  }

  /**
   * Log configuration info for debugging
   */
  static logConfigInfo() {
    const config = this.getConfig();
    const envInfo = this.getEnvironmentInfo();
    
    console.log('Cookie Configuration:', {
      config,
      environment: envInfo
    });
  }
}

/**
 * Helper function to set a cookie manually (if needed)
 */
export const setCookie = (name: string, value: string, options: Partial<CookieConfig> = {}) => {
  if (typeof window === 'undefined') return;

  const config = CookieConfigManager.getConfig();
  const finalOptions = { ...config, ...options };
  
  let cookieString = `${name}=${value}`;
  cookieString += `; path=${finalOptions.path}`;
  cookieString += `; SameSite=${finalOptions.sameSite}`;
  
  if (finalOptions.secure) {
    cookieString += '; Secure';
  }
  
  if (finalOptions.domain) {
    cookieString += `; Domain=${finalOptions.domain}`;
  }
  
  // Note: HttpOnly cannot be set from client-side JavaScript
  document.cookie = cookieString;
};

/**
 * Helper function to get a cookie value
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

/**
 * Helper function to delete a cookie
 */
export const deleteCookie = (name: string, options: Partial<CookieConfig> = {}) => {
  setCookie(name, '', { ...options, secure: false }); // Set expiry to past
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${options.path || '/'}`;
};

export default CookieConfigManager;