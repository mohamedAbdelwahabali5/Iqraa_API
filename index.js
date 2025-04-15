
const cores = require('cors');
const express = require('express');
const dotenv = require('dotenv');

const userRouter = require('./src/Modules/Users/user.routes');
const bookRouter = require('./src/Modules/Books/book.routes');
const commentRouter = require('./src/Modules/Comments/comment.routes');
const ConnectMongoDB = require('./DB/connection');

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



// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});