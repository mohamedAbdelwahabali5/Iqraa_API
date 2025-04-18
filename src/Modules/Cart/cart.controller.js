const Cart = require('./cart.model');
const CartItem = require('./cartItem.model');
const Book = require('../Books/book.model');
const { asyncHandler } = require('../../utils/asyncHandler');
const APIError = require('../../utils/APIError');
const socket = require('../../utils/socket');

// Helper function to emit socket events safely
const emitCartUpdate = (userId, cart) => {
    try {
        const io = socket.getIO();
        io?.to(`cart_${userId}`).emit('cartUpdated', cart);
    } catch (error) {
        console.log('Socket emission failed:', error.message);
    }
};

// Get cart
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id })
        .populate('items.book', 'title price');

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: cart });
});

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
    const { bookId, quantity } = req.body;

    // Validate book and stock
    const book = await Book.findById(bookId);
    if (!book) {
        throw new APIError('Book not found', 404);
    }
    if (book.stockQuantity < quantity) {
        throw new APIError(`Only ${book.stockQuantity} copies available`, 400);
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if book already in cart
    const existingItem = cart.items.find(item => item.book.toString() === bookId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ book: bookId, quantity });
    }

    // Calculate total price
    cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
        const total = await totalPromise;
        const bookPrice = await Book.findById(item.book).select('price');
        return total + (bookPrice.price * item.quantity);
    }, Promise.resolve(0));

    await cart.save();
    await cart.populate('items.book', 'title price');

    // Add socket event emission
    emitCartUpdate(req.user._id, cart);

    res.json({ 
        success: true, 
        message: 'Item added to cart successfully',
        data: cart 
    });
});

// Update cart item quantity
const updateCartItem = asyncHandler(async (req, res) => {
    const { bookId, quantity } = req.body;
    const MAX_QUANTITY = 10; // or any reasonable limit

    if (quantity > MAX_QUANTITY) {
        throw new APIError(`Maximum ${MAX_QUANTITY} books allowed per item`, 400);
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new APIError('Cart not found', 404);
    }

    const item = cart.items.find(item => item.book.toString() === bookId);
    if (!item) {
        throw new APIError('Item not found in cart', 404);
    }

    if (quantity === 0) {
        cart.items = cart.items.filter(item => item.book.toString() !== bookId);
    } else {
        item.quantity = quantity;
        item.lastUpdated = new Date();
    }

    const book = await Book.findById(bookId);
    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (book.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.book', 'title price');

    // Use the helper function instead of direct io call
    emitCartUpdate(userId, cart);

    res.json({ 
        success: true, 
        message: 'Cart updated successfully',
        data: cart 
    });
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        throw new APIError('Cart not found', 404);
    }

    cart.items = cart.items.filter(item => item.book.toString() !== bookId);

    // Recalculate total price
    const book = await Book.findById(bookId);
    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (book.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.book', 'title price');

    // Use the helper function
    emitCartUpdate(req.user._id, cart);

    res.json({ success: true, message: 'Item removed from cart successfully', data: cart });
});

const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        throw new APIError('Cart not found', 404);
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Use the helper function
    emitCartUpdate(req.user._id, cart);

    res.json({ success: true, message: 'Cart cleared successfully', data: cart });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};