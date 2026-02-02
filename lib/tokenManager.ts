import { logAuthEvent } from './authDebugger';

interface TokenData {
  access_token: string;
  agentId: string;
  expiresAt?: number;
}

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly AGENT_ID_KEY = 'agentId';
  private static readonly TOKEN_EXPIRY_KEY = 'token_expires_at';
  
  // In-memory fallback for production environments with localStorage issues
  private static memoryStore: Record<string, string> = {};

  /**
   * Check if we're running on the client side
   */
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Set item with fallback to memory storage
   */
  private static setItem(key: string, value: string): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(key, value);
      // Also store in memory as backup
      this.memoryStore[key] = value;
      console.log(`TokenManager: Stored ${key} in both localStorage and memory`);
    } catch (error) {
      console.warn(`TokenManager: localStorage failed for ${key}, using memory storage:`, error);
      this.memoryStore[key] = value;
    }
  }

  /**
   * Get item with fallback to memory storage
   */
  private static getItem(key: string): string | null {
    if (!this.isClient()) return null;

    try {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`TokenManager: Retrieved ${key} from localStorage`);
        return value;
      }
      
      // Fallback to memory storage
      const memoryValue = this.memoryStore[key];
      if (memoryValue) {
        console.log(`TokenManager: Retrieved ${key} from memory storage`);
        return memoryValue;
      }
      
      return null;
    } catch (error) {
      console.warn(`TokenManager: localStorage access failed for ${key}, checking memory:`, error);
      return this.memoryStore[key] || null;
    }
  }

  /**
   * Remove item from both storages
   */
  private static removeItem(key: string): void {
    if (!this.isClient()) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`TokenManager: localStorage removal failed for ${key}:`, error);
    }
    
    delete this.memoryStore[key];
    console.log(`TokenManager: Removed ${key} from both storages`);
  }

  /**
   * Store authentication tokens
   */
  static setTokens(tokenData: TokenData): void {
    if (!this.isClient()) return;

    try {
      this.setItem(this.ACCESS_TOKEN_KEY, tokenData.access_token);
      this.setItem(this.AGENT_ID_KEY, tokenData.agentId);
      
      if (tokenData.expiresAt) {
        this.setItem(this.TOKEN_EXPIRY_KEY, tokenData.expiresAt.toString());
      }
      
      logAuthEvent.tokenStore({ agentId: tokenData.agentId, hasExpiry: !!tokenData.expiresAt });
      console.log('Tokens stored successfully');
    } catch (error) {
      logAuthEvent.storageError(error);
      console.error('Error storing tokens:', error);
    }
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    if (!this.isClient()) return null;

    try {
      const token = this.getItem(this.ACCESS_TOKEN_KEY);
      
      // Debug logging for Vercel
      console.log('TokenManager: Getting access token', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        isClient: this.isClient()
      });
      
      // Check if token is expired
      if (token && this.isTokenExpired()) {
        logAuthEvent.tokenExpired();
        console.log('TokenManager: Token expired, clearing tokens');
        this.clearTokens();
        return null;
      }
      
      if (token) {
        logAuthEvent.tokenRetrieve({ hasToken: true });
        console.log('TokenManager: Token retrieved successfully');
      } else {
        console.log('TokenManager: No token found in storage');
      }
      
      return token;
    } catch (error) {
      logAuthEvent.storageError(error);
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get agent ID
   */
  static getAgentId(): string | null {
    if (!this.isClient()) return null;

    try {
      return this.getItem(this.AGENT_ID_KEY);
    } catch (error) {
      console.error('Error getting agent ID:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(): boolean {
    if (!this.isClient()) return false;

    try {
      const expiryTime = this.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) return false;

      const now = Date.now();
      const expiry = parseInt(expiryTime, 10);
      
      return now >= expiry;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return false;
    }
  }

  /**
   * Clear all authentication data
   */
  static clearTokens(): void {
    if (!this.isClient()) return;

    try {
      this.removeItem(this.ACCESS_TOKEN_KEY);
      this.removeItem(this.AGENT_ID_KEY);
      this.removeItem(this.TOKEN_EXPIRY_KEY);
      
      logAuthEvent.tokenClear();
      console.log('Tokens cleared successfully');
    } catch (error) {
      logAuthEvent.storageError(error);
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Get all token data
   */
  static getTokenData(): TokenData | null {
    const access_token = this.getAccessToken();
    const agentId = this.getAgentId();

    console.log('TokenManager: getTokenData called', {
      hasAccessToken: !!access_token,
      hasAgentId: !!agentId,
      agentId: agentId
    });

    if (!access_token || !agentId) {
      console.log('TokenManager: Missing required data, returning null');
      return null;
    }

    const tokenData = {
      access_token,
      agentId,
      expiresAt: this.getTokenExpiry()
    };

    console.log('TokenManager: Returning token data:', {
      agentId: tokenData.agentId,
      hasToken: !!tokenData.access_token,
      expiresAt: tokenData.expiresAt
    });

    return tokenData;
  }

  /**
   * Get token expiry time
   */
  static getTokenExpiry(): number | undefined {
    if (!this.isClient()) return undefined;

    try {
      const expiryTime = this.getItem(this.TOKEN_EXPIRY_KEY);
      return expiryTime ? parseInt(expiryTime, 10) : undefined;
    } catch (error) {
      console.error('Error getting token expiry:', error);
      return undefined;
    }
  }

  /**
   * Validate token format (basic validation)
   */
  static isValidTokenFormat(token: string): boolean {
    // Basic JWT format check: should have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Get authorization header
   */
  static getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }
}

export default TokenManager;