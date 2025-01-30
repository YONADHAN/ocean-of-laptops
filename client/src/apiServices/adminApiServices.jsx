import axios from 'axios';


import {axiosInstance} from '../api/axiosConfig'

// Admin Authentication Services
const authService = {
  adminSignIn: (data) => axiosInstance.post('/admin/admin_signin', data),
  requestPasswordReset: (data) => axiosInstance.post('/request-password-reset', data)
};



// Customer Management Services
const customerService = {
  getCustomers: () => axiosInstance.get('/get_customers'),
  unblockCustomer: (id) => axiosInstance.patch(`/admin/customer_unblock/${id}`),
  blockCustomer: (id) => axiosInstance.patch(`/admin/customer_block/${id}`),
};

// Category Management Services
const categoryService = {
  addCategory: (productSubmissionData) => axiosInstance.post('/admin/add_category', productSubmissionData),
  getCategories: (params) => axiosInstance.get('/admin/get_category', { params }),
  getCategoryById: (id) => axiosInstance.get(`/admin/get_category/${id}`),
  updateCategory: (id, data) => axiosInstance.patch(`/admin/update_category/${id}`, data),
  blockCategory: (id) => axiosInstance.patch(`/category_block/${id}`),
  unblockCategory: (id) => axiosInstance.patch(`/category_unblock/${id}`),
  getCategoryList: () => axiosInstance.get('/admin/get_category_list'),
};

// Product Management Services
const productService = {
  addProduct: (data) => axiosInstance.post("/admin/add_product", { productSubmissionData: data }),
  getProducts: ({ page = 1, limit = 5, search = '' } = {}) =>
    axiosInstance.get(`/admin/get_products`, {
      params: { page, limit, search },
    }),
  toggleBlockProduct: (id) => axiosInstance.put(`/admin/toggle_block/${id}`),
  updateProduct: (productId, productSubmissionData) => axiosInstance.put(`/admin/update_product/${productId}`, productSubmissionData),
  getProductById: (productId) => axiosInstance.get(`/admin/get_product/${productId}`),
  updateProductOffer: (productId, offer) => axiosInstance.post('/admin/update_product_offer', {productId, offer})
};

// Order Management Services
const orderService = {
  getOrders: ({ page = 1, limit = 10, searchQuery = '' } = {}) => 
    axiosInstance.get('/admin/get_orders', {
      params: { page, limit, searchQuery },
    }),
  getOrderDetails: (orderId) => axiosInstance.get(`/admin/order_details/${orderId}`),
  updateOrderStatus: (orderId, status) => axiosInstance.post(`/admin/order_status/${orderId}`, {status}),
};

export { authService, customerService, categoryService, productService, orderService };
