const BlogController = require('../controllers/BlogController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const router = require('express').Router();



router.get('/', BlogController.BlogPosts);
router.get('/blogs/blog_detail/:id', BlogController.BlogDetail);
router.post('/add-comment', BlogController.AddComment);
router.post('/comments', BlogController.Comments);
router.post('/submit-reply', BlogController.SubmitReplay);






module.exports = router;