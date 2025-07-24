import { useState, useEffect } from 'react';
import { getCORSFriendlyImageUrl, getCategoryFallbackImage } from '../utils/imageUtils';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4" viewBox="0 0 20 20">
          <path 
            fill="#FBBF24" 
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
            clipPath="inset(0 50% 0 0)"
          />
          <path 
            fill="#D1D5DB" 
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
            clipPath="inset(0 0 0 50%)"
          />
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  
  // Use actual product images if available
  useEffect(() => {
    const generateProductImages = () => {
      let images = [];
      
      // Priority 1: Use stored images array if available
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        images = product.images.filter(img => img && img.trim() !== '');
      }
      
      // Priority 2: Use main product image
      if (images.length === 0 && product.image && product.image.trim() !== '') {
        images = [product.image];
      }
      
      // Only use fallback if no real images available
      if (images.length === 0) {
        images = [getCategoryFallbackImage(product.category || 'fashion')];
      }
      
      console.log('Product images for', product.title, ':', images);
      setProductImages(images.slice(0, 4));
    };
    
    generateProductImages();
  }, [product.image, product.images, product.id, product.category, product.title]);
  
  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (productImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % productImages.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [productImages.length]);
  
  // Handle image loading error
  const handleImageError = () => {
    console.log(`Image failed to load: ${productImages[currentImageIndex]}`);
    setImageError(true);
  };
  
  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gray-100">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Image not available</p>
            </div>
          </div>
        ) : (
          <>
            {/* Image carousel */}
            <div className="relative w-full h-full">
              {productImages.map((imgSrc, index) => (
                <img 
                  key={index}
                  src={imgSrc} 
                  alt={`${product.title} - Image ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                  onError={handleImageError}
                />
              ))}
            </div>
            
            {/* Image indicators */}
            {productImages.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                {productImages.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="p-2 sm:p-3 md:p-4">
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 mb-1 line-clamp-2">{product.title}</h3>
        
        <div className="flex items-center mb-1 sm:mb-2">
          <div className="flex mr-1 sm:mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs sm:text-sm text-gray-600">({product.reviews})</span>
        </div>
        
        <p className="text-pink-600 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">${parseFloat(product.price || 0).toFixed(2)}</p>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
          {product.reviewSnippet}
        </p>
        
        <a 
          href={product.affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center py-1.5 sm:py-2 px-2 sm:px-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full hover:from-pink-500 hover:to-purple-600 transition-colors duration-300 text-xs sm:text-sm font-medium"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
};

export default ProductCard;