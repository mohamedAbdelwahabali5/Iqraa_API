const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shippingAddress: {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["In-Progress", "Confirmed", "Processing", "Shipping", "Out for Delivery", "Delivered", "Cancelled"],
        default: "In-Progress",
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "Cash on Delivery"],
        required: true,
        default: "Cash on Delivery"
    },
    IsCancelled: {
        type: Boolean,
        default: false,
    },
        
    cancelledAt: {
        type: Date
    },
    cancellationReason: {
        type: String
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// Virtual to populate order items
orderSchema.virtual('orderItems', {
    ref: 'OrderItem',
    localField: '_id',
    foreignField: 'order'
});

// Generate invoice number before saving
orderSchema.pre('save', async function(next) {
    if (!this.invoiceNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        
        try {
            const lastOrder = await this.constructor.findOne({
                invoiceNumber: new RegExp(`INV-${year}-${month}-`)
            }).sort({ invoiceNumber: -1 });

            let number = '0001';
            
            if (lastOrder && lastOrder.invoiceNumber) {
                const lastNumber = parseInt(lastOrder.invoiceNumber.slice(-4));
                number = (lastNumber + 1).toString().padStart(4, '0');
            }
            
            this.invoiceNumber = `INV-${year}-${month}-${number}`;

            const existingOrder = await this.constructor.findOne({ invoiceNumber: this.invoiceNumber });
            if (existingOrder) {
                const nextNumber = (parseInt(number) + 1).toString().padStart(4, '0');
                this.invoiceNumber = `INV-${year}-${month}-${nextNumber}`;
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});



const Order = mongoose.model("Order", orderSchema);

module.exports = Order;