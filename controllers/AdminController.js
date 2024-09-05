const BlogModel = require('../models/BlogModel');
const PostModel = require('../models/PostModel');
const multer = require('multer');
const path = require('path');
const UserModel = require('../models/UserModel');



exports.BlogForm = (req, res) => {
    res.render('blog_form');
};




const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, '../media/blog_images');
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const blog_upload = multer({ storage: storage });
exports.blog_upload = blog_upload;



exports.CreateBlog = async(req, res) => {
    let { blog_title, blog_description } = req.body;
    const blg_image = req.file ? req.file.path : null;
    let user = new BlogModel({
        blog_title,
        blog_description,
        blog_image: blg_image
    })
    await user.save();
    res.send('Blog Inserted');

}


exports.AdminDashboard = async(req, res) => {
    try {
        res.render('index', {
            title: 'Dashboard',
            MainView: 'admin/main'
        });
    } catch (error) {
        console.log(error.message)
    }
}


exports.AddPostForm = async(req, res) => {
    res.render('index', {
        MainView: 'admin/add_post',
        title: 'Add Post'
    })
}

const p_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, '../media/post_images');
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const post_storage = multer({ storage: p_storage });
exports.post_upload = post_storage;
exports.AddPost = async(req, res) => {
    let { post_title, post_content } = req.body;
    const pst_image = req.file ? req.file.filename : null;
    let user = new PostModel({
        post_title,
        post_content,
        post_image: pst_image
    })
    await user.save();
    res.render('index', {
            title: 'Dashboard',
            post_message: 'Post Add Successfully',
            MainView: 'add_post'
        })
        // res.send('Blog Inserted');
}


exports.Users = async(req, res) => {
    let users = await UserModel.find({ role: 'user' });

    res.render('index', {
        title: 'Users',
        users,
        MainView: 'admin/users'
    })
}