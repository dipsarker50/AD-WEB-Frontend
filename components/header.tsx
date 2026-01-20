'use client';
import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {  } from '@/lib/axios';
import axios from 'axios';

export default function Header() {
    return <Navbar />;
}

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 


    useEffect(() => {
    const agentId = localStorage.getItem('agentId');
    setIsAuthenticated(!!agentId);
    

  }, [pathname]);





  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem('agentId');
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT SIDE: Logo + All Products + Cart */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold text-gray-800">AgriMarket</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {/* All Products - Always visible */}
              <Link 
                href="/product" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                All Products
              </Link>

              {/* My Products - Only when authenticated */}
              {isAuthenticated && (
                <>

                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                 Dashboard
                </Link>

                <Link 
                  href="/myproducts" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                  My Products
                </Link>
                </>
                

              )}

            </div>
          </div>

          {/* RIGHT SIDE: Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/signin" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </div>
                  </Link>
                  <Link 
                    href="/myproducts" 
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>My Products</span>
                    </div>
                  </Link>
                
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}


