import Link from "next/link";
import { ProductCardData } from "@/interfaces/Product";

export default function ProductCard({
  id,
  cardWidth = 'max-w-xs',
  name,
  price,
  originalPrice,
  imageUrl,
  unit = 'per kg'
}: ProductCardData) {
  return (
    <div className={`flex w-full ${cardWidth} flex-col self-center overflow-hidden rounded-lg border-2 border-stone-200 bg-stone-50 shadow-sm hover:shadow-lg transition-shadow`}>
      {/* Image */}
      <Link className="relative mx-[8%] mt-[8%] flex aspect-[4/3] overflow-hidden rounded-xl bg-white" href={`/product/${id}`}>
        <img 
          className="h-full w-full object-cover" 
          src={process.env.NEXT_PUBLIC_API_URL+"/product/getproductimage/" + id} 
          alt={name} 
        />
      </Link>
      
      {/* Content */}
      <div className="mt-[5%] px-[8%] pb-[8%]">
        <Link href={`/product/${id}`}>
          <h5 className="text-base sm:text-lg font-semibold text-stone-800 line-clamp-2">{name}</h5>
        </Link>
        
        {/* Price */}
        <div className="mt-[5%] mb-[8%]">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-green-600">৳{price}</span>
            
          </div>
          <span className="text-xs text-stone-600">{unit}</span>
        </div>
        
        {/* Add to Cart Button */}
        <Link href={`/product/${id}`} className="hover:bg-green-700 flex items-center justify-center rounded-lg bg-green-600 px-[6%] py-[4%] text-center text-xs sm:text-sm font-medium text-white transition-colors w-full">

          View Details
        </Link>
      </div>
    </div>
  );
}
