const express = require('express');
const router = express.Router();
const authController = require('../controllers/user/authController')
const ProductController = require('../controllers/user/productController')
const CartController = require('../controllers/user/cartController')
const OrderController = require('../controllers/user/orderController')
const categoryController = require('../controllers/user/categoryController')
const PasswordController  = require('../controllers/user/PasswordController');
const WishlistController = require('../controllers/user/wishlistController');
const {verifyUser} = require("../middlewares/auth")

// const sampleController = require('../controllers/user/sampleController')

//authentication routes
router.post('/user_signup', authController.userSignup);
router.post('/verify_otp', authController.verify_otp);
router.post('/resent_otp',authController.resend_otp);
router.post('/user_signin',authController.user_signin);
router.post('/forget_password_email_entering',authController.forget_password_email_entering);
router.post('/forget_password_otp_verification',authController.forget_password_otp_verification);
router.post('/reset_password',authController.reset_password);
router.post('/user_details',authController.user_details);
router.post('/request-password-reset-from-signin',PasswordController.requestPasswordResetFromSignin)
router.post('/reset-password-from-signin',PasswordController.resetPasswordFromSignin)


//ProductController
router.get('/get_product_details/:id',verifyUser, ProductController.get_product_details);
router.get('/get_category_id_from_name',verifyUser, categoryController.get_category_id_from_name)
router.get('/get_products_by_category', verifyUser, ProductController.get_products_by_category)
router.get('/get_products', verifyUser,ProductController.get_products)
router.get('/get_category_list',verifyUser, categoryController.get_category_list)
router.get("/get_all_products_paginated",verifyUser, ProductController.get_all_products_paginated);
router.get("/get_filter_options",verifyUser,ProductController.get_filter_options);
router.get('/filter_products',verifyUser, ProductController.filter_products);
router.post('/get_quantity' ,verifyUser, ProductController.get_quantity)

//address
router.post("/address_add",verifyUser, authController.address_add);
router.get("/addresses_get",verifyUser, authController.addresses_get);
router.put("/addresses_edit/:id",verifyUser, authController.addresses_edit);
router.delete("/addresses_remove/:id",verifyUser, authController.addresses_remove);
router.put("/addresses/:id/default", verifyUser, authController.setDefaultAddress); 

//account/personalInformation
router.post('/update_personal',authController.update_personal)

//forgot password routes
router.post('/request-password-reset', PasswordController.requestPasswordReset);
router.post('/verify-email', PasswordController.verifyEmailToken);
router.post('/reset-password', PasswordController.resetPassword);
router.post('/password-change', PasswordController.passwordChange);


//cart
//  router.post("/apply_coupon", CartController.apply_coupon);
//  router.post("/remove_coupon", CartController.remove_coupon);
router.post("/cart_data",verifyUser, CartController.cart_data);
router.post("/get_cart",verifyUser, CartController.get_cart);
router.post("/get_cart_items",verifyUser, CartController.get_cart_items);
router.post("/add_to_cart", verifyUser, CartController.add_to_cart);
router.post("/remove_from_cart", verifyUser, CartController.remove_from_cart);
router.post('/checkout',verifyUser, CartController.processCheckout);
router.get('/clear_cart',verifyUser, CartController.clear_cart);
router.post('/refresh_cart',verifyUser, CartController.refresh_cart);
//orders
router.get("/order_history",verifyUser, OrderController.order_history);
router.get("/get_order/:orderId",verifyUser, OrderController.get_order);
router.get("/cancel_order/:orderId",verifyUser, OrderController.cancel_order);
router.post("/cancel_product",verifyUser, OrderController.cancel_product);


//wishlist
router.post('/add_to_wishlist',verifyUser, WishlistController.add_to_wishlist)


module.exports = router;