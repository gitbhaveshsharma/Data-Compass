// models/Cancel.js
const mongoose = require('mongoose');

const CancelSchema = new mongoose.Schema({
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
        },
        quantity: {
            type: Number,
        },
        price: {
            type: Number,
        }
    }],
    billDetails: [{
        discountType: {
            type: String,
        },
        discountValue: {
            type: Number,
        },
        gstPercentage: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
        },
        transactionId: {
            type: String,
            required: function () {
                return this.paymentMethod !== 'COD';
            },
            default: '',
        },
    }],
    status: {
        type: String,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    orderId: {
        type: String,
    },
    customerId: {
        type: String,
    },
    employeeId: {
        type: String,
        default: null,
    },
    expectedDeliveryDate: {
        type: Date,
    },
    department: { 
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Cancel', CancelSchema);
