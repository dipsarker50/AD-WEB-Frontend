interface AuthEvent {
  timestamp: number;
  event: string;
  data?: any;
  source: string;
}

class AuthDebugger {
  private events: AuthEvent[] = [];
  private maxEvents = 50; // Keep last 50 events
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log an authentication event
   */
  log(event: string, data?: any, source: string = 'unknown'): void {
    const authEvent: AuthEvent = {
      timestamp: Date.now(),
      event,
      data: this.sanitizeData(data),
      source
    };

    this.events.unshift(authEvent);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // In development, also log to console
    if (!this.isProduction) {
      console.log(`[AuthDebug][${source}] ${event}:`, data);
    }
  }

  /**
   * Get authentication events history
   */
  getEvents(): AuthEvent[] {
    return [...this.events];
  }

  /**
   * Get recent events (last 10)
   */
  getRecentEvents(): AuthEvent[] {
    return this.events.slice(0, 10);
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
    this.log('Events cleared', null, 'AuthDebugger');
  }

  /**
   * Export events as JSON for debugging
   */
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  /**
   * Get summary of authentication state
   */
  getSummary(): {
    totalEvents: number;
    lastEvent?: AuthEvent;
    recentErrors: AuthEvent[];
    tokenOperations: AuthEvent[];
  } {
    const recentErrors = this.events.filter(
      event => event.event.includes('error') || event.event.includes('failed')
    ).slice(0, 5);

    const tokenOperations = this.events.filter(
      event => event.event.includes('token') || event.event.includes('login') || event.event.includes('logout')
    ).slice(0, 10);

    return {
      totalEvents: this.events.length,
      lastEvent: this.events[0],
      recentErrors,
      tokenOperations
    };
  }

  /**
   * Sanitize data to remove sensitive information
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    // If data is a string that looks like a token, mask it
    if (typeof data === 'string') {
      if (data.length > 20 && (data.includes('.') || data.startsWith('Bearer'))) {
        return `${data.substring(0, 10)}...${data.substring(data.length - 10)}`;
      }
      return data;
    }

    // If data is an object, recursively sanitize
    if (typeof data === 'object') {
      const sanitized: any = {};
      
      for (const [key, value] of Object.entries(data)) {
        if (key.toLowerCase().includes('token') || 
            key.toLowerCase().includes('password') || 
            key.toLowerCase().includes('secret')) {
          if (typeof value === 'string' && value.length > 8) {
            sanitized[key] = `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
          } else {
            sanitized[key] = '[HIDDEN]';
          }
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      
      return sanitized;
    }

    return data;
  }

  /**
   * Check for common authentication issues
   */
  diagnose(): string[] {
    const issues: string[] = [];
    const summary = this.getSummary();

    // Check for frequent errors
    if (summary.recentErrors.length > 3) {
      issues.push(`Multiple recent authentication errors (${summary.recentErrors.length})`);
    }

    // Check for token issues
    const tokenErrors = this.events.filter(
      event => event.event.includes('token') && event.event.includes('error')
    );
    
    if (tokenErrors.length > 0) {
      issues.push('Token-related errors detected');
    }

    // Check for frequent login/logout cycles
    const loginEvents = this.events.filter(event => event.event.includes('login'));
    const logoutEvents = this.events.filter(event => event.event.includes('logout'));
    
    if (loginEvents.length > 3 && logoutEvents.length > 3) {
      issues.push('Frequent login/logout cycles detected');
    }

    // Check for storage issues
    const storageErrors = this.events.filter(
      event => event.event.includes('storage') || event.event.includes('localStorage')
    );
    
    if (storageErrors.length > 0) {
      issues.push('Storage-related issues detected');
    }

    if (issues.length === 0) {
      issues.push('No obvious authentication issues detected');
    }

    return issues;
  }
}

// Create singleton instance
export const authDebugger = new AuthDebugger();

// Helper functions for common events
export const logAuthEvent = {
  login: (data?: any) => authDebugger.log('User login attempt', data, 'Login'),
  loginSuccess: (data?: any) => authDebugger.log('Login successful', data, 'Login'),
  loginFailed: (error?: any) => authDebugger.log('Login failed', error, 'Login'),
  
  logout: (data?: any) => authDebugger.log('User logout', data, 'Logout'),
  logoutSuccess: () => authDebugger.log('Logout successful', null, 'Logout'),
  logoutFailed: (error?: any) => authDebugger.log('Logout failed', error, 'Logout'),
  
  tokenStore: (data?: any) => authDebugger.log('Token stored', data, 'TokenManager'),
  tokenRetrieve: (data?: any) => authDebugger.log('Token retrieved', data, 'TokenManager'),
  tokenClear: () => authDebugger.log('Tokens cleared', null, 'TokenManager'),
  tokenExpired: (data?: any) => authDebugger.log('Token expired', data, 'TokenManager'),
  
  authCheck: (result?: any) => authDebugger.log('Authentication check', result, 'AuthProvider'),
  authVerified: (data?: any) => authDebugger.log('Authentication verified', data, 'AuthProvider'),
  authFailed: (error?: any) => authDebugger.log('Authentication failed', error, 'AuthProvider'),
  
  storageError: (error?: any) => authDebugger.log('Storage error', error, 'Storage'),
  networkError: (error?: any) => authDebugger.log('Network error', error, 'Network'),
  
  pageReload: () => authDebugger.log('Page reloaded', null, 'Navigation'),
  routeChange: (route?: string) => authDebugger.log('Route changed', { route }, 'Navigation'),
};

// Expose debugging utilities to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).authDebugger = authDebugger;
  (window as any).debugAuth = () => {
    console.group('🔍 Authentication Debug Info');
    
    // Current auth state
    console.log('📊 Current State:', {
      localStorage: {
        access_token: localStorage.getItem('access_token') ? '[PRESENT]' : '[MISSING]',
        agentId: localStorage.getItem('agentId') || '[MISSING]',
        token_expires_at: localStorage.getItem('token_expires_at') || '[MISSING]'
      },
      cookies: document.cookie || '[NONE]'
    });
    
    // Recent events
    console.log('📋 Recent Events:', authDebugger.getRecentEvents());
    
    // Environment info
    console.log('🌍 Environment:', {
      origin: window.location.origin,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled
    });
    
    // Diagnosis
    console.log('🩺 Diagnosis:', authDebugger.diagnose());
    
    console.groupEnd();
  };
}

export default authDebugger;
