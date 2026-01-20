import ProductFilter from '@/components/filter';
import ProductCard from '@/components/card';
import { ProductCardData } from '@/interfaces/Product';
import axios from 'axios';
import axiosInstance from '@/lib/axios';

export default async function ProductListPage() {
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

  let productsData: any = null;
  let error: string | null = null;

  try {
    const response = await axiosInstance.get(
      `/product/allproducts`
    );
    productsData = response.data;
  } catch (err: any) {
    error = err.message || 'Failed to load products';
    console.error('Error fetching products:', err);
  }

  // Helper functions...
  const renderProductArray = (products: ProductCardData[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          cardWidth="max-w-full"
          name={product.name}
          price={product.price}
          originalPrice={product.discount ? product.price / (1 - product.discount / 100) : undefined}
          imageUrl={product.imageUrl}
          unit={product.unit}
        />
      ))}
    </div>
  );

  const renderProductObject = (data: any) => {
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
        <h1 className="text-3xl font-bold text-stone-800 mb-6">
          Product List
        </h1>

        <div className="flex gap-6">
          <aside className="hidden lg:block flex-shrink-0">
            <ProductFilter
              categories={filterData.categories}
              brands={filterData.brands}
            />
          </aside>

          <main className="flex-1">
            {Array.isArray(productsData) 
              ? renderProductArray(productsData) 
              : renderProductObject(productsData)
            }

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
