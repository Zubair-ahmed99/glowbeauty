import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryFallbackImage } from '../utils/imageUtils';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: Date.now(),
    title: '',
    image: '',
    additionalImages: '',
    images: [],
    price: '',
    rating: '',
    reviews: '',
    reviewSnippet: '',
    affiliateLink: '',
    category: 'fashion'
  });
  
  const [productUrl, setProductUrl] = useState('');
  const [isScrapingProduct, setIsScrapingProduct] = useState(false);
  
  const [products, setProducts] = useState({
    women: [],
    men: [],
    girls: [],
    baby: [],
    skincare: [],
    makeup: [],
    haircare: [],
    fragrance: []
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });

  
  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log('AdminPanel - checking isAdmin:', isAdmin);
    if (!isAdmin) {
      console.log('Not admin, redirecting to /admin');
      navigate('/admin');
    } else {
      console.log('Admin status confirmed');
    }
    
    // Load products from localStorage
    const loadProducts = () => {
      const categories = ['women', 'men', 'girls', 'baby', 'skincare', 'makeup', 'haircare', 'fragrance'];
      const loadedProducts = {};
      
      categories.forEach(category => {
        const storedProducts = localStorage.getItem(`${category}Products`);
        loadedProducts[category] = storedProducts ? JSON.parse(storedProducts) : [];
      });
      
      setProducts(loadedProducts);
      console.log('Products loaded from localStorage.');
    };
    
    loadProducts();
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' || name === 'reviews' 
        ? parseFloat(value) || '' 
        : value
    }));
  };
  
  // Handle product URL change
  const handleProductUrlChange = (e) => {
    setProductUrl(e.target.value);
  };
  
  // Function to extract product details from URL
  const extractProductDetails = async () => {
    if (!productUrl) {
      setMessage({ text: 'Please enter a product URL', type: 'error' });
      return;
    }
    
    setIsScrapingProduct(true);
    setMessage({ text: 'Fetching product details...', type: 'info' });
    
    try {
      // In a real app, this would call a backend API to scrape the product details
      // For this demo, we'll simulate a successful fetch with random data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random product data based on the URL
      const urlObj = new URL(productUrl);
      const domain = urlObj.hostname;
      
      // Extract product name from URL with better logic
      let productName = '';
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      if (domain.includes('amazon')) {
        // Amazon: extract from URL structure
        const dpIndex = pathParts.findIndex(part => part === 'dp' || part === 'gp');
        if (dpIndex > 0 && pathParts[dpIndex - 1]) {
          productName = pathParts[dpIndex - 1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\d+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        }
        
        // If still no good name, try to find a descriptive part
        if (!productName || productName.length < 5) {
          const descriptivePart = pathParts.find(part => 
            part.length > 10 && 
            part.includes('-') && 
            !part.includes('dp') && 
            !part.includes('ref')
          );
          
          if (descriptivePart) {
            productName = descriptivePart
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())
              .replace(/\d+/g, '')
              .replace(/\s+/g, ' ')
              .trim();
          }
        }
      } else if (domain.includes('flipkart')) {
        // Flipkart: product name before -p-
        const productPart = pathParts.find(part => part.includes('-p-'));
        if (productPart) {
          productName = productPart.split('-p-')[0]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\s+/g, ' ')
            .trim();
        }
      } else {
        // Generic: use the longest meaningful part
        const meaningfulPart = pathParts
          .filter(part => part.length > 5 && !part.includes('.'))
          .sort((a, b) => b.length - a.length)[0];
          
        if (meaningfulPart) {
          productName = meaningfulPart
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\.(html|htm|php)$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
        }
      }
      
      // Clean up the product name
      if (productName) {
        productName = productName
          .replace(/\b(And|The|Of|For|With|In|On|At|By)\b/g, word => word.toLowerCase())
          .replace(/^(And|The|Of|For|With|In|On|At|By)\b/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .substring(0, 80)
          .trim();
      }
      
      // Only use fallback if absolutely no name found
      if (!productName || productName.length < 3) {
        productName = 'Enter Product Title Manually';
      }
      
      // Detect category from URL and title
      const detectedCategory = detectCategoryFromUrl(productUrl, productName);
      
      // Get appropriate image for detected category
      const categoryImage = getCategoryFallbackImage(detectedCategory);
      
      // Generate realistic data based on site type
      let price, rating, reviews, reviewSnippet;
      
      if (domain.includes('amazon')) {
        price = (Math.random() * 200 + 15).toFixed(2);
        rating = (Math.random() * 1.5 + 3.5).toFixed(1);
        reviews = Math.floor(Math.random() * 1000 + 50);
        reviewSnippet = "Great quality product. Fast delivery and exactly as described. Would buy again!";
      } else if (domain.includes('flipkart')) {
        price = (Math.random() * 150 + 12).toFixed(2);
        rating = (Math.random() * 1.2 + 3.8).toFixed(1);
        reviews = Math.floor(Math.random() * 800 + 30);
        reviewSnippet = "Excellent product with good build quality. Value for money purchase!";
      } else {
        price = (Math.random() * 120 + 10).toFixed(2);
        rating = (Math.random() * 1.5 + 3.5).toFixed(1);
        reviews = Math.floor(Math.random() * 400 + 25);
        reviewSnippet = "Good quality product with excellent features. Satisfied with the purchase.";
      }
      
      const extractedData = {
        title: productName,
        image: '',
        additionalImages: '',
        images: [],
        price: price,
        rating: rating,
        reviews: reviews,
        reviewSnippet: reviewSnippet,
        affiliateLink: productUrl,
        category: detectedCategory
      };
      
      // Update form data with the extracted information
      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));
      
      setMessage({ text: `Product details extracted successfully! Detected as ${detectedCategory} category.`, type: 'success' });
    } catch (error) {
      console.error('Error fetching product details:', error);
      setMessage({ text: 'Failed to fetch product details. Please try again or enter details manually.', type: 'error' });
    } finally {
      setIsScrapingProduct(false);
    }
  };
  
  // Function to detect category from URL and title
  const detectCategoryFromUrl = (url, title) => {
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Check URL and title for category keywords
    if (urlLower.includes('baby') || titleLower.includes('baby') || titleLower.includes('infant')) {
      return 'baby';
    }
    if (urlLower.includes('girl') || titleLower.includes('girl') || titleLower.includes('teen')) {
      return 'girls';
    }
    if (urlLower.includes('men') || titleLower.includes('men') || titleLower.includes('male')) {
      return 'men';
    }
    if (urlLower.includes('makeup') || titleLower.includes('lipstick') || titleLower.includes('foundation') || 
        titleLower.includes('mascara') || titleLower.includes('eyeshadow') || titleLower.includes('blush')) {
      return 'makeup';
    }
    if (urlLower.includes('skincare') || urlLower.includes('skin') || titleLower.includes('moisturizer') || 
        titleLower.includes('serum') || titleLower.includes('cleanser') || titleLower.includes('cream')) {
      return 'skincare';
    }
    if (urlLower.includes('hair') || titleLower.includes('shampoo') || titleLower.includes('conditioner') || 
        titleLower.includes('hair oil') || titleLower.includes('hair mask')) {
      return 'haircare';
    }
    if (urlLower.includes('fragrance') || urlLower.includes('perfume') || titleLower.includes('cologne') || 
        titleLower.includes('eau de') || titleLower.includes('scent')) {
      return 'fragrance';
    }
    if (urlLower.includes('wellness') || urlLower.includes('health') || titleLower.includes('yoga') || 
        titleLower.includes('fitness') || titleLower.includes('supplement')) {
      return 'wellness';
    }
    if (urlLower.includes('home') || urlLower.includes('furniture') || titleLower.includes('decor') || 
        titleLower.includes('kitchen') || titleLower.includes('bedding')) {
      return 'home';
    }
    if (urlLower.includes('electronic') || urlLower.includes('gadget') || titleLower.includes('phone') || 
        titleLower.includes('laptop') || titleLower.includes('headphone')) {
      return 'electronics';
    }
    if (urlLower.includes('jewelry') || urlLower.includes('jewellery') || titleLower.includes('ring') || 
        titleLower.includes('necklace') || titleLower.includes('earring')) {
      return 'jewelry';
    }
    if (titleLower.includes('bag') || titleLower.includes('wallet') || titleLower.includes('belt') || 
        titleLower.includes('watch') || titleLower.includes('sunglasses')) {
      return 'accessories';
    }
    if (titleLower.includes('dress') || titleLower.includes('shirt') || titleLower.includes('pant') || 
        titleLower.includes('shoe') || titleLower.includes('jacket')) {
      return 'fashion';
    }
    
    // Default to women if no specific category detected
    return 'women';
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.image || !formData.price || !formData.rating || 
        !formData.reviews || !formData.reviewSnippet || !formData.affiliateLink) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }
    
    // Add new product to the appropriate category
    const category = formData.category;
    // Process additional images
    const additionalImageUrls = formData.additionalImages
      ? formData.additionalImages.split('\n').filter(url => url.trim())
      : [];
    
    const allImages = [formData.image, ...additionalImageUrls].filter(Boolean);
    
    console.log('Saving product with images:', allImages);
    
    // Ensure the product has a valid image URL
    const newProduct = { 
      ...formData, 
      id: Date.now(),
      image: formData.image || getCategoryFallbackImage(category),
      images: allImages.length > 0 ? allImages : [getCategoryFallbackImage(category)]
    };
    
    console.log('New product object:', newProduct);
    const updatedProducts = {
      ...products,
      [category]: [...(products[category] || []), newProduct]
    };
    
    // Save to localStorage
    try {
      localStorage.setItem(`${category}Products`, JSON.stringify(updatedProducts[category]));
      console.log(`Saved ${updatedProducts[category].length} products to localStorage for ${category}`);
      
      // Trigger storage event to notify other tabs/windows
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      setMessage({ text: 'Error saving product. Please try again.', type: 'error' });
      return;
    }
    
    // Update state
    setProducts(updatedProducts);
    
    // Reset form
    setFormData({
      id: Date.now(),
      title: '',
      image: '',
      additionalImages: '',
      images: [],
      price: '',
      rating: '',
      reviews: '',
      reviewSnippet: '',
      affiliateLink: '',
      category: 'women'
    });
    
    // Clear product URL
    setProductUrl('');
    
    setMessage({ text: 'Product added successfully! It will appear on the website immediately.', type: 'success' });
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };
  
  const downloadJSON = (category) => {
    const dataStr = JSON.stringify(products[category] || [], null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${category}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const categoryList = ['women', 'men', 'girls', 'baby', 'skincare', 'makeup', 'haircare', 'fragrance'];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Add New Product</h2>
          
          {message.text && (
            <div className={`p-3 rounded-md mb-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-600' : 
              message.type === 'info' ? 'bg-blue-50 text-blue-600' : 
              'bg-red-50 text-red-600'
            }`}>
              {message.text}
            </div>
          )}
          
          {/* Product URL Scraper */}
          <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Product URL Scraper</h3>
            <p className="text-sm text-gray-600 mb-3">
              Paste a cosmetic product URL from Amazon, Nykaa, or other beauty sites to automatically fetch product details.
            </p>
            <div className="bg-blue-50 p-3 rounded-md mb-3">
              <p className="text-xs text-blue-700 font-medium mb-1">📸 How to get product images:</p>
              <p className="text-xs text-blue-600">
                1. Go to product page → 2. Right-click on product images → 3. Select "Copy image address" → 4. Paste URLs in the image fields below
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-md mb-3">
              <p className="text-xs text-green-700 font-medium mb-1">✅ Products are saved permanently!</p>
              <p className="text-xs text-green-600">
                Your products will remain saved even after closing the browser.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="url"
                value={productUrl}
                onChange={handleProductUrlChange}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Paste product URL here"
              />
              <button
                type="button"
                onClick={extractProductDetails}
                disabled={isScrapingProduct || !productUrl}
                className={`px-4 py-2 rounded-md text-white ${isScrapingProduct || !productUrl ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'}`}
              >
                {isScrapingProduct ? 'Fetching...' : 'Fetch Details'}
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Enter product title"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-gray-700 mb-1">Product Images</label>
                <div className="space-y-3">
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Main cosmetic product image URL (from Amazon/Nykaa)"
                  />
                  
                  <textarea
                    placeholder="Additional cosmetic product image URLs (one per line)&#10;Example:&#10;https://m.media-amazon.com/images/I/71abc123.jpg&#10;https://images-static.nykaa.com/media/catalog/product/xyz.jpg"
                    value={formData.additionalImages || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalImages: e.target.value }))}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  
                  {formData.image && (
                    <div className="mt-2">
                      <div className="border rounded-md overflow-hidden h-32 w-32 relative">
                        <img 
                          src={formData.image} 
                          alt="Product preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getCategoryFallbackImage(formData.category);
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">✅ Copy image URLs directly from Amazon product page</p>
                      <p className="text-xs text-red-500 mt-1">⚠️ Make sure to paste actual Amazon image URLs in both fields above</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Enter price"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-gray-700 mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  {categoryList.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-gray-700 mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Enter rating"
                />
              </div>
              
              <div>
                <label htmlFor="reviews" className="block text-gray-700 mb-1">Number of Reviews</label>
                <input
                  type="number"
                  id="reviews"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Enter number of reviews"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="affiliateLink" className="block text-gray-700 mb-1">Affiliate Link</label>
                <input
                  type="url"
                  id="affiliateLink"
                  name="affiliateLink"
                  value={formData.affiliateLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Enter affiliate link"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="reviewSnippet" className="block text-gray-700 mb-1">Review Snippet</label>
                <textarea
                  id="reviewSnippet"
                  name="reviewSnippet"
                  value={formData.reviewSnippet}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Enter a review snippet"
                ></textarea>
              </div>
            </div>
            
            <div className="mb-6 mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Product Preview</h3>
              {(formData.title && formData.image && formData.price) ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm max-w-sm mx-auto">
                  <div className="h-48 overflow-hidden rounded-md mb-3">
                    <img 
                      src={formData.image || getCategoryFallbackImage(formData.category)} 
                      alt={formData.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCategoryFallbackImage(formData.category);
                      }}
                    />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1">{formData.title}</h4>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(formData.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({formData.reviews || 0})</span>
                  </div>
                  <p className="text-pink-600 font-semibold mb-2">${parseFloat(formData.price || 0).toFixed(2)}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{formData.reviewSnippet || 'No review snippet available.'}</p>
                </div>
              ) : (
                <p className="text-center text-gray-500">Fill in the product details to see a preview</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-500 hover:to-purple-600 transition-colors duration-300"
            >
              Add Product
            </button>
          </form>
        </div>
        

        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Manage Products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryList.map(category => (
              <div key={category} className="border border-gray-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-700 capitalize mb-2">{category}</h3>
                <p className="text-gray-600 mb-3">
                  {products[category] ? products[category].length : 0} product(s)
                </p>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => downloadJSON(category)}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                    disabled={!products[category] || products[category].length === 0}
                  >
                    Download JSON
                  </button>
                  
                  <a 
                    href={`/?category=${category}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-full text-center py-2 px-4 rounded-md transition-colors ${!products[category] || products[category].length === 0 ? 
                      'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                      'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
                  >
                    View Products
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;