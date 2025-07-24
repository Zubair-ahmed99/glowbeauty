import { useState, useEffect } from 'react';

const HeroSection = ({ onCategoryChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Discover Your Perfect Glow',
      subtitle: 'Premium cosmetics for every skin tone and style',
      cta: 'Shop Makeup',
      category: 'makeup'
    },
    {
      image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Skincare That Transforms',
      subtitle: 'Nourish your skin with our curated collection',
      cta: 'Shop Skincare',
      category: 'skincare'
    },
    {
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Hair Care Essentials',
      subtitle: 'Beautiful hair starts with the right products',
      cta: 'Shop Hair Care',
      category: 'haircare'
    },
    {
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Signature Fragrances',
      subtitle: 'Find your perfect scent for every occasion',
      cta: 'Shop Fragrance',
      category: 'fragrance'
    }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleCTAClick = (category) => {
    onCategoryChange(category);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-pink-50 to-purple-50">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => handleCTAClick(slide.category)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroSection;