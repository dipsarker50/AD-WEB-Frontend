interface FilterOption {
  id: string;
  label: string;
}

interface ProductFilterProps {
  categories?: FilterOption[];
  brands?: FilterOption[];
  onFilterChange?: (filters: any) => void;
}

export default function ProductFilter({ 
  categories = [],
  brands = [],
  onFilterChange
}: ProductFilterProps) {
  return (
    <div className="w-64 bg-stone-50 p-6 rounded-lg shadow-md border border-stone-200">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone-800">Filters</h3>
        <button className="text-sm text-green-600 hover:text-green-700">
          Clear All
        </button>
      </div>

      {/* Categories - Dynamic */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-stone-700 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                <span className="ml-2 text-sm text-stone-700">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-stone-700 mb-3">Price Range</h4>
        <input 
          type="range" 
          min="0" 
          max="10000" 
          className="range range-success range-sm" 
        />
        <div className="flex justify-between text-xs text-stone-600 mt-2">
          <span>৳0</span>
          <span>৳10,000</span>
        </div>
      </div>

      {/* Brands/Sellers - Dynamic */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-stone-700 mb-3">Seller/Brand</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                <span className="ml-2 text-sm text-stone-700">{brand.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Apply Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors">
                Apply Filters
        </button>

    </div>
  );
}
