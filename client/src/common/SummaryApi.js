export const baseURL = "https://nepmandi.onrender.com";

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "POST",
  },
  login: {
    url: "/api/user/login",
    method: "POST",
  },
  forgotPassword: {
    url: "/api/user/forgot-password",
    method: "PUT",
  },
  verifyForgotPasswordOtp: {
    url: "/api/user/verify-forgot-password-otp",
    method: "PUT",
  },
  resetPassword: {
    url: "/api/user/reset-password",
    method: "PUT",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "POST",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "GET",
  },
  logout: {
    url: "/api/user/logout",
    method: "GET",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "PUT",
  },
  updateUser: {
    url: "/api/user/update-user",
    method: "PUT",
  },
  addCategory: {
    url: "/api/category/add-category",
    method: "POST",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "POST",
  },
  getCategories: {
    url: "/api/category/get",
    method: "GET",
  },
  updateCategory: {
    url: "/api/category/update",
    method: "PUT",
  },
  deleteCategory: {
    url: "/api/category/delete",
    method: "DELETE",
  },
  createSubCategory: {
    url: "/api/subcategory/create",
    method: "POST",
  },
  getSubCategory: {
    url: "/api/subcategory/get",
    method: "POST",
  },
  updateSubCategory: {
    url: "/api/subcategory/update",
    method: "PUT",
  },
  deleteSubCategory: {
    url: "/api/subcategory/delete",
    method: "DELETE",
  },
  createProduct: {
    url: "/api/product/create",
    method: "post",
  },
  getProduct: {
    url: "/api/product/get",
    method: "POST",
  },
  getProductByCategory: {
    url: "/api/product/get-product-by-category",
    method: "post",
  },
  getProductByCategoryAndSubCategory: {
    url: "/api/product/get-product-by-category-and-subcategory",
    method: "post",
  },
  getProductDetails: {
    url: "/api/product/get-product-details",
    method: "post",
  },
  updateProductDetails: {
    url: "/api/product/update-product-details",
    method: "put",
  },
  deleteProduct: {
    url: "/api/product/delete-product",
    method: "delete",
  },
  searchProduct: {
    url: "/api/product/search-product",
    method: "post",
  },
  addTocart: {
    url: "/api/cart/create",
    method: "post",
  },
  getCartItem: {
    url: "/api/cart/get",
    method: "get",
  },
  updateCartItemQty: {
    url: "/api/cart/update-qty",
    method: "put",
  },
  deleteCartItem: {
    url: "/api/cart/delete-cart-item",
    method: "delete",
  },
  createAddress: {
    url: "/api/address/create",
    method: "post",
  },
  getAddress: {
    url: "/api/address/get",
    method: "get",
  },
  updateAddress: {
    url: "/api/address/update",
    method: "put",
  },
  disableAddress: {
    url: "/api/address/disable",
    method: "delete",
  },
  CashOnDeliveryOrder: {
    url: "/api/order/cash-on-delivery",
    method: "post",
  },
  payment_url: {
    url: "/api/order/checkout",
    method: "post",
  },
  getOrderItems: {
    url: "/api/order/order-list",
    method: "get",
  },
  getProductsByCategories: {
    url: "/api/product/get-products-by-categories",
    method: "post",
  },
};

export default SummaryApi;
