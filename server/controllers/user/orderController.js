const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const Cart = require("../../models/cartSchema");
const Order = require("../../models/orderSchema");
const mongoose = require("mongoose");
const { jwtDecode } = require("jwt-decode");
const Cookies = require("js-cookie");



const order_history = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const decode = jwtDecode(token);
    const userId = decode._id;
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count of orders for pagination
    const total = await Order.countDocuments({ user: userId });
    
    // Fetch paginated orders for the user
    const orders = await Order.find({ user: userId })
      .sort({ placedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Order History fetched successfully",
      orders,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const get_order = async (req, res) => {
  
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, message: "Order fetched successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message:"Internal Server Error" });
  }
}



const cancel_order = async (req, res) => {
  const orderId = req.params.orderId;
  
  try {
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }
      if(order.orderStatus === "Delivered"){
        return res.status(400).json({ success: false, message: "Order is already delivered" });
      }

      // Use Promise.all to handle async operations in parallel
      await Promise.all(order.orderItems.map(async (item) => {
          item.orderStatus = "Cancelled";
          const product = await Product.findById(item.product);
          if (product) {
              product.quantity += item.quantity;
              await product.save();
          }
      }));

      order.orderStatus = "Cancelled";
      order.paymentStatus = "Cancelled";
      await order.save();

      return res.status(200).json({
          success: true,
          message: "Order cancelled successfully",
      });

  } catch (error) {
      console.error("Error in cancel_order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const cancel_product = async (req, res) => {
  const { productId, orderId, quantity } = req.body;
  console.log(productId, orderId, quantity, " product cancelled");

  try {
      // Find the order
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Find the specific order item
      const orderItem = order.orderItems.find(item => item._id.toString() === productId);
      if (!orderItem) {
          return res.status(404).json({ success: false, message: "Order item not found" });
      }

      // Find the product using the product reference from orderItem
      const product = await Product.findById(orderItem.product);
      if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
      }

      console.log("Original product quantity", product.quantity);
      
      // Update product quantity
      product.quantity += quantity;
      await product.save();

      let amountReduced = 0;
      // Update order status
      let flag = true;
      order.orderItems.forEach(item => {
          if (item._id.toString() === productId) {
              item.orderStatus = "Cancelled";
              amountReduced += item.totalPrice
          }
          if (item.orderStatus !== "Cancelled") {
              flag = false;
          }
      });

      if (flag) {
          order.orderStatus = "Cancelled";
          order.paymentStatus = "Cancelled";
      }
      order.totalAmount-=amountReduced;

      await order.save();
      res.status(200).json({ success: true, message: "Product cancelled successfully" });

  } catch (error) {
      console.error("Error in cancel_product:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = {
  order_history,
  get_order,
  cancel_order,
  cancel_product
};
