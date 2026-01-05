import Link from "next/link";

interface ProductCardProps {
  id: number;
  cardWidth?: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  unit?: string;  // e.g., "per kg", "per piece"
}

export default function ProductCard({
  id,
  cardWidth = 'max-w-xs',
  title,
  price,
  originalPrice,
  image,
  unit = 'per kg'
}: ProductCardProps) {
  return (
    <div className={`flex w-full ${cardWidth} flex-col self-center overflow-hidden rounded-lg border-2 border-stone-200 bg-stone-50 shadow-sm hover:shadow-lg transition-shadow`}>
      {/* Image */}
      <Link className="relative mx-[8%] mt-[8%] flex aspect-[4/3] overflow-hidden rounded-xl bg-white" href={`/product/${id}`}>
        <img 
          className="h-full w-full object-cover" 
          src={image} 
          alt={title} 
        />
      </Link>
      
      {/* Content */}
      <div className="mt-[5%] px-[8%] pb-[8%]">
        <Link href={`/product/${id}`}>
          <h5 className="text-base sm:text-lg font-semibold text-stone-800 line-clamp-2">{title}</h5>
        </Link>
        
        {/* Price */}
        <div className="mt-[5%] mb-[8%]">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-green-600">৳{price}</span>
            {originalPrice && (
              <span className="text-xs sm:text-sm text-stone-500 line-through">৳{originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-stone-600">{unit}</span>
        </div>
        
        {/* Add to Cart Button */}
        <button className="hover:bg-green-700 flex items-center justify-center rounded-lg bg-green-600 px-[6%] py-[4%] text-center text-xs sm:text-sm font-medium text-white transition-colors w-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mr-2 h-4 w-4 sm:h-5 sm:w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
