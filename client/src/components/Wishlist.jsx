import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react'
import { removeItem } from '../store/wishlistSlice' // Make sure the path is correct

const Wishlist = () => {
  const dispatch = useDispatch()
  const wishlist = useSelector(state => state.wishlist.items) || []
  const recommendedProducts = useSelector(state => state.products?.recommended ?? [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center text-gray-600 hover:text-green-600 transition">
          <ArrowLeft className="mr-2" size={20} />
          Back to Shop
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Heart className="text-red-500 mr-3" fill="currentColor" />
          My Wishlist
        </h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Empty state */}
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Heart className="text-red-400" size={48} />
          </div>
          <h3 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Save your favorite items here to keep track of what you love
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Wishlist items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder-product.jpg"}
                    alt={item.name}
                    className="w-full h-64 object-contain bg-gray-50 p-4"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="mt-1 text-lg font-semibold text-green-600">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => dispatch(removeItem(item._id))}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/product/${item._id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium transition text-center"
                    >
                      View Details
                    </Link>
                    <button className="flex-1 bg-sky-900 hover:bg-sky-700 text-white py-2 px-4 rounded-md text-base font-medium transition flex items-center justify-center">
                      <ShoppingCart className="mr-2" size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional: Recommended Section */}
          {wishlist.length > 0 && recommendedProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-900 mb-6">You might also like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendedProducts.map(product => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                      <img
                        src={product.image && product.image.length > 0 ? product.image[0] : "/placeholder-product.jpg"}
                        alt={product.name}
                        className="object-contain max-h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-md font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-md font-semibold text-green-600">Rs. {product.price.toLocaleString()}</p>
                      <div className="mt-4 flex justify-between">
                        <Link
                          to={`/product/${product._id}`}
                          className="text-gray-600 hover:text-green-600 transition"
                        >
                          View Details
                        </Link>
                        <button className="text-gray-400 hover:text-green-600 transition">
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Wishlist
