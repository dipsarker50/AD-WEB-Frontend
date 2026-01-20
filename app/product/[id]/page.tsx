import Image from 'next/image';
import Link from 'next/link';
import { ProductInterface } from '@/interfaces/Product';
import axios from 'axios';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {

  const Product =async ()=>{
    var response = await axios.get(process.env.NEXT_PUBLIC_API_URL+`/product/productbyid/${(await params).id}`);
    return response.data;
  };

  const product:ProductInterface = await Product();

  if(product.discount == undefined){
    product.discount = 0;
  }
  const finalPrice: number  = product.discount
    ? product.price * (1 - product.discount / 100)
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
                src={(process.env.NEXT_PUBLIC_API_URL+"/product/getproductimage/" + (await params).id)}
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

                <div className="text-sm text-stone-600 mb-2"> Seller Name:
                {product.agent.fullName}{product.agentId}
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
                    checked={star <= Math.round(product.rating || 0)}
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
                  ৳{finalPrice}
                </span>
                {product.discount && (
                  <span className="text-xl text-stone-500 line-through">
                    ৳{product.price}
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


          </div>
        </div>
      </div>
    </div>
  );
}
