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
      <div className="w-full mx-auto sm:w-[90%] lg:w-[85%] px-4 sm:px-8 md:px-10 pt-4">
        <picture>
          <source media="(max-width: 600px)" srcSet={Designer1} />
          <img
            src={Designer1}
            alt="Promotional Banner"
            className="w-full object-cover rounded-2xl shadow-md h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] xl:h-[220px]"
          />
        </picture>
      </div>

      {/* Categories Header with Animated Toggle */}
      <div className="container mx-auto mt-10 px-4 text-center">
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 whitespace-nowrap">
            🌿 Browse by Categories
          </h2>

          {/* Enhanced Vibrant Toggle - Wider buttons */}
          {/* Enhanced Vibrant Toggle with perfect alignment */}
          <div className={`relative inline-flex items-center h-10 rounded-full shadow-lg bg-gray-100 border border-gray-200 p-1 transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
            <button
              onClick={() => handleToggle(false)}
              className={`relative px-6 py-1.5 rounded-full text-sm font-bold transition-all duration-300 z-10 mx-0.5 ${!showLocal
                  ? 'text-white bg-sky-700 shadow-md'
                  : 'text-sky-700 hover:bg-gray-50'
                }`}
            >
              🌍 Global
            </button>
            <div className="w-2"></div> {/* Spacer between buttons */}
            <button
              onClick={() => handleToggle(true)}
              className={`relative px-6 py-1.5 rounded-full text-sm font-bold transition-all duration-300 z-10 mx-0.5 ${showLocal
                  ? 'text-white bg-green-600 shadow-md'
                  : 'text-green-600 hover:bg-gray-50'
                }`}
            >
              🏡 Local
            </button>
            {/* Animated background highlight - now properly spaced */}
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

      {/* Rest of your component remains exactly the same */}
      <div className="container mx-auto mt-6 px-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {loadingCategory ? (
            new Array(12).fill(null).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 animate-pulse rounded-xl p-4 flex flex-col items-center gap-2 shadow-md"
              >
                <div className="w-20 h-20 bg-blue-200 rounded-full" />
                <div className="w-3/4 h-4 bg-blue-200 rounded" />
              </div>
            ))
          ) : (
            filteredCategories?.map(cat => (
              <div
                key={cat._id}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className="cursor-pointer transform transition duration-300 hover:scale-105 bg-white border rounded-2xl p-4 flex flex-col items-center shadow-sm hover:shadow-lg hover:border-sky-950"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-20 h-20 object-contain mb-2 rounded-lg"
                />
                <p className="text-center text-sm font-semibold text-gray-700">
                  {cat.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-10 mt-10 mb-16">
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