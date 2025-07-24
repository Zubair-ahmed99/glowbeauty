import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import CategoryPage from './components/CategoryPage'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import HeroSection from './components/HeroSection'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdmin') === 'true';
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to /admin');
    return <Navigate to="/admin" replace />;
  }
  
  console.log('Authenticated, rendering children');
  return children;
}

function App() {
  // Check URL for category parameter
  const getInitialCategory = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      
      // Check if there's a refresh parameter
      const refreshParam = params.get('refresh');
      if (refreshParam) {
        console.log('Refresh parameter detected, forcing reload of products');
        // Clear the refresh parameter from URL to prevent infinite refreshes
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('refresh');
        window.history.replaceState({}, '', newUrl);
      }
      
      return categoryParam || 'all';
    }
    return 'all';
  };
  
  const [currentCategory, setCurrentCategory] = useState(getInitialCategory())
  const [searchTerm, setSearchTerm] = useState('')
  const [showHero, setShowHero] = useState(true)

  const handleCategoryChange = (category) => {
    setCurrentCategory(category)
    setSearchTerm('') // Reset search when changing categories
    setShowHero(false) // Hide hero when browsing categories
    
    // Update URL with category parameter
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  // Check if user is admin (for protected routes)
  const isAdmin = () => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    console.log('Checking admin status:', adminStatus);
    return adminStatus;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white font-['Poppins',sans-serif]">
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/panel" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <>
                <Navbar 
                  onCategoryChange={handleCategoryChange} 
                  onSearch={handleSearch} 
                />
                {showHero && (
                  <HeroSection 
                    onCategoryChange={handleCategoryChange}
                  />
                )}
                <CategoryPage 
                  category={currentCategory} 
                  searchTerm={searchTerm} 
                />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
