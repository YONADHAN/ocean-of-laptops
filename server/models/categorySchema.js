const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    isListed: {
        type:Boolean,
        default: true
    },
    categoryOffer:{
        type:Date,
        default:Date.now
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    isBlocked : {
        type: Boolean,
        required:true,
        default: false
    },
    status: {
        type: String,
        required:true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
})
const Category = mongoose.model("Category",categorySchema)
module.exports = Category;