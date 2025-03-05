import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shops, products } from '../services/api';
import { Shop, Product, User } from '../types';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
    }

    const fetchShopDetails = async () => {
      try {
        const [shopResponse, productsResponse] = await Promise.all([
          shops.getById(id!),
          shops.getProducts(id!)
        ]);

        setShop(shopResponse.data);
        setShopProducts(productsResponse.data);
        setIsOwner(shopResponse.data.owner === user?.id);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load shop details');
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || 'Shop not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={shop.imageUrl}
              alt={shop.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
              <p className="text-gray-600">{shop.description}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-6">
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
              <span className="ml-2 text-gray-600">
                {shop.rating.toFixed(1)}
              </span>
            </div>
            {isOwner && (
              <button
                onClick={() => navigate(`/shops/${shop.id}/edit`)}
                className="btn-secondary"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Shop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          {isOwner && (
            <button
              onClick={() => navigate(`/shops/${shop.id}/products/create`)}
              className="btn-primary"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Product
            </button>
          )}
        </div>

        {shopProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Products Yet
            </h3>
            <p className="text-gray-600">
              {isOwner
                ? "Start adding products to your shop!"
                : "This shop hasn't added any products yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopProducts.map((product) => (
              <div key={product.id} className="card card-hover">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={`text-sm ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  {isOwner && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                        className="btn-secondary"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            try {
                              await products.delete(product.id);
                              setShopProducts(shopProducts.filter(p => p.id !== product.id));
                            } catch (err: any) {
                              alert(err.message || 'Failed to delete product');
                            }
                          }
                        }}
                        className="btn-danger"
                      >
                        <i className="fas fa-trash-alt mr-1"></i>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>
        {shop.reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-600">Be the first to review this shop!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {shop.reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;
