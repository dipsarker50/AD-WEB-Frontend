"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!email) {
      setError('No email provided');
      return;
    }

    checkVerificationStatus();
    
    intervalRef.current = setInterval(() => {
      checkVerificationStatus();
    }, 3000);

  }, [email]);

  const checkVerificationStatus = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/agent/verify-status/${email}`);

      if (response.data.isVerified === true || response.data === true) {
        setIsVerified(true);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } else {
        setCount(prev => prev + 1);
      }
    } catch (err: any) {
    
      if (count > 60) { 
        setError('Verification timeout. Please try again later.');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }
  };



  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-100 p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600">Invalid Access</h1>
          <p className="mt-2">No email provided for verification.</p>
          <button
            onClick={() => router.push('/register')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {!isVerified ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
            {/* Email Icon */}
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
              <p className="mt-2 text-gray-600">
                We've sent a verification link to:
              </p>
              <p className="font-semibold text-blue-600 mt-1">{email}</p>
            </div>

            {/* Loading Animation */}
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500">Waiting for email verification...</p>
              <p className="text-xs text-gray-400">Checking automatically every 3 seconds</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}



            {/* Polling Info */}
            <p className="text-xs text-gray-400">
              Checked {count} times
            </p>
          </div>
        ) : (
          // Success State
          <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
              <p className="mt-2 text-gray-600">
                Your email has been successfully verified.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        )}

        {/* Back to Register */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/register')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Register
          </button>
        </div>
      </div>
    </div>
  );
}
