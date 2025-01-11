const Order = require("../../models/orderSchema");
const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");

const get_orders = async (req, res) => {
  const { page = 1, limit = 10, searchQuery  } = req.query;
  try {
    const skip = (page - 1) * limit;

    console.log(req.query);
    let query = Order.find();

    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), 'i');
      
      query = query.or([
        { orderId: searchRegex },       
        { orderStatus: searchRegex },
      
      ]);
    }
  
    
    const orders = await query
      .skip(skip)
      .limit(Number(limit))
      .populate("user")
      .sort({placedAt: -1})
   
    const totalOrders = await Order.countDocuments(query.getQuery());

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

const order_details = async (req, res) => {
 
  const { id } = req.params;
 

  try {
    const order = await Order.findOne({orderId: id});
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    console.log(order)
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const order_status = async function (req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

 
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot update status - order is already cancelled" 
      });
    }


    if (order.orderStatus === "Delivered" && status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of delivered orders"
      });
    }

 
    order.orderItems = order.orderItems.map(item => {
      if (item.orderStatus !== "Cancelled") {
        return { ...item, orderStatus: status };
      }
      return item;
    });

    
    order.orderStatus = status;

    if (order && order.orderStatus) {
      if (order.orderStatus === "Cancelled") {
        order.paymentStatus = "Cancelled";
      } else if (order.orderStatus === "Delivered") {
        order.paymentStatus = "Completed";
      }
    }
    await order.save();

    res.status(200).json({ 
      success: true, 
      message: `Order status updated to ${status} successfully`,
      order: order
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to update order status" 
    });
  }
}

module.exports = {
  get_orders,
  order_details,
  order_status,
};
