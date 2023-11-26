const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    pid: Number,
    name: String,
    company: String,
    rating: Number,
    price: Number,
    description: String,
    imgsrc: String,
});

const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = Product;