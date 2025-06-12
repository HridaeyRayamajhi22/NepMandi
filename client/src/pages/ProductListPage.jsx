import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/axiostoasterror";
import { valideURLConvert } from "../utils/valideURLConvert";
import CardProduct from "../components/CardProduct";
import Loading from "../components/Loading";
import { motion } from "framer-motion";
import { FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";

const LIMIT = 8;

const ProductListPage = () => {
  /* ─────────────────── Existing Logic (unchanged) ─────────────────── */
  const params = useParams();
  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];
  const subCategoryName = params.subCategory.split("-").slice(0, -1).join(" ");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allSubCategory = useSelector((s) => s.product.allSubCategory);
  const [displaySubCat, setDisplaySubCat] = useState([]);

  const fetchProducts = async (reset = false) => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: { categoryId, subCategoryId, page, limit: LIMIT },
      });

      if (res.data.success) {
        setProducts((prev) =>
          reset || page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
        setTotalPage(res.data.totalCount);
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    fetchProducts(true);
  }, [params]);

  useEffect(() => {
    const sub = allSubCategory.filter((sc) =>
      sc.category.some((c) => c._id === categoryId)
    );
    setDisplaySubCat(sub);
  }, [allSubCategory, categoryId]);

  /* ─────────────────── Modern UI Render ─────────────────── */
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-screen"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Header */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="font-medium">Filters</span>
            </div>
            {mobileFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          {/* ────────── Sidebar (Desktop) ────────── */}
          <aside className={`lg:block ${mobileFiltersOpen ? 'block' : 'hidden'} bg-white rounded-xl shadow-md p-4 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto`}>
            <h2 className="text-lg font-bold mb-4 text-gray-800">Categories</h2>
            <div className="space-y-2">
              {displaySubCat.map((s) => {
                const link = `/${valideURLConvert(s.category[0].name)}-${s.category[0]._id}/${valideURLConvert(s.name)}-${s._id}`;
                const active = subCategoryId === s._id;
                return (
                  <Link
                    to={link}
                    key={s._id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      active 
                        ? "bg-green-100 text-green-800 font-medium" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-10 h-10 object-contain rounded-full border border-gray-200"
                    />
                    <span className="text-sm md:text-base">{s.name}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* ────────── Main Content ────────── */}
          <main className="flex flex-col gap-6">
            {/* Heading */}
            <header className="bg-white rounded-xl shadow-sm p-4 lg:p-6 sticky top-20 z-10">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{subCategoryName}</h1>
                <span className="text-gray-500 text-sm">{products.length} of {totalPage} products</span>
              </div>
            </header>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {products.map((p, index) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CardProduct data={p} />
                </motion.div>
              ))}
            </div>

            {/* Loading & Pagination */}
            {loading && (
              <div className="flex justify-center my-8">
                <Loading />
              </div>
            )}

            {page < totalPage && !loading && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPage((prev) => prev + 1);
                  fetchProducts();
                }}
                className="mx-auto mt-6 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md font-medium transition-colors"
              >
                Load More Products
              </motion.button>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListPage;