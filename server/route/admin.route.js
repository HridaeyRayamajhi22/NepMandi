// routes/admin.route.js
import express from "express";
import OrderModel from "../models/order.model.js";
import auth from "../middleware/auth.js"; // sets req.userId
import { admin } from "../middleware/Admin.js"; // verifies role === 'admin'

const AdminRouter = express.Router();

/* ───────────────────────────────────────────────
   GET  /api/admin/orders         →  ALL ORDERS
   ─────────────────────────────────────────────── */
AdminRouter.get("/orders", auth, admin, async (req, res) => {
  try {
    // populate userId so you can show user names in the table
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json({ success: true, orders });
  } catch (error) {
    console.error("ADMIN GET /orders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

/* ───────────────────────────────────────────────
   PUT  /api/admin/orders/:id/status  →  UPDATE DELIVERY STATUS
   ─────────────────────────────────────────────── */
AdminRouter.put("/orders/:id/status", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed statuses (same as your schema enum)
    const valid = [
      "pending",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
    ];
    if (!valid.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { delivery_status: status },
      { new: true }
    ).populate("userId", "name email");

    // If no order found, return 404
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({
      success: true,
      message: "Delivery status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("ADMIN PUT /orders/:id/status error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update status" });
  }
});

export default AdminRouter;
