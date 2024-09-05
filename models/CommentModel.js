const mongoose = require('mongoose');

// Create a Comment schema
const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply' // Reference to the Reply model
    }]
}, {
    timestamps: true
});

// Create the Comment model
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;