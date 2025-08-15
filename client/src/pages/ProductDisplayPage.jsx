import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/axios";
import AxiosToastError from "../utils/axiostoasterror";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";
import { motion } from "framer-motion";
import { addItem, removeItem } from "../store/wishlistSlice";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-").slice(-1)[0];
  const [data, setData] = useState({ name: "", image: [], more_details: {} });
  const [imageIndex, setImageIndex] = useState(0);
  const strip = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await Axios({
          ...SummaryApi.getProductDetails,
          data: { productId },
        });
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        AxiosToastError(err);
      }
    };

    window.scrollTo(0, 0);
    setImageIndex(0);
    fetchDetails();
  }, [params]);

  const scrollStrip = (dir) => {
    if (strip.current) strip.current.scrollLeft += dir * 120;
    setImageIndex((current) => {
      const newIndex = current + dir;
      if (newIndex < 0) return 0;
      if (newIndex >= data.image.length) return data.image.length - 1;
      return newIndex;
    });
  };

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlist.some((item) => item._id === data._id);

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeItem(data._id));
    } else {
      dispatch(addItem(data));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-2">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link to="/" className="hover:text-gray-700">Category</Link>
        <span>/</span>
        <span className="font-medium text-gray-800">{data.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Hero Image */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden min-h-[20rem] sm:min-h-[28rem] lg:min-h-[72vh]">
            {data.image.length ? (
              <motion.img
                key={imageIndex}
                src={data.image[imageIndex]}
                alt={data.name}
                className="max-w-full max-h-full object-contain p-4 sm:p-6"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <p className="text-gray-400 italic">No image available</p>
            )}
          </div>

          {/* Dots */}
          {data.image.length > 1 && (
            <div className="flex justify-center gap-2">
              {data.image.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition
                    ${i === imageIndex ? "bg-gray-800 scale-110" : "bg-gray-300 hover:scale-110 hover:bg-gray-400"}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnails Strip */}
          {data.image.length > 1 && (
            <div className="relative">
              <div
                ref={strip}
                className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth py-2 px-1"
              >
                {data.image.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition
                      ${i === imageIndex ? "border-green-500 shadow-md" : "border-transparent hover:border-gray-200"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Scroll Buttons for large screens */}
              <button
                onClick={() => scrollStrip(-1)}
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full
                  shadow-md hover:bg-gray-100 border border-gray-200"
              >
                <FaAngleLeft className="text-gray-600" />
              </button>
              <button
                onClick={() => scrollStrip(1)}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full
                  shadow-md hover:bg-gray-100 border border-gray-200"
              >
                <FaAngleRight className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-snug">{data.name}</h1>
            {data.unit && <p className="text-gray-600 text-base sm:text-lg">{data.unit}</p>}
          </div>

          {/* Price / Cart */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </span>
              {data.discount > 0 && (
                <>
                  <span className="text-base sm:text-xl text-gray-500 line-through">
                    {DisplayPriceInRupees(data.price)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm font-medium">
                    {data.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {data.stock === 0 ? (
              <p className="text-red-600 font-medium text-lg">Out of stock</p>
            ) : (
              <div className="flex flex-row items-center gap-4">
                <AddToCartButton
                  data={data}
                  className="flex-grow py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition"
                />

                <button
                  onClick={toggleWishlist}
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg border transition
      ${isInWishlist
                      ? "bg-red-100 border-red-400 text-red-600"
                      : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <Heart fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" />
                </button>
              </div>

            )}
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ["🚚", "Fast Delivery"],
              ["💰", "Best Prices"],
              ["📦", "Wide Range"],
            ].map(([icon, label]) => (
              <div key={label} className="bg-gray-50 text-center p-4 rounded-lg">
                <div className="text-green-600 text-2xl mb-2">{icon}</div>
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {data.description && (
            <div className="prose prose-sm text-gray-700">
              <h3 className="font-semibold text-gray-900">Description</h3>
              <p>{data.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Specs */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        <div className="space-y-6 text-gray-800 leading-relaxed">
          {data.unit && (
            <div>
              <h3 className="font-semibold text-lg mb-1">Unit</h3>
              <p>{data.unit}</p>
            </div>
          )}
          {data.more_details &&
            Object.entries(data.more_details).map(([k, v]) => (
              <div key={k}>
                <h3 className="font-semibold text-lg mb-1">{k}</h3>
                <p>{v}</p>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDisplayPage;
