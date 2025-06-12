import React, { useEffect, useState } from 'react'
import Axios from '../utils/axios'
import toast, { Toaster } from 'react-hot-toast';
import { FiRefreshCw, FiChevronDown, FiCheck, FiX, FiTruck, FiPackage, FiCreditCard } from 'react-icons/fi';

const statusOptions = [
  'pending',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned',
]

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
}

const statusIcons = {
  pending: <FiRefreshCw className="mr-1" />,
  processing: <FiRefreshCw className="mr-1 animate-spin" />,
  shipped: <FiPackage className="mr-1" />,
  out_for_delivery: <FiTruck className="mr-1" />,
  delivered: <FiCheck className="mr-1" />,
  cancelled: <FiX className="mr-1" />,
  returned: <FiRefreshCw className="mr-1" />,
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [localStatus, setLocalStatus] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrders = async () => {
    try {
      const res = await Axios.get('/api/admin/orders', { withCredentials: true })
      setOrders(res.data.orders)
      setError(null)
    } catch (err) {
      setError('Failed to load orders. Please try again later.')
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  /* ───────── fetch once ───────── */
  useEffect(() => {
    fetchOrders()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  /* ───────── handlers ───────── */
  const handleSelect = (id, value) =>
    setLocalStatus((prev) => ({ ...prev, [id]: value }))

  const handleUpdate = async (id) => {
    const newStatus = localStatus[id]
    if (!newStatus) return

    try {
      await Axios.put(`/api/admin/orders/${id}/status`, { status: newStatus })
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, delivery_status: newStatus } : o))
      )
      // clear local selection
      setLocalStatus((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
      toast.success('Order status updated successfully!')
    } catch {
      toast.error('Status update failed')
    }
  }

  /* ───────── render ────────── */
  if (loading && !refreshing)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-900 to-indigo-900 p-6">
        <Toaster position="top-center" />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <FiPackage className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sky-400 text-xl" />
          </div>
          <h2 className="text-2xl font-semibold text-sky-100">Loading Orders...</h2>
          <p className="text-sky-300">Please wait while we fetch your orders</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-indigo-900 p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Order Management</h1>
            <p className="text-sky-200">View and manage all customer orders</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`mt-4 md:mt-0 flex items-center px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white transition-all ${
              refreshing ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {refreshing ? (
              <FiRefreshCw className="animate-spin mr-2" />
            ) : (
              <FiRefreshCw className="mr-2" />
            )}
            Refresh Orders
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-lg mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <FiX className="mr-2" />
              {error}
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sky-200 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sky-200 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sky-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sky-200 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-sky-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiPackage className="text-sky-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-white">No orders found</h3>
                        <p className="text-sky-300 mt-1">When orders are placed, they'll appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">#{order.orderId}</div>
                        <div className="text-xs text-sky-300">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-sky-700 rounded-full flex items-center justify-center text-white">
                            {order.userId?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{order.userId?.name || 'Guest User'}</div>
                            <div className="text-xs text-sky-300">{order.userId?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <select
                            value={localStatus[order._id] ?? order.delivery_status}
                            onChange={(e) => handleSelect(order._id, e.target.value)}
                            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-sky-900 text-white">
                                {opt.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown className="text-white/50 -ml-6 pointer-events-none" />
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCreditCard className={`mr-2 ${
                            order.payment_status === 'paid' ? 'text-green-400' : 'text-amber-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            order.payment_status === 'paid' ? 'text-green-300' : 'text-amber-300'
                          }`}>
                            {order.payment_status || 'N/A'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleUpdate(order._id)}
                          disabled={!localStatus[order._id]}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            localStatus[order._id]
                              ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md hover:shadow-sky-500/30'
                              : 'bg-white/5 text-white/50 cursor-not-allowed'
                          }`}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-sky-300">
            <div>
              Showing <span className="font-medium text-white">{orders.length}</span> orders
            </div>
            <div className="flex space-x-4">
              <button className="hover:text-white transition-colors">Previous</button>
              <button className="hover:text-white transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}