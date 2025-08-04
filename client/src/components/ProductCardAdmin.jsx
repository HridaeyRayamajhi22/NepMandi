import React, { useState } from 'react';
import EditProductAdmin from '../components/EditProductAdmin';
import ConfirmBox from '../components/ConfirmBox';
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/axios';
import AxiosToastError from '../utils/axiostoasterror';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        setOpenDelete(false);
        fetchProductData?.();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (

    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 hover:shadow-lg transition-all duration-300 w-56 h-[280px]">
  {/* Product Image */}
  <img 
  
    src={data?.image[0]} 
    alt={data?.name} 
    className="h-full w-full object-cover max-h-40 p-1"
  />

  {/* Product Info */}
  <div className="p-1 flex flex-col justify-between flex-1">
    <div className="m-2  text-center">
      <h3 className="font-bold text-base text-gray-800 truncate">{data?.name}</h3>
      <p className="text-xs text-gray-500 line-clamp-2">{data?.unit || 'No unit info'}</p>
    </div>

    <div className=" text-center text-base font-medium">
      <span className="text-yellow-200 bg-lime-950 rounded-md py-1 px-2 ">Rs. {data?.price} </span>

         <div className="flex justify-center gap-24 mt-1.5">
        <button
          onClick={() => setEditOpen(true)}
          className="text-sm border border-green-500 text-black px-3 py-0.5 rounded hover:bg-blue-900 hover:text-yellow-300"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="text-sm border border-red-500 text-black px-2 py-0.5 rounded hover:bg-red-500 hover:text-white"
        >
          Delete
        </button>
      </div> 
    
    </div>
  </div>

  {/* Edit Modal */}
  {editOpen && (
    <EditProductAdmin
      data={data}
      fetchProductData={fetchProductData}
      close={() => setEditOpen(false)}
    />
  )}

  {/* Delete Confirm Modal */}
  {openDelete && (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-md p-3 w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Confirm Delete</h3>
          <button onClick={() => setOpenDelete(false)}>
            <IoClose size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-700">Are you sure you want to permanently delete this product?</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => setOpenDelete(false)}
            className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  )}
</div>

  );
};

export default ProductCardAdmin;
