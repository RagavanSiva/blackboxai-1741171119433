import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shops } from '../services/api';
import { Shop } from '../types';

const Home = () => {
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await shops.getAll();
        setFeaturedShops(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shops');
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Business Center
            </h1>
            <p className="text-xl mb-8">
              Create and manage your virtual shop or discover amazing businesses
            </p>
            <div className="space-x-4">
              <Link
                to="/shops/create"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
              >
                Create Your Shop
              </Link>
              <Link
                to="/shops"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Explore Shops
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Shops */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Shops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredShops.map((shop) => (
            <Link
              key={shop.id}
              to={`/shops/${shop.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                <p className="text-gray-600 mb-4">{shop.description}</p>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${
                          i < Math.round(shop.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {shop.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
