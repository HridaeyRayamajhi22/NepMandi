import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice'
import { useDispatch } from 'react-redux';
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import Axios from './utils/axios';
import SummaryApi from './common/SummaryApi';
import { handleAddItemCart } from './store/cartProduct'
import GlobalProvider from './provider/GlobalProvider';
import { FaCartShopping } from "react-icons/fa6";
import CartMobileLink from './pages/CartMobile';


function App() {

  const dispatch = useDispatch()
  const location = useLocation()

  const [user, setUser] = useState(null);
  const fetchUser = async () => {
  const token = localStorage.getItem('AccessToken');
  if (!token) {
    console.log('No token, skipping user fetch');
    dispatch(setUserDetails(null)); // clear user info in Redux
    return;
  }
  try {
    const userData = await fetchUserDetails();
    if (userData?.data?.data) {
      dispatch(setUserDetails(userData.data.data));
      setUser(userData);
    } else {
      console.error("Failed to fetch user details");
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    dispatch(setUserDetails(null)); // clear on failure
  }
};

    const fetchCategory = async () => {
      try {
  
        const response = await Axios({
          ...SummaryApi.getCategories,
        });
        const { data: responseData } = response;
  
        if (responseData.success) {
          dispatch(setAllCategory(responseData.data))
          // setCategoryData(responseData.data);
          return;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
       
      }
    };

    const fetchSubCategory = async () => {
      try {
  
        const response = await Axios({
          ...SummaryApi.getSubCategory,
        });
        const { data: responseData } = response;
  
        if (responseData.success) {
          dispatch(setAllSubCategory(responseData.data))
          // setCategoryData(responseData.data);
          return;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
       
      }
    };
  
    useEffect(() => { 
      fetchUser();
      fetchCategory();
      fetchSubCategory()
    }, []);




  return (
    <GlobalProvider> 
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* This makes the main content grow and push footer down if content is short */}
      <main className="flex-1 bg-white p-4">
        <Outlet />
      </main>

      <Footer />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      {
        location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
    </div>
    </GlobalProvider>
  )
}

export default App
