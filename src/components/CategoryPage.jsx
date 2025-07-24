import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getCategoryFallbackImage } from '../utils/imageUtils';

const CategoryPage = ({ category, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [customPriceRange, setCustomPriceRange] = useState({ min: '', max: '' });
  const [showCustomPriceFilter, setShowCustomPriceFilter] = useState(false);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Handle 'all' category - combine products from all categories
        if (category === 'all') {
          const allCategories = ['women', 'men', 'girls', 'baby', 'skincare', 'makeup', 'haircare', 'fragrance'];
          let allProducts = [];
          
          allCategories.forEach(cat => {
            const categoryProducts = localStorage.getItem(`${cat}Products`);
            if (categoryProducts) {
              const parsed = JSON.parse(categoryProducts);
              allProducts = [...allProducts, ...parsed];
            }
          });
          
          // Shuffle and limit to 12 products
          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          const limited = shuffled.slice(0, 12);
          
          console.log(`Loaded ${limited.length} products from all categories`);
          setProducts(limited);
          return;
        }
        
        // First check localStorage for specific category products
        const localStorageProducts = localStorage.getItem(`${category}Products`);
        
        if (localStorageProducts) {
          // If products exist in localStorage, use those
          const parsedProducts = JSON.parse(localStorageProducts);
          console.log(`Loaded ${parsedProducts.length} products from localStorage for ${category}`);
          setProducts(parsedProducts);
          return;
        }
        
        // If no localStorage products, try to load from the JSON files
        try {
          const data = await import(`../data/${category}.json`);
          console.log(`Loaded products from ${category}.json file`);
          
          // Process products to ensure images work
          const processedData = (data.default || data).map(product => ({
            ...product,
            image: product.image || getCategoryFallbackImage(category)
          }));
          
          setProducts(processedData);
        } catch {
          // If category-specific file doesn't exist, load from fashion as fallback
          const fallbackData = await import(`../data/fashion.json`);
          console.log(`No ${category}.json file found, using fashion.json as fallback`);
          
          // Process products to ensure images work
          const processedData = (fallbackData.default || fallbackData).map(product => ({
            ...product,
            image: product.image || getCategoryFallbackImage('fashion')
          }));
          
          setProducts(processedData);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      }
    };
    
    fetchProducts();
    
    // Listen for storage changes to auto-refresh when products are added
    const handleStorageChange = () => {
      console.log('Storage changed, refreshing products...');
      fetchProducts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates every 2 seconds
    const interval = setInterval(fetchProducts, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [category]);
  
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under25':
          result = result.filter(product => product.price < 25);
          break;
        case '25to50':
          result = result.filter(product => product.price >= 25 && product.price <= 50);
          break;
        case '50to100':
          result = result.filter(product => product.price > 50 && product.price <= 100);
          break;
        case '100to200':
          result = result.filter(product => product.price > 100 && product.price <= 200);
          break;
        case '200to500':
          result = result.filter(product => product.price > 200 && product.price <= 500);
          break;
        case 'over500':
          result = result.filter(product => product.price > 500);
          break;
        case 'custom':
          if (customPriceRange.min !== '') {
            result = result.filter(product => product.price >= parseFloat(customPriceRange.min));
          }
          if (customPriceRange.max !== '') {
            result = result.filter(product => product.price <= parseFloat(customPriceRange.max));
          }
          break;
        default:
          break;
      }
    }
    
    // Apply sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviews - a.reviews);
    } else if (sortBy === 'newest') {
      // Assuming newer products have higher IDs
      result.sort((a, b) => b.id - a.id);
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, priceFilter, sortBy, customPriceRange]);

  const handleCustomPriceChange = (type, value) => {
    setCustomPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  


  const getCategoryTitle = () => {
    switch (category) {
      case 'all':
        return 'All Beauty Products';
      case 'women':
        return 'Women\'s Collection';
      case 'men':
        return 'Men\'s Collection';
      case 'girls':
        return 'Girls Collection';
      case 'baby':
        return 'Baby Collection';
      case 'makeup':
        return 'Makeup Collection';
      case 'skincare':
        return 'Skincare Essentials';
      case 'haircare':
        return 'Hair Care Products';
      case 'fragrance':
        return 'Fragrances & Perfumes';
      default:
        return `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case 'all':
        return 'Discover our complete collection of premium beauty and cosmetic products for everyone.';
      case 'women':
        return 'Discover the latest trends in women\'s beauty. From elegant makeup to skincare essentials.';
      case 'men':
        return 'Explore our collection of men\'s fashion. Quality clothing and accessories for every occasion.';
      case 'girls':
        return 'Beautiful cosmetics and beauty products specially curated for young girls and teens.';
      case 'baby':
        return 'Gentle and safe beauty products for babies and toddlers. Hypoallergenic and dermatologist-tested.';
      case 'makeup':
        return 'Discover premium makeup products to enhance your natural beauty. From foundations to lipsticks.';
      case 'skincare':
        return 'Nourish and protect your skin with our curated collection of skincare essentials.';
      case 'haircare':
        return 'Transform your hair with professional-grade hair care products for every hair type.';
      case 'fragrance':
        return 'Find your signature scent with our collection of premium fragrances and perfumes.';
      default:
        return 'Browse our collection of high-quality products.';
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col items-center mb-4 sm:mb-8">
        <div className="text-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-1 sm:mb-2">{getCategoryTitle()}</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">{getCategoryDescription()}</p>
        </div>
        

      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="w-full md:w-auto">
          <label htmlFor="priceFilter" className="text-sm text-gray-600 block mb-2">Price Range:</label>
          <div className="flex flex-col space-y-2">
            <select
              id="priceFilter"
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value);
                if (e.target.value === 'custom') {
                  setShowCustomPriceFilter(true);
                } else {
                  setShowCustomPriceFilter(false);
                }
              }}
              className="rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 w-full md:w-48"
            >
              <option value="all">All Prices</option>
              <option value="under25">Under $25</option>
              <option value="25to50">$25 - $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="100to200">$100 - $200</option>
              <option value="200to500">$200 - $500</option>
              <option value="over500">Over $500</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {showCustomPriceFilter && (
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={customPriceRange.min}
                  onChange={(e) => handleCustomPriceChange('min', e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={customPriceRange.max}
                  onChange={(e) => handleCustomPriceChange('max', e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="sortBy" className="text-sm text-gray-600 block mb-2">Sort By:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 w-full md:w-48"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;