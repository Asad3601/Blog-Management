const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const router = require('express').Router();


router.get('/register_form', UserController.UserRegisterForm);
router.get('/login_form', AuthMiddleware.PreventLoggedIn, UserController.UserLoginForm);
router.post('/login_user', UserController.LoginUser);
router.post('/register_user', UserController.user_upload.single('user_image'), UserController.RegisterUser);
router.get('/profile', AuthMiddleware.CheckLogin, UserController.UserProfile);
router.get('/logout', AuthMiddleware.CheckLogin, UserController.Logout);
router.get('/forget-password', AuthMiddleware.PreventLoggedIn, UserController.ForgetPasswordForm);
router.post('/forget-password', UserController.ForgetPasswordVerify);
router.get('/reset-password', AuthMiddleware.PreventLoggedIn, UserController.RestPasswordTokenLoad);
router.post('/reset-password', UserController.PasswordReset);






module.exports = router;