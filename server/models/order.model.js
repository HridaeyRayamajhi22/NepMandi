// models/order.model.js
import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId:  { type: String, required: true, unique: true },

    /* --- new & unified --- */
    delivery_status: {
      type: String,
      enum: [
        'pending',        // default while payment is being made / before packed
        'processing',     // packed & waiting courier pickup
        'shipped',        // handed to courier
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned'
      ],
      default: 'pending'
    },

    /* keep everything you already had ⬇︎ */
    payment_status:  { type: String, default: 'UNPAID' },
    payment_method:  { type: String },
    paymentId:       { type: String },
    product_details: [{
      name: String,
      image: [String],
      quantity: Number,
      price: Number
    }],
    delivery_address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    subTotalAmt: Number,
    totalAmt:     Number
  },
  { timestamps: true }
);

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;