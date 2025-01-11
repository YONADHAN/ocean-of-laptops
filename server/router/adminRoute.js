const express = require("express");
const router = express.Router();
const authController = require("../controllers/admin/authController");
const customerController = require("../controllers/admin/customerController");
const CategoryController = require("../controllers/admin/categoryController");
const ProductController = require("../controllers/admin/productController");
const OrderController = require("../controllers/admin/orderController");
const {verifyAdmin} = require('../middlewares/auth')

//authController
router.post("/admin_signin", authController.admin_signin);
router.post("/request-password-reset-from-signin",authController.requestPasswordResetFromSignin);

//customerController
router.get("/get_customers", verifyAdmin, customerController.get_customers);
router.patch("/customer_unblock/:id", verifyAdmin, customerController.customer_unblock);
router.patch("/customer_block/:id", verifyAdmin, customerController.customer_block);

//CategoryController
router.post("/add_category", verifyAdmin, CategoryController.addCategory);
router.get("/get_category", verifyAdmin, CategoryController.getCategory); 
router.get("/get_category/:id", verifyAdmin, CategoryController.getOneCategory);
router.patch("/update_category/:id", verifyAdmin, CategoryController.update_category);
router.patch("/category_block/:id", verifyAdmin, CategoryController.category_block);
router.patch("/category_unblock/:id",verifyAdmin, CategoryController.category_unblock);
router.get("/get_category_list", verifyAdmin, CategoryController.get_category_list);

//ProductController
router.post("/add_product",verifyAdmin, ProductController.add_product);
router.get("/get_products",verifyAdmin, ProductController.getProducts);
router.put("/toggle_block/:id", verifyAdmin, ProductController.toggleBlockProduct);
router.put("/update_product/:id", verifyAdmin, ProductController.updateProduct);
router.get("/get_product/:id", verifyAdmin, ProductController.get_product);

//OrderController
router.get("/get_orders", verifyAdmin, OrderController.get_orders);
router.get("/order_details/:id",verifyAdmin, OrderController.order_details);
router.post("/order_status/:orderId",verifyAdmin, OrderController.order_status)
module.exports = router;
