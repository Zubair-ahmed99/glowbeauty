// Utility to clear all products from localStorage
export const clearAllProducts = () => {
  const categories = ['women', 'men', 'girls', 'baby', 'skincare', 'makeup', 'haircare', 'fragrance'];
  
  categories.forEach(category => {
    localStorage.removeItem(`${category}Products`);
  });
  
  console.log('All products cleared from localStorage');
};

// Run this function to clear products
clearAllProducts();