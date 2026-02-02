"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import TokenManager from '@/lib/tokenManager';
import { verifyAuthCSR } from '@/lib/authCSR';
import { logAuthEvent } from '@/lib/authDebugger';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  agentId: string | null;
  login: (token: string, agentId: string, expiresAt?: number) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [agentId, setAgentId] = useState<string | null>(null);

  const login = (token: string, agentId: string, expiresAt?: number) => {
    console.log('AuthProvider: Logging in user');
    logAuthEvent.loginSuccess({ agentId, hasExpiry: !!expiresAt });
    
    TokenManager.setTokens({
      access_token: token,
      agentId,
      expiresAt
    });
    
    setIsAuthenticated(true);
    setAgentId(agentId);
  };

  const logout = () => {
    console.log('AuthProvider: Logging out user');
    logAuthEvent.logout();
    
    TokenManager.clearTokens();
    setIsAuthenticated(false);
    setAgentId(null);
    
    logAuthEvent.logoutSuccess();
  };

  const checkAuth = async () => {
    console.log('AuthProvider: Checking authentication status');
    logAuthEvent.authCheck();
    setIsLoading(true);

    try {
      // First check if we have tokens locally
      const tokenData = TokenManager.getTokenData();
      
      if (!tokenData) {
        console.log('AuthProvider: No tokens found');
        logAuthEvent.authFailed({ reason: 'No tokens found' });
        setIsAuthenticated(false);
        setAgentId(null);
        return;
      }

      console.log('AuthProvider: Tokens found, verifying with server');
      
      // Verify tokens with server
      const authResponse = await verifyAuthCSR();
      
      if (authResponse.authenticated) {
        console.log('AuthProvider: Authentication verified');
        logAuthEvent.authVerified({ agentId: tokenData.agentId });
        setIsAuthenticated(true);
        setAgentId(tokenData.agentId);
      } else {
        console.log('AuthProvider: Authentication failed, clearing tokens');
        logAuthEvent.authFailed({ reason: 'Server verification failed' });
        TokenManager.clearTokens();
        setIsAuthenticated(false);
        setAgentId(null);
      }
    } catch (error) {
      console.error('AuthProvider: Error checking authentication:', error);
      logAuthEvent.authFailed({ error: error instanceof Error ? error.message : 'Unknown error' });
      // On error, clear potentially invalid tokens
      TokenManager.clearTokens();
      setIsAuthenticated(false);
      setAgentId(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount and when tab becomes visible
  useEffect(() => {
    console.log('AuthProvider: Initial mount, checking authentication...');
    checkAuth();

    // Re-check auth when tab becomes visible (handles token changes in other tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('AuthProvider: Tab became visible, rechecking auth...');
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'agentId') {
        console.log('AuthProvider: Storage changed for key:', e.key, 'New value:', e.newValue ? '[PRESENT]' : '[REMOVED]');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    agentId,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;