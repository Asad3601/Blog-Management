const mongoose = require('mongoose');


const BlogSchema = mongoose.Schema({
    blog_title: {
        type: String,
        required: true,
        unique: true
    },
    blog_description: {
        type: String,
        required: true
    },
    blog_image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blogs', BlogSchema);