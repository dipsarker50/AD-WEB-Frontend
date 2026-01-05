import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  discount: number | null;
  isOrganic: boolean;
  location: string;
  harvestDate: string | null;
  expiryDate: string | null;
  tags: string[];
  minOrderQuantity: number;
  maxOrderQuantity: number | null;
  isAvailable: boolean;
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  // Fetch product data - replace with actual API call
  const product: Product = {
    id: 1,
    name: "Fresh Organic Tomatoes",
    description: "Premium quality organic tomatoes, freshly harvested from local farms. Rich in vitamins and perfect for salads, cooking, and sauces.",
    price: 45,
    unit: "kg",
    stock: 150,
    category: "Vegetables",
    imageUrl: "/landingPage-1.jpg",
    rating: 4.5,
    reviewCount: 128,
    discount: 25,
    isOrganic: true,
    location: "Dhaka, Bangladesh",
    harvestDate: "2026-01-01",
    expiryDate: "2026-01-10",
    tags: ["fresh", "organic", "local", "seasonal"],
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    isAvailable: true
  };

  const finalPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-stone-100 py-8">
        <Link href="/product" className="btn btn-ghost mb-6 ml-6">← Back to Products</Link>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-stone-50 rounded-2xl shadow-lg p-6 lg:p-10">
          
          {/* Left: Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount && (
                  <span className="badge badge-error text-white font-bold px-4 py-3">
                    {product.discount}% OFF
                  </span>
                )}
                {product.isOrganic && (
                  <span className="badge badge-success text-white font-bold px-4 py-3">
                    🌱 Organic
                  </span>
                )}
                {!product.isAvailable && (
                  <span className="badge badge-warning font-bold px-4 py-3">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-green-800">
                    {product.tags.join(' • ')}
                </span>
                </div>
            </div>
            )}

          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <div className="text-sm text-stone-600 mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">
                {product.name}
              </h1>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="rating rating-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    className="mask mask-star-2 bg-orange-400"
                    checked={star <= Math.round(product.rating)}
                    readOnly
                  />
                ))}
              </div>
              <span className="text-stone-700 font-medium">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="border-t border-b border-stone-200 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green-600">
                  ৳{finalPrice.toFixed(2)}
                </span>
                {product.discount && (
                  <span className="text-xl text-stone-500 line-through">
                    ৳{product.price.toFixed(2)}
                  </span>
                )}
                <span className="text-stone-600">/{product.unit}</span>
              </div>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-stone-600">Stock</div>
                <div className="text-lg font-semibold text-stone-800">
                  {product.stock} {product.unit}
                </div>
              </div>
              
              {product.location && (
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-stone-600">Location</div>
                  <div className="text-lg font-semibold text-stone-800">
                     {product.location}
                  </div>
                </div>
              )}
              
              {product.harvestDate && (
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-stone-600">Harvested</div>
                  <div className="text-lg font-semibold text-stone-800">
                    {new Date(product.harvestDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              {product.expiryDate && (
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-stone-600">Best Before</div>
                  <div className="text-lg font-semibold text-stone-800">
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">
                Description
              </h3>
              <p className="text-stone-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-stone-600 mb-2 block">
                  Quantity ({product.unit})
                </label>
                <input
                  type="number"
                  min={product.minOrderQuantity}
                  max={product.maxOrderQuantity || product.stock}
                  defaultValue={product.minOrderQuantity}
                  className="input input-bordered w-full max-w-xs"
                />
                <div className="text-xs text-stone-500 mt-1">
                  Min: {product.minOrderQuantity} {product.unit}
                  {product.maxOrderQuantity && ` | Max: ${product.maxOrderQuantity} ${product.unit}`}
                </div>
              </div>

                <button 
                className="btn btn-lg w-full bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                disabled={!product.isAvailable}
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
