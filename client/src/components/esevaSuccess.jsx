import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";   // add useSelector here
import { handleAddItemCart} from "../store/cartProduct";

const EsewaSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cartItem.cart);  // <- moved here
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("AccessToken");

  useEffect(() => {
    console.log("Cart after clearing: ", cart);
  }, [cart]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const amt = query.get("amt");
    const pid = query.get("pid");
    const refId = query.get("refId");

    if (!amt || !pid || !refId) {
      toast.error("Missing payment parameters!");
      navigate("/checkout");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to complete payment verification.");
      navigate("/login");
      return;
    }

    const verifyPayment = async () => {
      try {
        await axios.post(
          "/api/order/verify-esewa",
          { amt, pid, refId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Payment verified successfully!");
      } catch (error) {
        toast.error("Payment verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, navigate, token]);

  if (loading) return <p>Verifying your payment, please wait...</p>;

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction was successful.</p>
      <button onClick={() => navigate("/")} className="go-home-button">
        Go to Homepage
      </button>
    </div>
  );
};

export default EsewaSuccess;
