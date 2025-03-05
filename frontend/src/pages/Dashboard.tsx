import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shops, products } from '../services/api';
import { Shop, Product, User } from '../types';

const Dashboard = () => {
  const [userShops, setUserShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    const fetchUserShops = async () => {
      try {
        const response = await shops.getAll();
        // Filter shops owned by the current user
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          const filteredShops = response.data.filter(
            (shop: Shop) => shop.owner === userData.id
          );
          setUserShops(filteredShops);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load shops');
        setLoading(false);
      }
    };

    fetchUserShops();
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {user?.role === 'business_owner' && (
          <Link
            to="/shops/create"
            className="btn-primary"
          >
            <i className="fas fa-plus mr-2"></i>
            Create New Shop
          </Link>
        )}
      </div>

      {user?.role === 'business_owner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userShops.map((shop) => (
            <div key={shop.id} className="card card-hover">
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                <p className="text-gray-600 mb-4">{shop.description}</p>
                <div className="flex items-center justify-between">
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
                  <Link
                    to={`/shops/${shop.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Manage Shop
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'customer' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Welcome to Business Center!
          </h2>
          <p className="text-gray-600 mb-8">
            Explore our marketplace to discover amazing shops and products.
          </p>
          <Link
            to="/shops"
            className="btn-primary"
          >
            Explore Shops
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      )}

      {userShops.length === 0 && user?.role === 'business_owner' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Shops Yet
          </h2>
          <p className="text-gray-600 mb-8">
            Create your first shop and start selling your products!
          </p>
          <Link
            to="/shops/create"
            className="btn-primary"
          >
            Create Your First Shop
            <i className="fas fa-plus ml-2"></i>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
