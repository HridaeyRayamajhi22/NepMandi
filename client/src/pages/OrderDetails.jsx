import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios'
import { jsPDF } from 'jspdf'
import { X } from 'lucide-react'
import autoTable from 'jspdf-autotable'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await Axios.get(`http://localhost:8080/api/order/${id}`, {
          withCredentials: true,
        })
        setOrder(res.data?.order)
      } catch (err) {
        console.error('Error fetching order:', err)
      }
    }
    fetchOrder()
  }, [id])

  const downloadInvoice = () => {
    if (!order) {
      alert('Order data not loaded yet!')
      return
    }

    /* … your existing jsPDF code stays exactly the same … */
  }

  if (!order)
    return <p className="text-center py-10 text-gray-500">Loading order details...</p>

  const totalQuantity = order.product_details.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  )

  /* ✨ nicer badge colours (bg + text) */
  const badgeColour = {
    pending:          'bg-yellow-100 text-yellow-800',
    processing:       'bg-blue-100 text-blue-800',
    shipped:          'bg-indigo-100 text-indigo-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered:        'bg-green-100 text-green-800',
    cancelled:        'bg-red-100 text-red-800',
    returned:         'bg-gray-200 text-gray-700',
  }[order.delivery_status] || 'bg-gray-100 text-gray-700'

  return (
    <div className="flex justify-center items-start min-h-screen pt-6 px-2 bg-gray-50">
      <div className="relative bg-white border border-gray-200 shadow-sm rounded-xl p-5 w-full max-w-md text-sm text-gray-800">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h1 className="text-xl font-semibold mb-4">Order Summary</h1>

        {/* Order info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium">{order.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-2 border-y py-3 mb-4">
          {order.product_details.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="w-1/2">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">
                  रु{item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-right font-semibold">
                रु{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Total Qty</span>
            <span>{totalQuantity}</span>
          </div>

          <div className="flex justify-between font-semibold text-green-700">
            <span>Grand Total</span>
            <span>रु{order.totalAmt.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment Via</span>
            <span>{order.payment_status}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-500">Shipping</span>
            <address className="text-right max-w-[200px] whitespace-pre-wrap">
              {typeof order.delivery_address === 'string'
                ? order.delivery_address
                : [
                    order.delivery_address?.address_line,
                    order.delivery_address?.city,
                    order.delivery_address?.state,
                    order.delivery_address?.mobile,
                  ]
                    .filter(Boolean)
                    .join(', ')}
            </address>
          </div>

          {/* ⭐️ Delivery Status row — nicely aligned */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Delivery Status</span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full uppercase ${badgeColour}`}>
              {order.delivery_status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <button
          onClick={downloadInvoice}
          className="w-full text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow"
        >
          Download Invoice
        </button>
      </div>
    </div>
  )
}

export default OrderDetails
