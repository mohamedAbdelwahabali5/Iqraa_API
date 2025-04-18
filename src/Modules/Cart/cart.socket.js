const Cart = require('./cart.model');
const Book = require('../Books/book.model');

const handleCartSocket = (io) => {
    io.on('connection', (socket) => {
        // Join user's cart room
        socket.on('joinCart', async (userId) => {
            socket.join(`cart_${userId}`);
        });

        // Handle quantity updates
        socket.on('updateQuantity', async ({ userId, bookId, quantity }) => {
            try {
                const cart = await Cart.findOne({ user: userId });
                if (!cart) return;

                const item = cart.items.find(item => item.book.toString() === bookId);
                if (!item) return;

                // Update quantity
                item.quantity = quantity;
                item.lastUpdated = new Date();

                // Recalculate total price
                const book = await Book.findById(bookId);
                cart.totalPrice = cart.items.reduce((total, item) => {
                    return total + (book.price * item.quantity);
                }, 0);

                await cart.save();
                await cart.populate('items.book', 'title price');

                // Broadcast update to all user's devices
                io.to(`cart_${userId}`).emit('cartUpdated', cart);
            } catch (error) {
                socket.emit('cartError', error.message);
            }
        });
    });
};

module.exports = handleCartSocket;