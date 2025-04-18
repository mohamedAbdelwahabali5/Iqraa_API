const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1']
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = { CartItem: mongoose.model('CartItem', cartItemSchema), cartItemSchema };