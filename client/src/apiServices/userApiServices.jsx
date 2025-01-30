import{ axiosInstance} from '../api/axiosConfig';

// Auth Service
const authService = {
  signup: (data) => axiosInstance.post('/user_signup', data),
  verifyOtp: (data) => axiosInstance.post('/verify_otp', data),
  resendOtp: (data) => axiosInstance.post('/resent_otp', data),
  signin: (data) => axiosInstance.post('/user_signin', data),
  forgetPasswordEmail: (data) => axiosInstance.post('/forget_password_email_entering', data),
  verifyForgetOtp: (data) => axiosInstance.post('/forget_password_otp_verification', data),
  resetPassword: (data) => axiosInstance.post('/reset_password', data),
  getUserDetails: (userId) => axiosInstance.post('/user_details', {userId}),
  updatePersonal: (updateData) => axiosInstance.post('/update_personal', updateData),

  
  addAddress: (newAddress, userId) => axiosInstance.post('/address_add', { newAddress, userId }),
  getAddresses: (userId) => axiosInstance.get(`/addresses_get`, { params:  {userId } }),
  setDefaultAddress: (id) => axiosInstance.put(`/addresses/${id}/default`),
  editAddress: (id, updatedAddress) => axiosInstance.put(`/addresses_edit/${id}`,{updatedAddress, id}),
  removeAddress: (id) => axiosInstance.delete(`/addresses_remove/${id}`),
  requestPasswordReset: (data) => axiosInstance.post('/request-password-reset', data),
  verifyEmailToken: (data) => axiosInstance.post('/verify-email', data),
  passwordChange: (data) => axiosInstance.post('/password-change', data),
  fetchAddresses: (id) => axiosInstance.post(`/addresses${id}`),

};

// Product Service
const productService = {
  getProductDetails: (id) => axiosInstance.get(`/get_product_details/${id}`),
  getCategoryIdFromName: () => axiosInstance.get('/get_category_id_from_name'),
  getProductsByCategory: (id, page = 1, limit = 4) => 
    axiosInstance.get(`/get_products_by_category`, {
      params: { id, page, limit },
    }),
  getProducts: () => axiosInstance.get('/get_products'),
  getCategoryList: () => axiosInstance.get('/get_category_list'),
  getAllProductsPaginated: () => axiosInstance.get('/get_all_products_paginated'),
  getFilterOptions: () => axiosInstance.get('/get_filter_options'),
  filterProducts: (params) => axiosInstance.get('/filter_products',{params}),
  getQuantity: (data) => axiosInstance.post('/get_quantity', data),
};

// Cart Service
const cartService = {
  getCart: (data) => axiosInstance.post('/get_cart', data),
  getCartItems: (userId) => axiosInstance.post('/get_cart_items', {userId}),
  addToCart: (productId,quantity) => axiosInstance.post('/add_to_cart',{
    productId,
    quantity,
  }),
  removeFromCart: (userId, productId) => axiosInstance.post('/remove_from_cart', {userId, productId}),
  checkout: (data) => axiosInstance.post('/checkout', data),
  clearCart: () => axiosInstance.get('/clear_cart'),
  getCartData: (userId) => axiosInstance.post('/cart_data',{userId}),
  refreshCart: (userId) => axiosInstance.post('/refresh_cart', {userId})
};

// Order Service
const orderService = {
  getOrderHistory: (page,itemsPerPage) => axiosInstance.get( `/order_history?page=${page}&limit=${itemsPerPage}`),
  getOrder: (orderId) => axiosInstance.get(`/get_order/${orderId}`),
  cancelOrder: (orderId) => axiosInstance.get(`/cancel_order/${orderId}`),
  cancelProduct: (orderId,productId,quantity) => axiosInstance.post('/cancel_product', {orderId,productId,quantity}),
};

// CheckOutPage
const checkoutService = {
  checkout: (orderData) => axiosInstance.post('/checkout', orderData)
}

//wishlist
const wishlistService = {
  addToWishlist: (userId, productId) => axiosInstance.post('/add_to_wishlist', {userId, productId}),
  removeFromWishlist: (userId, productId) => axiosInstance.post('/remove_from_wishlist', {userId, productId}),
  getWishlistStatus: (userId, productId) => axiosInstance.post('/check_if_in_wishlist', {userId, productId}),
  getWishlists: (data) => axiosInstance.post('/get_wishlists', data)
}

export { authService, productService, cartService, orderService ,checkoutService ,wishlistService};
