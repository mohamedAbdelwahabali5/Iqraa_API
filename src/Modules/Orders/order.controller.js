const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const Book = require('../Books/book.model');
const { asyncHandler } = require('../../utils/asyncHandler');
const APIError = require('../../utils/APIError');

const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, discount } = req.body;
    
    // التحقق من المستخدم
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new APIError('User not found', 404);
    }

    // معالجة عنوان الشحن
    const finalShippingAddress = shippingAddress || {
        name: `${user.firstName} ${user.lastName}`,
        address: user.address?.street ? 
            `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.zipCode}, ${user.address.country}` 
            : undefined,
        phone: user.phone
    };

    // التحقق من صحة عنوان الشحن
    if (!finalShippingAddress.address || !finalShippingAddress.phone) {
        throw new APIError('Shipping address is required. Please provide address and phone number.', 400);
    }

    // التحقق من وجود عناصر الطلب
    if (!orderItems || orderItems.length === 0) {
        throw new APIError('No products in the order', 400);
    }

    // حساب السعر الإجمالي
    let totalPrice = 0;
    for (const item of orderItems) {
        // التحقق من صحة ObjectId
        if (!mongoose.Types.ObjectId.isValid(item.book)) {
            throw new APIError(`Invalid book ID: ${item.book}`, 400);
        }

        const book = await Book.findById(item.book);
        if (!book) {
            throw new APIError(`Book not found with ID: ${item.book}`, 404);
        }
        totalPrice += book.price * item.quantity;
    }

    // تطبيق الخصم (نسبة مئوية أو مبلغ ثابت)
    if (discount) {
        totalPrice = discount <= 100 ? 
            totalPrice - (totalPrice * (discount / 100)) : 
            Math.max(0, totalPrice - discount);
    }

    // إنشاء الطلب
    const order = await Order.create({
        user: req.user._id,
        shippingAddress: finalShippingAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        totalPrice,
        discount,
        status: 'In-Progress'
    });

    // إنشاء عناصر الطلب
    const orderItemsPromises = orderItems.map(item => 
        OrderItem.create({
            order: order._id,
            ...item
        })
    );
    await Promise.all(orderItemsPromises);

    // إرجاع الطلب مع تفاصيل كاملة
    const populatedOrder = await Order.findById(order._id)
        .populate('user', 'firstName lastName email')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'book',
                select: 'title price'
            }
        });
        
    res.status(201).json({ 
        success: true, 
        message: "Order created successfully",
        data: populatedOrder 
    });
});


const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('user', 'firstName lastName email')
        .populate('orderItems')
        .sort('-createdAt');
    res.json({ success: true, data: orders });
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ 
        _id: req.params.id,
        user: req.user._id 
    }).populate('orderItems');
    
    if (!order) {
        throw new APIError('Order not found', 404);
    }
    
    res.json({ success: true, data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new APIError('Order not found', 404);
    }

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
        throw new APIError('Cannot update completed or cancelled orders', 400);
    }

    order.status = status;
    if (status === 'Cancelled') {
        order.IsCancelled = true;
    }

    await order.save();
    res.json({ success: true, data: order });
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new APIError("Invalid order ID", 400);
    }

    // Find order and check ownership
    const order = await Order.findOne({
        _id: id,
        user: req.user._id
    }).populate('orderItems');

    if (!order) {
        throw new APIError("Order not found", 404);
    }

    // Check if order can be cancelled
    const cancelableStatuses = ["In-Progress", "Confirmed", "Processing"];
    if (!cancelableStatuses.includes(order.status)) {
        throw new APIError(
            `Cannot cancel order - Current status is ${order.status}. Only orders in ${cancelableStatuses.join(", ")} status can be cancelled`,
            400
        );
    }

    // // Check cancellation time limit (e.g., within 24 hours of order creation)
    // const orderAge = Date.now() - order.createdAt.getTime();
    // const CANCELLATION_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // if (orderAge > CANCELLATION_WINDOW) {
    //     throw new APIError(
    //         "Cannot cancel order - Cancellation window (24 hours) has expired",
    //         400
    //     );
    // }

    // Update order status
    order.status = "Cancelled";
    order.IsCancelled = true;
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || "Cancelled by user";

    await order.save();

    res.json({
        success: true,
        message: "Order cancelled successfully",
        data: order
    });
});

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};