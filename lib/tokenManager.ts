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

  /**
   * Check if we're running on the client side
   */
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Store authentication tokens
   */
  static setTokens(tokenData: TokenData): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.access_token);
      localStorage.setItem(this.AGENT_ID_KEY, tokenData.agentId);
      
      if (tokenData.expiresAt) {
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, tokenData.expiresAt.toString());
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
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      
      // Check if token is expired
      if (token && this.isTokenExpired()) {
        logAuthEvent.tokenExpired();
        this.clearTokens();
        return null;
      }
      
      if (token) {
        logAuthEvent.tokenRetrieve({ hasToken: true });
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
      return localStorage.getItem(this.AGENT_ID_KEY);
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
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
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
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.AGENT_ID_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      
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
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
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