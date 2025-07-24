/**
 * Utility functions for handling images
 */

/**
 * Get a CORS-friendly image URL
 * Some image URLs might have CORS restrictions, this function helps work around that
 * @param {string} url - The original image URL
 * @returns {string} - A CORS-friendly image URL
 */
export const getCORSFriendlyImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/300x200?text=No+Image';
  
  // If it's already a data URL or a relative URL, return as is
  if (url.startsWith('data:') || url.startsWith('/')) {
    return url;
  }
  
  // For unsplash images, use their CDN with specific parameters
  if (url.includes('unsplash.com')) {
    // Make sure we're using the images.unsplash.com domain which has better CORS support
    const unsplashUrl = url.replace('https://unsplash.com', 'https://images.unsplash.com');
    // Add auto format and compression parameters if they don't exist
    if (!unsplashUrl.includes('auto=format')) {
      return `${unsplashUrl}${unsplashUrl.includes('?') ? '&' : '?'}auto=format&fit=crop&w=500&q=60`;
    }
    return unsplashUrl;
  }
  
  // For other images, we can use a CORS proxy as a fallback
  // Note: In a production app, you'd want to use your own proxy or a more reliable service
  return url;
};

/**
 * Get a fallback image URL for a specific category
 * @param {string} category - The product category
 * @returns {string} - A reliable image URL for the category
 */
export const getCategoryFallbackImage = (category) => {
  const categoryImageMap = {
    women: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    men: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    kids: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    baby: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    fashion: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cosmetics: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    wellness: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    home: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    jewelry: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    accessories: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  };
  
  return categoryImageMap[category] || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
};

/**
 * Get multiple images for a product category
 * @param {string} category - The product category
 * @param {number} count - Number of images to generate
 * @returns {Array} - Array of image URLs
 */
export const getCategoryImages = (category, count = 4) => {
  const baseImage = getCategoryFallbackImage(category);
  const images = [baseImage];
  
  // Add variety using Picsum for additional images
  for (let i = 1; i < count; i++) {
    images.push(`https://picsum.photos/500/600?random=${category}${i}`);
  }
  
  return images;
};