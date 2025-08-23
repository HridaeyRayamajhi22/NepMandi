import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/axiostoasterror.js';
import Axios from '../utils/axios.js';
import SummaryApi from '../common/SummaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // show skeleton immediately
  const containerRef = useRef();
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const loadingCardNumber = new Array(6).fill(null);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true); // start loading
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id }
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, [id]); // fetch again if category changes

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 300;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 300;
  };

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    );
    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`;
    return url;
  };

  const redirectURL = handleRedirectProductListpage();

  return (
    <div className="my-12">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4 mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">{name}</h3>
        <Link to={redirectURL} className="text-green-600 hover:text-green-500 font-medium transition-colors">
          See All
        </Link>
      </div>

      <div className="relative">
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-none scroll-smooth px-4"
          ref={containerRef}
        >
          {loading
            ? loadingCardNumber.map((_, index) => (
                <CardLoading key={`loading-${index}`} />
              ))
            : data.length > 0
              ? data.map((p, index) => (
                  <CardProduct
                    data={p}
                    key={p._id + '-CategorywiseProductDisplay-' + index}
                  />
                ))
              : (
                <p className="text-gray-500 text-sm">No products found.</p>
              )
          }
        </div>

        {/* Scroll buttons */}
        <div className="hidden lg:flex absolute top-1/2 left-0 right-0 px-4 transform -translate-y-1/2 justify-between pointer-events-none">
          <button
            onClick={handleScrollLeft}
            className="pointer-events-auto bg-white hover:bg-gray-100 text-gray-700 shadow-md p-3 rounded-full transition duration-300"
          >
            <FaAngleLeft size={20} />
          </button>
          <button
            onClick={handleScrollRight}
            className="pointer-events-auto bg-white hover:bg-gray-100 text-gray-700 shadow-md p-3 rounded-full transition duration-300"
          >
            <FaAngleRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;

