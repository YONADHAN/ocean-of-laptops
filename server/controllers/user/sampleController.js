

const path = require("path");
const sharp = require("sharp");
const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const Cart = require("../../models/cartSchema");
const mongoose = require("mongoose");
const Cookies = require("js-cookie");


const get_filter_options = async (req, res) => {
  try {
    // Fetch distinct filter options from your database
    const filterOptions = {
      'processor.brand': await Product.distinct('processor.brand'),
      'processor.model': await Product.distinct('processor.model'),
      'processor.generation': await Product.distinct('processor.generation'),
      'ram.size': await Product.distinct('ram.size'),
      'ram.type': await Product.distinct('ram.type'),
      'storage.type': await Product.distinct('storage.type'),
      'storage.capacity': await Product.distinct('storage.capacity'),
      'graphics.model': await Product.distinct('graphics.model'),
      'graphics.vram': await Product.distinct('graphics.vram'),
      'display.size': await Product.distinct('display.size'),
      'display.resolution': await Product.distinct('display.resolution'),
      'display.refreshRate': await Product.distinct('display.refreshRate'),
      operatingSystem: await Product.distinct('operatingSystem'),
      brand: await Product.distinct('brand'),
      color: await Product.distinct('color'),
      status: await Product.distinct('status'),
      category: await Category.find({
        isListed: true,
        status: 'active',
      }).select('name _id'),
    };

    res.json(filterOptions);
  } catch (error) {
    console.error('Filter options error:', error);
    res.status(500).json({
      message: 'Error retrieving filter options',
      error: error.message,
    });
  }
};



const filter_products = async (req, res) => {
    try {
        // const {filter} = req.query
        const filter = {
          colors: {
            Black: true,
          },
          displayRefreshRates: {
            "60": true,
          },
          priceRange: {
            minPrice: 0,
            maxPrice: 209722,
          },
          operatingSystems: {
            "Windows 11": true,
          },
          processorBrands: {
            Apple: false,
            AMD: false,
            Intel: true,
          },
        };
        
        let query = {};
        
        for (let key in filter) {
          if (typeof filter[key] === "object" && !Array.isArray(filter[key])) {
            for (let subkey in filter[key]) {
              if(filter[key][subkey]){
                let temp = `${key}.${subkey}`;
                query[temp] = filter[key][subkey];
                // query[subkey] = filter[key][subkey];
              }
            }
          } else {
            if(filter[key]) {
              query[key] = filter[key];
            }
          }
        }

        
        console.log(query);
        
          console.log(JSON.stringify(query));
          const sortOptions = {
            'price:asc': { regularPrice: 1 },
            'price:desc': { regularPrice: -1 },
            'rating:desc': { averageRating: -1 },
            'createdAt:desc': { createdAt: -1 },
            'name:asc': { productName: 1 },
            'name:desc': { productName: -1 },
          };
          const sortParam = req.query.sort || "createdAt:desc";
          const sortQuery = sortOptions[req.query.sort] || sortOptions['createdAt:desc'];

          // Handle pagination
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const skip = (page - 1) * limit;

          const queryResults = await Product.find(query)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit)
          .populate({
              path: 'category',
              match: { isBlocked: false }
          });
       
          const totalProducts = await Product.countDocuments(query);
          const totalPages = Math.ceil(totalProducts / limit);
          res.status(200).json({success: true, message: 'Products successfully fetched', products: queryResults, totalProducts, totalPages, currentPage: page, sortParam});
      

          
    } catch (error) {
        res.status(500).json({success: false, error: error.message, message: "internal server error"});
    }
}

module.exports = {
  get_filter_options,
  filter_products,
}