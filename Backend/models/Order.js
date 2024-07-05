const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    dataId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    state: {
        type: String,
        default: '',
    },
    zip: {
        type: String,
        default: '',
    },
    nearBy: {
        type: String,
        default: '',
    },
    area: {
        type: String,
        default: '',
    },
    altNumber: {
        type: String,
        default: '',
    },
    products: [{
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }],
    billDetails: [{
        discountType: {
            type: String,
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        gstPercentage: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'under verification', 'verified', 'shipping', 'delivered', 'callback', 'canceled'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', OrderSchema);
