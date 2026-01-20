"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import axios from 'axios';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

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
          if (messages && messages[0]) {
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
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL+'/agent/login', {
        email,
        password,
      }, { withCredentials: true });

      if (response.data.success) {

        localStorage.setItem('agentId', response.data.agentId);
        console.log('Login successful');
        setLoading(false);

        router.push('/dashboard');
      }

      if (response.data.success === false) {
        setApiError(response.data.message || 'Login failed. Please try again.');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      setApiError('Login failed. Please try again.');

      
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
