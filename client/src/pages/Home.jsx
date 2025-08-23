import React, { useState } from 'react';
import Designer1 from '../assets/Designer1.png';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();

  const [showLocal, setShowLocal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (value) => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowLocal(value);
      setIsAnimating(false);
    }, 300);
  };

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    );
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`;
    navigate(url);
  };

  const filteredCategories = categoryData?.filter(cat =>
    showLocal ? cat.isLocal : !cat.isLocal
  );

  return (
    <section className="bg-white">
      {/* Banner */}
      <div className="w-full mx-auto sm:w-[90%] lg:w-[85%] px-2 sm:px-8 md:px-10 pt-3">
        <picture>
          <source media="(max-width: 600px)" srcSet={Designer1} />
          <img
            src={Designer1}
            alt="Promotional Banner"
            className="w-full object-cover rounded-2xl shadow-md h-[100px] sm:h-[150px] md:h-[180px] lg:h-[200px] xl:h-[220px]"
          />
        </picture>
      </div>

      {/* Categories Header with Animated Toggle */}
      <div className="container mx-auto mt-8 px-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 whitespace-nowrap">
            🌿 Browse by Categories
          </h2>

          {/* Toggle */}
          <div
            className={`relative flex flex-wrap items-center justify-center h-auto rounded-full shadow-lg bg-gray-100 border border-gray-200 p-1 transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}
          >
            <button
              onClick={() => handleToggle(false)}
              className={`relative px-4 py-1 sm:px-6 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 z-10 ${!showLocal
                ? 'text-white bg-sky-700 shadow-md'
                : 'text-sky-700 hover:bg-gray-50'
              }`}
            >
              🌍 Global
            </button>
            <div className="w-1 sm:w-2"></div>
            <button
              onClick={() => handleToggle(true)}
              className={`relative px-4 py-1 sm:px-6 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 z-10 ${showLocal
                ? 'text-white bg-green-600 shadow-md'
                : 'text-green-600 hover:bg-gray-50'
              }`}
            >
              🏡 Local
            </button>

            {/* Background highlight */}
            <div
              className={`absolute top-1 bottom-1 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${showLocal ? 'left-[calc(50%+4px)] right-1' : 'left-1 right-[calc(50%+4px)]'
                }`}
              style={{
                width: 'calc(50% - 12px)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto mt-6 px-2 sm:px-4">
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
          {loadingCategory ? (
            new Array(12).fill(null).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 animate-pulse rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 shadow-md"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-200 rounded-full" />
                <div className="w-3/4 h-3 sm:h-4 bg-blue-200 rounded" />
              </div>
            ))
          ) : (
            filteredCategories?.map(cat => (
              <div
                key={cat._id}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className="cursor-pointer transform transition duration-300 hover:scale-105 bg-white border rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-sm hover:shadow-lg hover:border-sky-950"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2 rounded-lg"
                />
                <p className="text-center text-xs sm:text-sm font-semibold text-gray-700 truncate w-full">
                  {cat.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Category-wise product display */}
      <div className="container mx-auto px-2 sm:px-4 space-y-10 mt-10 mb-16">
        {filteredCategories?.map((c) => (
          <CategoryWiseProductDisplay
            key={c._id + '-CategoryProduct'}
            id={c._id}
            name={c.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Home;

