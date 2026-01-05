'use client';

import { useEffect, useState } from 'react';
import ProductFilter from '@/components/filter';
import ProductCard from '@/components/card';
import axios from 'axios';
import Loading from '../loading';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  discount?: number;
}

export default function ProductListPage() {
  const [productsData, setProductsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/allproducts`
        );
        setProductsData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to render array of products
  const renderProductArray = (products: Product[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          cardWidth="max-w-full"
          title={product.name}
          price={product.price}
          originalPrice={product.discount ? product.price / (1 - product.discount / 100) : undefined}
          image={product.imageUrl}
          unit={product.unit}
        />
      ))}
    </div>
  );

  // Helper function to render object with nested products
  const renderProductObject = (data: any) => {
    // Check common response formats
    const products = data.data || data.products || data.items || [];
    
    if (Array.isArray(products) && products.length > 0) {
      return renderProductArray(products);
    }
    
    return (
      <div className="text-center py-16">
        <p className="text-stone-600 text-lg">No products found</p>
      </div>
    );
  };

  if (loading) {
    return (
      <Loading/>

    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-stone-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="container mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-stone-800 mb-6">
          Product List
        </h1>

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
              <div className="text-center py-16">
                <p className="text-stone-600 text-lg">No products found</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
