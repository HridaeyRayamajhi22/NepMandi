import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useSelector, useDispatch } from 'react-redux';
import AxiosToastError from '../utils/axiostoasterror';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { clearCart, handleAddItemCart } from '../store/cartProduct';
import { setUserDetails } from '../store/userSlice';
import esevaLogo from '../assets/eseva.png';
import khaltiLogo from '../assets/khalti.png';

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchOrder } = useGlobalContext();
  const dispatch = useDispatch();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        dispatch(clearCart());
        dispatch(setUserDetails({ ...user, shopping_cart: [] }));
        fetchOrder();
        navigate('/success', { state: { text: 'Order' } });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = () => {
    setShowPaymentModal(true);
  };

  const handleSelectedPayment = async (method) => {
    const formattedCartItems = cartItemsList
      .filter((item) => item && (item.productId || item._id))
      .map((item) => ({

        productId: item.productId?._id || item._id,
        quantity: item.quantity,
        price: item.productId?.price || 0,
      }));

    if (!addressList[selectAddress]?._id) {
      toast.error('Please select a valid address');
      return;
    }

    setIsLoadingPayment(true);

    try {
      const response = await Axios.post('/api/order/checkout', {
        list_items: formattedCartItems,
        addressId: addressList[selectAddress]?._id,
        subTotalAmt: totalPrice,
        totalAmt: totalPrice,
        method, // 'eSewa' or 'Khalti'
      });

      const { paymentData, success, message } = response.data;

      if (!success) {
        toast.error(message || 'Payment initiation failed');
        return;
      }

      // Dynamically create form and redirect to payment gateway
      const form = document.createElement('form');
      form.method = 'POST';

      if (method === 'eSewa') {
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
      } else if (method === 'Khalti') {
        form.action = 'https://khalti.com/api/epayment/initiate'; // replace with correct URL if different
      }

      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Payment initiation failed.');
    } finally {
      setIsLoadingPayment(false);
    }
  };


  return (
    <section className="bg-gray-50 py-10">
      <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
        {/* Address Section */}
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Choose your address</h3>
          <div className="space-y-4">
            {addressList.map((address, index) => (
              <label htmlFor={'address' + index} key={address._id || index}>
                <div className="border rounded-lg p-4 flex gap-4 hover:bg-gray-100 cursor-pointer">
                  <input
                    id={'address' + index}
                    type="radio"
                    value={index}
                    onChange={(e) => setSelectAddress(Number(e.target.value))}
                    name="address"
                    className="h-5 w-5 border-gray-300 focus:ring-2 focus:ring-green-500"
                    checked={selectAddress === index}
                  />
                  <div>
                    <p className="font-medium text-gray-700">{address.address_line}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state}, {address.country} - {address.pincode}
                    </p>
                    <p className="text-sm text-gray-600">Mobile: {address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div
            onClick={() => setOpenAddress(true)}
            className="mt-6 bg-sky-100 hover:bg-sky-200 text-sky-900 font-semibold text-center py-3 rounded-lg cursor-pointer"
          >
            Add New Address
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span className="flex items-center gap-2">
                <span className="line-through text-gray-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span className="font-semibold text-green-600">{DisplayPriceInRupees(totalPrice)}</span>
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Quantity Total</span>
              <span>{totalQty} item(s)</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-gray-800 border-t pt-4">
              <span>Grand Total</span>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              className="w-full py-3 bg-sky-900 hover:bg-sky-600 text-white rounded-lg font-semibold transition duration-200"
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>
            <button
              className="w-full py-3 border-2 border-sky-900 text-sky-900 hover:bg-sky-800 hover:text-white rounded-lg font-semibold transition duration-200"
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {/* Payment Selection Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center relative">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>

            <div className="space-y-4">
              {/* eSewa Button */}
              <button
                onClick={() => handleSelectedPayment('eSewa')}
                className="w-full flex items-center gap-4 bg-green-50 hover:bg-green-100 text-green-800 border border-green-600 rounded-xl px-4 py-3 transition duration-200 shadow-sm hover:shadow-md"
                disabled={isLoadingPayment}
              >
                <div className="bg-green-600 p-2 ">
                  <img src={esevaLogo} alt="eSewa logo" className="h-6 w-6" />
                </div>
                <span className="flex-grow text-left font-semibold">Pay with eSewa</span>
              </button>

              {/* Khalti Button */}
              <button
                onClick={() => handleSelectedPayment('Khalti')}
                className="w-full flex items-center gap-4 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-600 rounded-xl px-4 py-3 transition duration-200 shadow-sm hover:shadow-md"
                disabled={isLoadingPayment}
              >
                <div className="bg-purple-600 p-2">
                  <img src={khaltiLogo} alt="Khalti logo" className="h-6 w-6" />
                </div>
                <span className="flex-grow text-left font-semibold">Pay with Khalti</span>
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}


    </section>
  );
};

export default CheckoutPage;
