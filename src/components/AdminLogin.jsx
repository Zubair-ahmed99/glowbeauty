import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Simple admin password - in a real app, this would be handled securely on a backend
  const ADMIN_PASSWORD = 'admin123';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit triggered, password:', password);
    
    if (password === ADMIN_PASSWORD) {
      console.log('Password correct, setting isAdmin and navigating');
      // Store admin status in localStorage
      localStorage.setItem('isAdmin', 'true');
      // Try to navigate with a slight delay to ensure localStorage is set
      setTimeout(() => {
        console.log('Navigating to /admin/panel');
        navigate('/admin/panel');
      }, 100);
    } else {
      console.log('Password incorrect');
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Admin Login</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Enter admin password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-500 hover:to-purple-600 transition-colors duration-300"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700 block w-full"
          >
            Return to Home
          </button>
          
          <button
            onClick={() => {
              localStorage.setItem('isAdmin', 'true');
              console.log('Set isAdmin to true directly');
              navigate('/admin/panel');
            }}
            className="text-sm text-blue-500 hover:text-blue-700 block w-full"
          >
            Direct Admin Access (Debug)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;