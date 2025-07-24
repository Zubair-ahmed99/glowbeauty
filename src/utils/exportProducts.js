// Utility to export products from localStorage to JSON files
export const exportAllProducts = () => {
  const categories = ['women', 'men', 'girls', 'baby', 'skincare', 'makeup', 'haircare', 'fragrance'];
  const allProducts = {};
  
  categories.forEach(category => {
    const products = localStorage.getItem(`${category}Products`);
    allProducts[category] = products ? JSON.parse(products) : [];
  });
  
  // Create downloadable JSON file
  const dataStr = JSON.stringify(allProducts, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'glowbeauty-products.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  console.log('Products exported:', allProducts);
  return allProducts;
};