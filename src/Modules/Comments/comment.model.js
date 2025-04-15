const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        minlength: [3, 'Comment text must be at least 3 characters'],
        maxlength: [300, 'Comment text cannot exceed 300 characters']
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
}, {
        timestamps: true 
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;