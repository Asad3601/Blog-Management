const mongoose = require('mongoose');



const PostSchema = mongoose.Schema({
    post_title: {
        type: String,
        required: true,
        unique: true
    },
    post_content: {
        type: String,
        required: true
    },
    post_image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Post', PostSchema);