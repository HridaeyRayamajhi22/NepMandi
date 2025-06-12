import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { useEffect } from 'react'

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order) || []

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  /* 🔑 centralised colour map for delivery status */
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-200 text-gray-700',
  }


  return (

    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id + index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6"
              >
                {/* ▸ Order Header (unchanged except delivery badge removed) */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-indigo-600">
                      Order #{order.orderId}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${order.payment_status === 'CASH ON DELIVERY'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {order.payment_status || 'Paid'}
                  </span>
                </div>

                {/* ▸ Product Info (unchanged) */}
                <div className="space-y-4">
                  {Array.isArray(order.product_details) ? (
                    order.product_details.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-5">
                        <img
                          src={
                            Array.isArray(product.image)
                              ? product.image[0]
                              : product.image || '/placeholder.png'
                          }
                          alt={product.name || 'Unnamed Product'}
                          className="w-20 h-20 rounded-lg object-cover border"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {product.name || 'Unnamed Product'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Quantity: {product.quantity || 1}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-700">Price:</p>
                          <p className="text-lg font-bold text-gray-800">
                            {product.price && product.quantity
                              ? `रु${(
                                Number(product.price) * Number(product.quantity)
                              ).toFixed(2)}`
                              : 'Price not available'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 text-sm">
                      No product details available.
                    </div>
                  )}
                </div>

                {/* ▸ Order Total (unchanged) */}
                <div className="mt-4 text-right">
                  <p className="text-sm text-gray-600">Total Amount:</p>
                  <p className="text-xl font-bold text-gray-900">
                    रु{order.totalAmt?.toFixed(2) || 'N/A'}
                  </p>
                </div>

                {/* ▸ Footer: Modern layout - details on left, badge on right with spacing */}
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  {/* View Details link with subtle icon */}
                  <button
                    onClick={() =>
                      (window.location.href = `/dashboard/order/${order._id}`)
                    }
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    View Order Details
                  </button>

                  {/* Delivery Status Badge */}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm uppercase ${statusColors[order.delivery_status] || 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {order.delivery_status.replace(/_/g, ' ')}
                  </span>
                </div>



              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <NoData message="No orders yet. Start shopping now!" />
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
