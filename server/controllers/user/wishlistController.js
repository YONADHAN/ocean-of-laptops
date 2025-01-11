const Wishlist = require('../../models/wishlistSchema');    
const Product = require('../../models/productSchema');
const User = require('../../models/userSchema');
const Cart = require('../../models/cartSchema');


const add_to_wishlist = async (req, res) => {
    try {
        const { productId, userId } = req.body;
        const valiedProduct = await Product.findById(productId).populate('category');
        if (!valiedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if(valiedProduct.category.isBlocked) {
            return res.status(403).json({ success: false, message: "This product belongs to a blocked category." });
        }
        if(valiedProduct.isBlocked){            
            return res.status(400).json({ success: false, message: "Product is blocked by the admin" });
        }
        const existingProduct = await Wishlist.findOne({ userId})
        if(!existingProduct) {
            const newWishlist = new Wishlist({
                userId,
                products: [productId],
            })
            await newWishlist.save();
        }
        else {
            existingProduct.products.push(productId);
            await existingProduct.save();
        }        
        res.status(200).json({ success: true, message: "Product added to wishlist successfully" });
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        
    }
}

const get_wishlists = async (req, res) => {
    try {
        const {userId} = req.body;
        
        const wishlists = await Wishlist.findOne({ userId }).populate('products');
        
        if (!wishlists) {
            return res.status(404).json({ success: false, message: "No wishlists found" });
        }
        
        res.status(200).json({ success: true, wishlists: wishlists.products });
    } catch (error) {
        console.error("Error getting wishlists:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const remove_from_wishlist = async (req, res) => {
    try {
        const { productId, userId } = req.body;
        const existingProduct = await Wishlist.findOne({ userId});
        
        if(!existingProduct) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }
        
        existingProduct.products = existingProduct.products.filter((id) => id.toString()!== productId);
        await existingProduct.save();
        
        res.status(200).json({ success: true, message: "Product removed from wishlist successfully" });
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        
    }
}

const add_to_cart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const existingProduct = await Product.findById(productId);
        
        if(!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        const existingCart = await Cart.findOne({ userId });
        
        if(!existingCart) {
            const newCart = new Cart({
                userId,
                products: [productId],
            })
            await newCart.save();
        }
        else {
            existingCart.products.push(productId);
            await existingCart.save();
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        
    }
}



module.exports = {
    add_to_wishlist,
    get_wishlists,
    remove_from_wishlist,
    add_to_cart,
    
}
