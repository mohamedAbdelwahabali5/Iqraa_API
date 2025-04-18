const cores = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const { globalErrorHandler } = require('./src/utils/globalErrorHandler');
const ConnectMongoDB = require('./DB/connection');

// Create express app and http server
const app = express();
const server = require('http').createServer(app);

// Initialize socket.io (remove the duplicate declaration)
const initSocket = require('./src/utils/socket').init;

const userRouter = require('./src/Modules/Users/user.routes');
const bookRouter = require('./src/Modules/Books/book.routes');
const commentRouter = require('./src/Modules/Comments/comment.routes');
const categoryRouter = require('./src/Modules/Categories/category.routes');
const orderRouter = require('./src/Modules/Orders/order.routes');
const cartRouter = require('./src/Modules/Cart/cart.routes');



app.use(express.json());
app.use(cores());
dotenv.config();


// Connect to MongoDB
ConnectMongoDB();

// Initialize Socket.io with the server
const io = initSocket(server);

// Initialize cart socket handlers
const handleCartSocket = require('./src/Modules/Cart/cart.socket');
handleCartSocket(io);

// Routes   
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/comments', commentRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);




// global error handler 
app.use(globalErrorHandler)


// Start the server
// Use server.listen instead of app.listen
server.listen(process.env.PORT || 3333, () => {
    console.log(`Server running on port ${process.env.PORT || 3333}`);
});