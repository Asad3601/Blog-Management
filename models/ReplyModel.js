const mongoose = require('mongoose');

// Create a Reply schema
const ReplySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Reference to the Comment model
        required: true
    }
}, {
    timestamps: true
});

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;