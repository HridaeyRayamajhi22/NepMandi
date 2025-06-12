// models/PendingPayment.js
import mongoose from "mongoose";

const pendingPaymentSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  list_items: { type: Array, required: true },
  addressId: { type: mongoose.Schema.Types.ObjectId, required: true },
  subTotalAmt: { type: Number, required: true },
  totalAmt: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // auto-delete after 10 mins
});

export default mongoose.model("PendingPayment", pendingPaymentSchema);
