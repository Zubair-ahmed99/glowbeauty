import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onCategoryChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'women', name: 'Women' },
    { id: 'men', name: 'Men' },
    { id: 'girls', name: 'Girls' },
    { id: 'baby', name: 'Baby' },
    { id: 'skincare', name: 'Skincare' },
    { id: 'makeup', name: 'Makeup' },
    { id: 'haircare', name: 'Hair Care' },
    { id: 'fragrance', name: 'Fragrance' }
  ];

  return (
    <nav className="sticky top-0 z-10 bg-white bg-opacity-95 shadow-sm px-4 py-3">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <Link to="/" className="text-2xl font-semibold text-pink-500">
            Glow<span className="text-purple-400">Beauty</span>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6 w-full md:w-auto">
          {/* Categories dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="px-4 py-2 rounded-full text-sm bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors flex items-center"
            >
              Categories
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showCategoryDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 grid grid-cols-1 gap-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      onCategoryChange(category.id);
                      setShowCategoryDropdown(false);
                    }}
                    className="px-4 py-2 text-sm text-left hover:bg-pink-50 hover:text-pink-700"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick category buttons */}
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button 
              onClick={() => onCategoryChange('all')}
              className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-purple-700 transition-colors whitespace-nowrap font-medium"
            >
              All
            </button>
            <button 
              onClick={() => onCategoryChange('women')}
              className="px-3 py-1 rounded-full text-sm bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors whitespace-nowrap"
            >
              Women
            </button>
            <button 
              onClick={() => onCategoryChange('makeup')}
              className="px-3 py-1 rounded-full text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors whitespace-nowrap"
            >
              Makeup
            </button>
            <button 
              onClick={() => onCategoryChange('skincare')}
              className="px-3 py-1 rounded-full text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors whitespace-nowrap"
            >
              Skincare
            </button>
            <button 
              onClick={() => onCategoryChange('haircare')}
              className="px-3 py-1 rounded-full text-sm bg-green-100 hover:bg-green-200 text-green-700 transition-colors whitespace-nowrap"
            >
              Hair Care
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <Link to="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;