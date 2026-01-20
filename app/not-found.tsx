import Link from 'next/link';

export default function NotFound() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>

        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>



        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-green-200">
          <p className="text-gray-600 mb-4 font-medium">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/product" 
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              All Products
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/signin" 
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              Sign In
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/register" 
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              Register
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/dashboard" 
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
