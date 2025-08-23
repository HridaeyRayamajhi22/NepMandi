// import React, { useEffect, useState } from 'react';
// import UploadCategoryModel from '../components/UploadCategoryModel';
// import Loading from '../components/Loading';
// import NoData from '../components/NoData';
// import Axios from '../utils/axios';
// import SummaryApi from '../common/SummaryApi';
// import EditCategory from '../components/EditCategory';
// import ConfirmBox from '../components/ConfirmBox';
// import toast from 'react-hot-toast';
// import { useSelector } from 'react-redux';
// import { all } from 'axios';

// const CategoryPage = () => {
//   const [openUploadCategory, setOpenUploadCategory] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [categoryData, setCategoryData] = useState([]);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editData, setEditData] = useState({
//     name: "",
//     image: ""
//   });

//   const [confirmBoxDelete, setConfirmBoxDelete] = useState(false);
//   const [deleteCategoryId, setDeleteCategoryId] = useState({
//     id: "",
//     name: ""
//   });

//   const categoryIds = categoryData.map(cat => cat._id);
//   const categoryNames = categoryData.map(cat => cat.name);


//   const allCategory = useSelector((state) => state.product.allCategory);
//   const fetchCategory = async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({
//         ...SummaryApi.getCategories,
//       });
//       const { data: responseData } = response;

//       if (responseData.success) {
//         setCategoryData(responseData.data);
//         return;
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategory();
//   }, []);

//   useEffect(() => {
//     setCategoryData(allCategory);
//   }, [allCategory])

//   const handleDeleteCategory = async () => {
//     try {
//       console.log("Deleting category ID:", deleteCategoryId.id);

//       const response = await Axios.delete(SummaryApi.deleteCategory.url, {
//         data: { _id: deleteCategoryId.id }
//       });


//       if (response.data.success) {
//         toast.success(response.data.message);
//         setConfirmBoxDelete(false);
//         fetchCategory(); // Refresh list after delete
//       } else {
//         toast.error("Failed to delete category");
//         setConfirmBoxDelete(false);
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Something went wrong while deleting!";
//       toast.error(message);
//       console.error("Error deleting category:", message);
//     }
//   }


//   return (
//     <section>
//       <div className='py-3 pr-7 bg-slate-100 shadow-md flex items-center justify-between'>
//         <h2 className='font-semibold pl-3'>Category</h2>
//         <button
//           onClick={() => setOpenUploadCategory(true)}
//           className='font-normal text-lg border border-green-500 hover:bg-blue-900 hover:text-yellow-200 hover:font-bold px-3 py-1 rounded-md'>
//           + Add Category
//         </button>
//       </div>

//       {
//         !categoryData[0] && !loading && (
//           <NoData />
//         )
//       }

//       <div className="p-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
//         {categoryData.map((category) => (
//           <div
//             key={category._id}
//             className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col border border-gray-300 hover:shadow-lg transition-all duration-300
//                  w-56 min-h-[130px] mx-auto"
//           >
//             {/* Image */}
//             <div className="h-64 overflow-hidden flex items-center justify-center">
//               <img
//                 src={category.image}
//                 alt={category.name}
//                 className="object-cover w-full h-full"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-between items-center p-2">
//               <button
//                 onClick={() => {
//                   setOpenEdit(true)
//                   setEditData(category)
//                 }}
//                 className="text-xs border border-green-500 hover:bg-blue-800 hover:text-yellow-300 px-3 py-1 rounded-md">Edit</button>
//               <button
//                 onClick={() => {
//                   setConfirmBoxDelete(true)
//                   setDeleteCategoryId({
//                     id: category._id,
//                     name: category.name
//                   })
//                 }}
//                 className="text-xs border border-red-500 hover:bg-red-600 hover:text-white px-3 py-1 rounded-md">Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>


//       {loading && <Loading />}

//       {openUploadCategory && (
//         <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
//       )}

//       {
//         openEdit && (
//           <EditCategory data={editData} close={() => setOpenEdit(false)}
//             fetchData={fetchCategory} />
//         )
//       }

//       {
//         confirmBoxDelete && (
//           <ConfirmBox close={() => setConfirmBoxDelete(false)} cancel={() => setConfirmBoxDelete(false)} confirm={handleDeleteCategory} />
//         )
//       }
//     </section>
//   );
// }

// export default CategoryPage;








import React, { useEffect, useState, useRef } from 'react';
import UploadCategoryModel from '../components/UploadCategoryModel';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import EditCategory from '../components/EditCategory';
import ConfirmBox from '../components/ConfirmBox';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ name: "", image: "" });
  const [confirmBoxDelete, setConfirmBoxDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState({ id: "", name: "" });

  const allCategory = useSelector((state) => state.product.allCategory);

  // Extract IDs and Names
  const categoryIds = categoryData.map(cat => cat._id);
  const categoryNames = categoryData.map(cat => cat.name);

  // Fetch categories from API
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getCategories });
      const { data: responseData } = response;

      if (responseData.success) {
        setCategoryData(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (allCategory && allCategory.length > 0) setCategoryData(allCategory);
  }, [allCategory]);

  // Delete category
  const handleDeleteCategory = async () => {
    try {
      const response = await Axios.delete(SummaryApi.deleteCategory.url, {
        data: { _id: deleteCategoryId.id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setConfirmBoxDelete(false);
        fetchCategory();
      } else {
        toast.error("Failed to delete category");
        setConfirmBoxDelete(false);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong while deleting!";
      toast.error(message);
      console.error("Error deleting category:", message);
    }
  };

  return (
    <section>
      {/* Header */}
      <div className='py-3 pr-7 bg-slate-100 shadow-md flex items-center justify-between'>
        <h2 className='font-semibold pl-3'>Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className='font-normal text-lg border border-green-500 hover:bg-blue-900 hover:text-yellow-200 hover:font-bold px-3 py-1 rounded-md'>
          + Add Category
        </button>
      </div>

      {/* No Data */}
      {!categoryData[0] && !loading && <NoData />}

      {/* Category Grid */}
      <div className="p-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
        {categoryData.map((category) => (
          <div
            key={category._id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col border border-gray-300 hover:shadow-lg transition-all duration-300 w-56 min-h-[130px] mx-auto"
          >
            {/* Image */}
            <div className="h-64 overflow-hidden flex items-center justify-center">
              <img src={category.image} alt={category.name} className="object-cover w-full h-full" />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center p-2">
              <button
                onClick={() => {
                  setOpenEdit(true);
                  setEditData(category);
                }}
                className="text-xs border border-green-500 hover:bg-blue-800 hover:text-yellow-300 px-3 py-1 rounded-md">Edit</button>
              <button
                onClick={() => {
                  setConfirmBoxDelete(true);
                  setDeleteCategoryId({ id: category._id, name: category.name });
                }}
                className="text-xs border border-red-500 hover:bg-red-600 hover:text-white px-3 py-1 rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && <Loading />}

      {/* Upload / Edit Modals */}
      {openUploadCategory && <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />}
      {openEdit && <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />}
      {confirmBoxDelete && <ConfirmBox close={() => setConfirmBoxDelete(false)} cancel={() => setConfirmBoxDelete(false)} confirm={handleDeleteCategory} />}

      {/* Product Display per Category */}
      {categoryIds.length > 0 && (
        <CategoryWiseProductDisplay 
          categoryIds={categoryIds} 
          categoryNames={categoryNames} 
        />
      )}
    </section>
  );
};

export default CategoryPage;
