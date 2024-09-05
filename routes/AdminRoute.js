const AdminController = require('../controllers/AdminController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const router = require('express').Router();



router.get('/blog_form', AdminController.BlogForm);
router.post('/blog', AdminController.blog_upload.single('blog_image'), AdminController.CreateBlog);
router.get('/dashboard', AuthMiddleware.CheckAdmin, AdminController.AdminDashboard);
router.get('/add_post', AuthMiddleware.CheckAdmin, AdminController.AddPostForm);
router.get('/users', AuthMiddleware.CheckAdmin, AuthMiddleware.CheckLogin, AdminController.Users);
router.post('/add_post', AdminController.post_upload.single('post_image'), AdminController.AddPost);





module.exports = router;