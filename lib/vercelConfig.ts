/**
 * Vercel-specific configuration and utilities
 * This handles environment detection and production-ready settings for Vercel deployment
 */

interface VercelEnvironment {
  isVercel: boolean;
  isProduction: boolean;
  isPreview: boolean;
  environment: 'development' | 'preview' | 'production';
  url?: string;
  region?: string;
}

export class VercelConfigManager {
  /**
   * Detect Vercel environment and configuration
   */
  static getEnvironment(): VercelEnvironment {
    const isVercel = typeof process !== 'undefined' && process.env.VERCEL === '1';
    const vercelEnv = process.env.VERCEL_ENV;
    const isProduction = process.env.NODE_ENV === 'production' || vercelEnv === 'production';
    const isPreview = vercelEnv === 'preview';
    
    return {
      isVercel,
      isProduction,
      isPreview,
      environment: isProduction ? 'production' : isPreview ? 'preview' : 'development',
      url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
      region: process.env.VERCEL_REGION,
    };
  }

  /**
   * Get the correct API base URL based on environment
   */
  static getApiBaseUrl(): string {
    const env = this.getEnvironment();
    
    // Always use the production backend URL if available
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Fallback for development
    if (!env.isVercel && !env.isProduction) {
      return 'http://localhost:3000';
    }
    
    // If no API URL is configured and we're in production, throw error
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required for production deployment');
  }

  /**
   * Get axios configuration optimized for Vercel
   */
  static getAxiosConfig() {
    const env = this.getEnvironment();
    const baseURL = this.getApiBaseUrl();
    
    return {
      baseURL,
      timeout: env.isProduction ? 30000 : 10000, // Longer timeout in production
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        // Add Vercel-specific headers if needed
        ...(env.isVercel && {
          'X-Vercel-Deployment': '1'
        })
      }
    };
  }

  /**
   * Check if the application is running in a secure context
   */
  static isSecureContext(): boolean {
    if (typeof window === 'undefined') {
      // On server side, assume secure if in production
      return this.getEnvironment().isProduction;
    }
    
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  }

  /**
   * Get cookie settings appropriate for the current environment
   */
  static getCookieSettings() {
    const env = this.getEnvironment();
    const isSecure = this.isSecureContext();
    
    return {
      sameSite: (env.isProduction || env.isVercel) ? 'none' as const : 'lax' as const,
      secure: isSecure && (env.isProduction || env.isVercel),
      httpOnly: false, // Must be false for client-side access
      path: '/',
    };
  }

  /**
   * Log environment information for debugging
   */
  static logEnvironmentInfo() {
    const env = this.getEnvironment();
    const apiUrl = this.getApiBaseUrl();
    const cookieSettings = this.getCookieSettings();
    const isSecure = this.isSecureContext();
    
    console.log('Vercel Environment Configuration:', {
      environment: env,
      apiBaseUrl: apiUrl,
      cookieSettings,
      isSecureContext: isSecure,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Validate environment configuration
   */
  static validateEnvironment(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const env = this.getEnvironment();
    
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_API_URL) {
      errors.push('NEXT_PUBLIC_API_URL is not configured');
    }
    
    if (env.isProduction && !this.isSecureContext()) {
      errors.push('Production environment must use HTTPS');
    }
    
    // Validate API URL format
    try {
      const apiUrl = this.getApiBaseUrl();
      new URL(apiUrl);
    } catch {
      errors.push('Invalid API URL format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default VercelConfigManager;