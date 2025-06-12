import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import App from "../App.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import OTPVerification from "../pages/OTPVerification.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import UserMenuMobile from "../pages/UserMenuMobile.jsx";
import Profile from "../pages/Profile.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import MyOrder from "../pages/MyOrder.jsx";
import Address from "../pages/Address.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import SubCategoryPage from "../pages/SubCategoryPage.jsx";
import UploadProduct from "../pages/UploadProduct.jsx";
import ProductAdmin from "../pages/ProductAdmin.jsx";
import AdminPermission from "../layouts/AdminPermission.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import ProductDisplayPage from "../pages/ProductDisplayPage.jsx";
import CartMobile from "../pages/CartMobile.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import Success from "../pages/Success.jsx";
import Cancel from "../pages/Cancel.jsx";
import OrderDetails from "../pages/OrderDetails.jsx";
import PaymentForm from "../components/PaymentForm.jsx"; // Added PaymentForm
import AdminOrders from "../pages/AdminOrders.jsx";
import AdminAnalytics from "../pages/AdminAnalytics.jsx"; // Importing AdminAnalytics
import OrderTrackingPage from "../pages/OrderTrackingPages.jsx"; // Importing OrderTrackingPage
import Wishlist from "../components/Wishlist.jsx"; // Importing Wishlist

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            { path: "payment", element: <PaymentForm /> },          // Payment form route
            { path: "payment-success", element: <Success /> },     // Payment success route
            { path: "payment-failure", element: <Cancel /> },      // Payment failure/cancel route
            {
                path: "search",
                element: <SearchPage />,

            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "verify-otp",
                element: <OTPVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrder />
                    },
                    {
                        path: "order/:id",
                        element: <OrderDetails />
                    },
                    {
                        path: "order-tracking",
                        element: <OrderTrackingPage />  // Make sure it's imported
                    },
                    {
                        path: "admin/orders",
                        element: <AdminPermission><AdminOrders /></AdminPermission>
                    },
                    {
                        path: "admin/analytics",
                        element: <AdminPermission><AdminAnalytics /></AdminPermission>
                    },
                    {
                        path: "wishlist",
                        element: <Wishlist />
                    },
                    {
                        path: "myaddress",
                        element: <Address />
                    },
                    {
                        path: 'category',
                        element: <AdminPermission> <CategoryPage /> </AdminPermission>
                    },
                    {
                        path: 'subcategory',
                        element: <AdminPermission> <SubCategoryPage /> </AdminPermission>
                    },
                    {
                        path: 'upload-product',
                        element: <AdminPermission> <UploadProduct /> </AdminPermission>
                    },
                    {
                        path: 'product',
                        element: <AdminPermission> <ProductAdmin /> </AdminPermission>
                    },

                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductListPage />
                    }
                ]
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />
            },
            {
                path: 'cart',
                element: <CartMobile />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: 'cancel',
                element: <Cancel />
            },
            {
                path: "myorders",
                element: <MyOrder />,
            },
            {
                path: "order-tracking",
                element: <OrderTrackingPage />  // Make sure it's imported
            }
        ]
    }
])
export default router;