import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AgentInterface } from '@/interfaces/agent';  
import { ProductInterface } from '@/interfaces/Product';
import axiosInstance from '@/lib/axios';
import { verifyAuthSSR } from '@/lib/authSSR';

export default async function DashboardPage() {
  let agentId: string | null = null ;
  
  try {

    const authResponse = await verifyAuthSSR();
    console.log('Auth Response:', authResponse);

    
    if (!authResponse.authenticated) {
      redirect('/signin');
    }
    
    agentId = authResponse.agentId;
  } catch (error) {
    console.error('Authentication error:', error);
    redirect('/signin');
  }

  // Step 2: Fetch profile and products with axios
  let profile: AgentInterface | null = null;
  let products: ProductInterface[] = [];
  let error: string | null = null;

  try {
    const [profileRes, productsRes] = await Promise.all([
      axiosInstance.get(`/agent/getagentby?field=id&data=${agentId}`),
      axiosInstance.get(`/agent/agentproducts/${agentId}`),
    ]);

    profile = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data;

    const productsData = productsRes.data;
    if (Array.isArray(productsData)) {
      products = productsData;
    } else if (productsData.products && Array.isArray(productsData.products)) {
      products = productsData.products;
    } else if (productsData.data && Array.isArray(productsData.data)) {
      products = productsData.data;
    }
  } catch (err: any) {
    error = 'Failed to load dashboard data';
    console.error('Dashboard error:', err);
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || 'Failed to load profile data'}
          </p>
          <Link 
            href="/dashboard"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </Link>
        </div>
      </div>
    );
  }

  // Step 4: Render dashboard (same JSX as before)
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.fullName}! 👋</h1>
          <p className="text-green-100">Manage your products and view your agent dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Account Status</p>
                <p className="text-xl font-bold text-green-600">{profile.status}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Email Status</p>
                <p className="text-xl font-bold">{profile.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}</p>
              </div>
              <div className={`w-12 h-12 ${profile.isEmailVerified ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${profile.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Experience</p>
                <p className="text-xl font-bold text-gray-800">{profile.experience || 'N/A'}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profile & Products Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Profile</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-800">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-800">{profile.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium text-gray-800">{profile.age} years</p>
              </div>
              {profile.bio && (
                <div>
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="font-medium text-gray-800">{profile.bio}</p>
                </div>
              )}
            </div>
            <Link href="/profile" className="mt-6 block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Edit Profile
            </Link>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Products</h2>
              <Link href="/myproducts/create" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                + Add Product
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 mb-4">No products yet</p>
                <Link href="/myproducts/create" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Create Your First Product
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-lg font-bold text-green-600">${product.price}</span>
                          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                        </div>
                      </div>
                      <Link href={`/product/${product.id}`} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <Link href="/myproducts" className="block text-center py-3 text-green-600 hover:text-green-700 font-medium">
                    View All Products ({products.length})
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - same as before */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/myproducts/create" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Add Product</span>
            </Link>

            <Link href="/myproducts" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">View Products</span>
            </Link>

            <Link href="/profile" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-600 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Edit Profile</span>
            </Link>

            <Link href="/settings" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-600 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
