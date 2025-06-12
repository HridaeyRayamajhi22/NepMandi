
import CartProductModel from "../models/cartProduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import axios from "axios";
import crypto from "crypto";
import Order from "../models/order.model.js";
import { esewaConfig, khaltiConfig } from "../config/paymentConfigs.js";
import createTransactionUUID  from "../utils/createTransactionUUID.js";
import ProductModel from "../models/product.model.js";




// Helper to calculate discounted price
export const priceWithDiscount = (price, discountPercent = 0) => {
  const discountAmount = Math.ceil(
    (Number(price) * Number(discountPercent)) / 100
  );
  return Number(price) - discountAmount;
};

export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId; // from auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    if (!list_items || list_items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // Prepare one order object with product_details as array
    const orderPayload = {
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,

      product_details: list_items.map((el) => ({
        name: el.productId.name,
        image: el.productId.image,
        
        quantity: el.quantity,
        price: el.productId.price,
      })),
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      delivery_status: 'pending',   
      subTotalAmt,
      totalAmt,
    };

    // Save one order document
    const generatedOrder = await OrderModel.create(orderPayload);

    // Clear cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    console.error("CashOnDeliveryOrderController error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}


export const checkout = async (req, res) => {
  try {
    const { list_items, addressId, subTotalAmt, totalAmt, method } = req.body;
    const userId = req.userId;

    if (!method) return res.status(400).json({ success: false, message: "Missing payment method" });
    if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty or invalid" });
    }

    // Calculate total manually
    let totalPrice = 0;
    list_items.forEach(item => {
      if (!item.price || !item.quantity) throw new Error("Invalid item data");
      totalPrice += item.price * item.quantity;
    });
    const totalAmount = Number(totalPrice.toFixed(2));
    const paymentId = createTransactionUUID();

    // ✅ Fetch product details before creating the order
    const productDetails = await Promise.all(list_items.map(async (el) => {
      const product = await ProductModel.findById(el.productId);
      if (!product) throw new Error("Invalid product ID: " + el.productId);
      return {
        name: product.name,
        image: product.image,
        quantity: el.quantity,
        price: el.price,
      };
    }));

    // ✅ Create order
    const createdOrder = await OrderModel.create({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      paymentId,
      payment_status: "E_SEWA ", // or "KHALTI INITIATED" based on method
      delivery_address: addressId,
      delivery_status: 'pending',   
      product_details: productDetails,
      subTotalAmt,
      totalAmt: totalAmount,
      payment_method: method,
    });

    // === ESEWA ===
    if (method === "eSewa") {
      const signatureString = `total_amount=${totalAmount},transaction_uuid=${paymentId},product_code=${esewaConfig.merchantId}`;
      const signature = crypto.createHmac("sha256", esewaConfig.secret).update(signatureString).digest("base64");

      const esewaPayload = {
        amount: totalAmount,
        tax_amount: "0",
        total_amount: totalAmount,
        transaction_uuid: paymentId,
        product_code: esewaConfig.merchantId,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: esewaConfig.successUrl,
        failure_url: esewaConfig.failureUrl,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      };

      return res.json({
        success: true,
        method: "eSewa",
        paymentData: esewaPayload,
        orderId: createdOrder,
      });
    }

    // === KHALTI ===
    if (method === "khalti") {
      const khaltiPayload = {
        return_url: khaltiConfig.returnUrl,
        website_url: khaltiConfig.websiteUrl,
        amount: Math.round(totalAmount * 100), // in paisa
        purchase_order_id: createdOrder.orderId,
        purchase_order_name: "NepMandi Order",
        customer_info: {
          name: "Test User",
          email: "test@example.com",
          phone: "9800000000",
        },
      };

      const response = await fetch("https://dev.khalti.com/api/v2/", {
        method: "POST",
        headers: {
          Authorization: `Key ${khaltiConfig.secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(khaltiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Khalti API Error: " + JSON.stringify(errorData));
      }

      const khaltiResponse = await response.json();

      return res.json({
        success: true,
        method: "khalti",
        khaltiPaymentUrl: khaltiResponse.payment_url,
        orderId: createdOrder._id,
      });
    }

    return res.status(400).json({ success: false, message: "Unsupported payment method" });

  } catch (error) {
    console.error("Checkout error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const verifyEsewaController = async (req, res) => {
  try {
    const { amt, pid, refId } = req.body;
    const userId = req.userId;

    if (!amt || !pid || !refId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment fields",
      });
    }

    const verificationPayload = {
      amt,
      rid: refId,
      pid,
      scd: esewaConfig.merchantId,
    };

    const response = await axios.post(
      
      "https://rc-epay.esewa.com.np/api/epay/verify/v1",
      verificationPayload,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Esewa verify response:", response.data);

    if (response?.data?.status !== "COMPLETE") {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }


    return res.json({
      success: true,
      message: "Order payment verified and updated",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error during order verification:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const verifyKhaltiPayment = async (req, res) => {
  const { token, amount, purchase_order_id } = req.body;

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx: token },
      {
        headers: {
          Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.status !== "Completed") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    // Update order
    const order = await OrderModel.findOneAndUpdate(
      { orderId: purchase_order_id },
      { payment_status: "Paid" },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, message: "Khalti payment verified", order });

  } catch (error) {
    console.error("Khalti Verification Error:", error.message);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
}


// Controller to fetch user's order list
export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const orderList = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      success: true,
      message: "Order list retrieved successfully",
      data: orderList,
      error: false,
    });
  } catch (error) {
    console.error("getOrderDetailsController error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal server error",
    });
  }
}

// Controller to fetch single order by id

export const getSingleOrderController = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate("delivery_address");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Controller to update delivery status of an order
export const updateDeliveryStatusController = async (req, res) => {
  const { orderId } = req.params;            // send as URL param -> /api/admin/orders/:orderId/status
  const { status } = req.body;               // { status: 'delivered' }

  const valid = [
    'pending','processing','shipped',
    'out_for_delivery','delivered',
    'cancelled','returned'
  ];
  if (!valid.includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  const order = await OrderModel.findOneAndUpdate(
    {  _id: orderId },
    { delivery_status: status },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: 'Order not found' });

  res.json({ success:true, message:'Status updated', order });
};

