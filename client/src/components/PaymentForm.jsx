import React, { useState } from "react";
import axios from "axios";

const PaymentComponent = () => {
  const [amount, setAmount] = useState("");

  // Helper to create and submit the form dynamically
  const submitEsewaForm = (paymentData) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // eSewa payment URL

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // Send amount (and other data if needed) to backend payment controller
      const response = await axios.post("http://localhost:8080/api/payment", {
        amount, // Send whatever your backend expects
        // productId: someProductId, // add if needed
        // quantity: 1, // optional
      });

      const paymentData = response.data.paymentData;

      if (paymentData) {
        submitEsewaForm(paymentData);
      } else {
        alert("Failed to get payment data from server.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed, check console.");
    }
  };

  return (
    <div>
      <h1>eSewa Payment Integration</h1>

      <form onSubmit={handlePayment} className="styled-form">
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Enter amount"
          />
        </div>

        <button type="submit" className="submit-button">
          Pay with eSewa
        </button>
      </form>
    </div>
  );
};

export default PaymentComponent;
