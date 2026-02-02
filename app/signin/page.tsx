"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/components/AuthProvider';
import TokenManager from '@/lib/tokenManager';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.(xyz|com)$/, 'Email must be a valid .xyz or .com domain email'),
  
  password: z.string()
    .min(1, 'Password is required')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 8 characters long and contain both letters and numbers'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse({ email, password });
      
      setErrors({});
      setApiError('');
      
      // Submit login
      await submitLogin();
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const newErrors: Record<string, string> = {};
        
        for (const [key, messages] of Object.entries(fieldErrors)) {
          if (messages && Array.isArray(messages) && messages[0]) {
            newErrors[key] = messages[0];
          }
        }
        setErrors(newErrors);
      }
    }
  };

  const submitLogin = async () => {
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email, password: '[HIDDEN]' });
      
      const response = await axiosInstance.post('/agent/login', {
        email,
        password,
      });

      console.log('Login response received:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      if (response.data.success) {
        // Try different possible response structures
        let token = response.data.token || response.data.accessToken || response.data.access_token;
        let agentId = response.data.agentId || response.data.agent_id || response.data.userId || response.data.user_id || response.data.id;
        let expiresIn = response.data.expiresIn || response.data.expires_in || response.data.expiry;
        
        console.log('Extracted login data:', { 
          token: token ? `${token.substring(0, 20)}...` : 'NOT FOUND', 
          agentId, 
          expiresIn 
        });
        
        // Validate required data
        if (!token || !agentId) {
          console.error('Missing required login data:', { hasToken: !!token, hasAgentId: !!agentId });
          console.error('Full response data keys:', Object.keys(response.data));
          setApiError(`Invalid response from server. Missing ${!token ? 'token' : 'agentId'}. Please try again.`);
          setLoading(false);
          return;
        }

        // Validate token format
        if (!TokenManager.isValidTokenFormat(token)) {
          console.error('Invalid token format:', token);
          setApiError('Invalid token received. Please contact support.');
          setLoading(false);
          return;
        }

        // Calculate expiry time if provided
        let expiresAt: number | undefined;
        if (expiresIn) {
          expiresAt = Date.now() + (expiresIn * 1000); // Convert seconds to milliseconds
        }

        // Use AuthProvider's login method which handles TokenManager
        console.log('Calling login with processed data:', { agentId, hasExpiry: !!expiresAt });
        login(token, agentId, expiresAt);
        
        console.log('Login successful - tokens stored and auth state updated');
        setLoading(false);
        
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        console.error('Login failed - success is false:', response.data);
        setApiError(response.data.message || 'Login failed. Please try again.');
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      setLoading(false);
      
      // More specific error handling
      if (error.response?.status === 401) {
        setApiError('Invalid email or password.');
      } else if (error.response?.status === 429) {
        setApiError('Too many login attempts. Please try again later.');
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Login failed. Please check your connection and try again.');
      }
    } 
  };

  return (
    <div className="lg:m-10">
      <form 
        onSubmit={handleSubmit} 
        className="relative border border-gray-100 space-y-3 max-w-md mx-auto rounded-md bg-white p-6 shadow-xl lg:p-10"
      >
        <h1 className="mb-6 text-xl font-semibold lg:text-2xl">Agent Sign In</h1>

        {/* General API Error Message */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block mb-1">Email Address <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@domain.xyz"
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>



        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-md bg-blue-600 p-2 text-center font-semibold text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
