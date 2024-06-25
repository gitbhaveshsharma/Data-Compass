const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'available',
        enum: ['available', 'out of stock']
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
