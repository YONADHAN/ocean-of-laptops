const path = require("path");
const sharp = require("sharp");
const Product = require("../../models/productSchema"); // Assuming Product model is in this path
const Category = require("../../models/categorySchema"); // Assuming Category model is in this path


// const add_product = async (req, res) => {
//   try {
//       const  productData = req.body;
//       console.log('Received Product Data:', productData); // Log received data for debugging

//       // Validate required fields
//       const requiredFields = [
//           'productName', 'brand', 'modelNumber', 'category', 
//           'regularPrice', 'quantity', 'processor', 'ram', 'storage'
//       ];

//       for (let field of requiredFields) {
//           if (!productData[field]) {
//               return res.status(400).json({
//                   success: false, 
//                   message: `Missing required field: ${field}`
//               });
//           }
//       }

//       // Check if the product already exists
//       const productExists = await Product.findOne({
//           productName: productData.productName,
//           modelNumber: productData.modelNumber,
//       });

//       if (productExists) {
//           return res.status(400).json({
//               success: false, 
//               message: "Product already exists"
//           });
//       }

//       // Validate category
//       const category = await Category.findById(productData.category);
//       if (!category) {
//           return res.status(400).json({
//               success: false, 
//               message: "Invalid category"
//           });
//       }

//       // Prepare product data for saving
//       const newProductData = {
//           productName: productData.productName,
//           brand: productData.brand,
//           modelNumber: productData.modelNumber,
//           processor: {
//               brand: productData.processor.brand || '',
//               model: productData.processor.model || '',
//               generation: productData.processor.generation || ''
//           },
//           ram: {
//               size: productData.ram.size || '',
//               type: productData.ram.type || ''
//           },
//           storage: {
//               type: productData.storage.type || '',
//               capacity: productData.storage.capacity || ''
//           },
//           graphics: {
//               model: productData.graphics?.model || '',
//               vram: productData.graphics?.vram || ''
//           },
//           display: {
//               size: productData.display?.size || '',
//               resolution: productData.display?.resolution || '',
//               refreshRate: productData.display?.refreshRate || ''
//           },
//           operatingSystem: productData.operatingSystem || '',
//           batteryLife: productData.batteryLife || '',
//           weight: productData.weight || '',
//           ports: productData.ports || '',
//           regularPrice: productData.regularPrice,
//           salePrice: productData.salePrice || productData.regularPrice,
//           quantity: productData.quantity,
//           description: productData.description || '',
//           category: category._id,
//           size: productData.size || '',
//           color: productData.color || '',
//           productImage: productData.productImage || '', // Assuming image URLs from frontend
//           status: productData.status || 'Available',
//           isBlocked: false,
//           popularity: 0,
//           rating: 0
//       };

//       // Create and save new product
//       const newProduct = new Product(newProductData);
//       await newProduct.save();

//       res.status(201).json({
//           success: true, 
//           message: "Product added successfully",
//           product: newProduct
//       });

//   } catch (error) {
//       console.error("Error adding product:", error);
//       res.status(500).json({
//           success: false, 
//           message: "Server error",
//           error: error.message
//       });
//   }
// };
const add_product = async (req, res) => {
  try {
    const { productSubmissionData } = req.body;
    console.log('Received Product Data:', productSubmissionData); 

    const requiredFields = [
      'productName', 'brand', 'modelNumber', 'category', 
      'regularPrice', 'quantity', 'processor', 'ram', 'storage'
    ];

    for (let field of requiredFields) {
      if (!productSubmissionData[field]) {
        return res.status(400).json({
          success: false, 
          message: `Missing required field: ${field}`
        });
      }
    }


    const productExists = await Product.findOne({
     
      productName: { $regex: new RegExp(`^${productSubmissionData.productName}$`, 'i') },
      modelNumber: { $regex: new RegExp(`^${productSubmissionData.modelNumber}$`, 'i') },
    });

    if (productExists) {
      return res.status(400).json({
        success: false, 
        message: "Product already exists"
      });
    }

  
    const category = await Category.findById(productSubmissionData.category);
    if (!category) {
      return res.status(400).json({
        success: false, 
        message: "Invalid category"
      });
    }

    const newProduct = new Product(productSubmissionData);
    await newProduct.save();

    res.status(201).json({
      success: true, 
      message: "Product added successfully",
      product: newProduct
    });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false, 
      message: "Server error",
      error: error.message
    });
  }
};



const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

 
    const filter = search
      ? {
        $or: [
          { productName: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },  
          { modelNumber: { $regex: search, $options: 'i'}},
        ],
      } 
      : {};

      if (search) {
        const categories = await Category.find({
          name: { $regex: search, $options: 'i' },
        });
        if (categories.length > 0) {
          const categoryIds = categories.map((category) => category._id);
          filter.$or.push({ category: { $in: categoryIds } });
        }
      }

  
    const products = await Product.find(filter)
      .populate('category')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

  
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};



// Block/Unblock product



const toggleBlockProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isBlocked = !product.isBlocked;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: product.isBlocked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling product block status",
      error: error.message,
    });
  }
};


// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    console.log("product data update", productId, updateData)
    console.log('Checking productName:', updateData.productName);

    // Validate required fields
    const requiredFields = [
      'productName', 'brand', 'modelNumber', 'category', 
      'regularPrice',  'processor', 'ram', 'storage'
    ];

    for (let field of requiredFields) {
      if (!updateData[field]) {
        console.error(`Missing or undefined field: ${field}`, updateData[field]);
        return res.status(400).json({
          success: false, 
          message: `Missing required field: ${field}`
        });
      }
    }
    
    console.log('Received Product Data:', updateData); // Log received data for debugging
    // Validate category
    const category = await Category.findById(updateData.category._id);
    if (!category) {
      return res.status(400).json({
        success: false, 
        message: "Invalid category"
      });
    }

      // Get existing product to preserve images if no new ones are provided
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
  

    // Find the product and update
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        productName: updateData.productName,
        brand: updateData.brand,
        modelNumber: updateData.modelNumber,
        processor: {
          brand: updateData.processor.brand || '',
          model: updateData.processor.model || '',
          generation: updateData.processor.generation || ''
        },
        ram: {
          size: updateData.ram.size || '',
          type: updateData.ram.type || ''
        },
        storage: {
          type: updateData.storage.type || '',
          capacity: updateData.storage.capacity || ''
        },
        graphics: {
          model: updateData.graphics?.model || '',
          vram: updateData.graphics?.vram || ''
        },
        display: {
          size: updateData.display?.size || '',
          resolution: updateData.display?.resolution || '',
          refreshRate: updateData.display?.refreshRate || ''
        },
        operatingSystem: updateData.operatingSystem || '',
        batteryLife: updateData.batteryLife || '',
        weight: updateData.weight || '',
        ports: updateData.ports || '',
        regularPrice: updateData.regularPrice,
        salePrice: updateData.salePrice || updateData.regularPrice,
        quantity: updateData.quantity,
        description: updateData.description || '',
        category: category._id,
        size: updateData.size || '',
        color: updateData.color || '',
        productImage: updateData.productImage || [],
        // status: updateData.status || 'Available',
        status: updateData.quantity > 0 ? 'Available' : 'Out of Stock',
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



// Get a single product by ID
const get_product = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
    add_product,
    getProducts,
    toggleBlockProduct,
    updateProduct,
    get_product
}
