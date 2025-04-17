
const cores = require('cors');
const express = require('express');
const dotenv = require('dotenv');

const { globalErrorHandler } = require('./src/utils/globalErrorHandler');
const ConnectMongoDB = require('./DB/connection');

const userRouter = require('./src/Modules/Users/user.routes');
const bookRouter = require('./src/Modules/Books/book.routes');
const commentRouter = require('./src/Modules/Comments/comment.routes');
const categoryRouter = require('./src/Modules/Categories/category.routes');
const orderRouter = require('./src/Modules/Orders/order.routes');


const app = express();
app.use(express.json());
app.use(cores());
dotenv.config();

// Connect to MongoDB
ConnectMongoDB();

// Routes   
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/comments', commentRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);






// global error handler 
app.use(globalErrorHandler)


// Start the server
app.listen(process.env.PORT||3333, () => {
    console.log(`Server is running on port ${process.env.PORT||3333}`);
});