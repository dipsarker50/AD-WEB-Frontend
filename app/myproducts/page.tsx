'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductFilter from '@/components/filter';
import ProductCard from '@/components/card';
import axiosInstance from '@/lib/axios';
import Loading from '../loading';
import Link from 'next/link';
import { ProductCardData } from '@/interfaces/Product';
import { verifyAuthCSR } from '@/lib/authCSR';



export default function MyProductsPage() {
  const router = useRouter();
  const [productsData, setProductsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filterData = {
    categories: [
      { id: '1', label: 'Vegetables' },
      { id: '2', label: 'Fruits' },
      { id: '3', label: 'Grains' },
      { id: '4', label: 'Seeds' }
    ],
    brands: [
      { id: '1', label: 'Local Farmers' },
      { id: '2', label: 'Organic Farm' },
      { id: '3', label: 'Green Valley' }
    ]
  };

  useEffect(() => {
    var response = verifyAuthCSR();
    if (!response) {
      router.push('/signin');
      return;
    }
     fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/agent/agentproducts/${localStorage.getItem('agentId')}`);
      setProductsData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Error fetching my products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeletingId(productId);
      await axiosInstance.delete(`/product/deleteProduct/${productId}`);
      fetchMyProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const renderProductArray = (products: ProductCardData[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="relative">
          <ProductCard
            id={product.id}
            cardWidth="max-w-full"
            name={product.name}
            price={product.price}
            originalPrice={product.discount ? product.price / (1 - product.discount / 100) : undefined}
            imageUrl={product.imageUrl}
            unit={product.unit}
          />
          
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => router.push(`/myproducts/edit/${product.id}`)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              title="Edit Product"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={() => handleDelete(product.id)}
              disabled={deletingId === product.id}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
              title="Delete Product"
            >
              {deletingId === product.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Helper function to render object with nested products
  const renderProductObject = (data: any) => {
    const products = data.data || data.products || data.items || [];
    
    if (Array.isArray(products) && products.length > 0) {
      return renderProductArray(products);
    }
    
    return (
      <div className="text-center py-16">
        <p className="text-stone-600 text-lg mb-4">No products found</p>
        <Link 
          href="/myproducts/create"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Your First Product
        </Link>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-stone-600 mb-4">{error}</p>
          <button
            onClick={fetchMyProducts}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">My Products</h1>
            <p className="text-stone-600 mt-1">
              Manage your product listings
            </p>
          </div>
          
          <Link
            href="/myproducts/create"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Main Layout: Filter + Products */}
        <div className="flex gap-6">
          {/* Left Side: Filter */}
          <aside className="hidden lg:block flex-shrink-0">
            <ProductFilter
              categories={filterData.categories}
              brands={filterData.brands}
            />
          </aside>

          {/* Right Side: Product Grid */}
          <main className="flex-1">
            {/* Conditional Rendering: Array vs Object */}
            {Array.isArray(productsData) 
              ? renderProductArray(productsData) 
              : renderProductObject(productsData)
            }

            {/* Empty State for Array */}
            {Array.isArray(productsData) && productsData.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <svg className="w-20 h-20 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-stone-600 text-lg mb-4">No products yet</p>
                <Link 
                  href="/myproducts/create"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Your First Product
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
