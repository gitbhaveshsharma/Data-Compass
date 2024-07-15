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
    orderId: {
        type: String,
        unique: true,
        required: true,
    }
});

// Function to generate a unique order ID
OrderSchema.statics.generateOrderId = async function () {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderId;
    let isUnique = false;

    while (!isUnique) {
        orderId = 'OSZ';
        for (let i = 0; i < 7; i++) {
            orderId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const existingOrder = await this.findOne({ orderId });
        if (!existingOrder) {
            isUnique = true;
        }
    }

    return orderId;
};

// Pre-save middleware to set the orderId
OrderSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.orderId = await this.constructor.generateOrderId();
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
