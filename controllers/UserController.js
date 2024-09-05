const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemialer = require('nodemailer');
const randomstring = require('randomstring');

const bcrypt = require('bcrypt');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'media');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const user_upload = multer({ storage: storage });
exports.user_upload = user_upload;


exports.UserRegisterForm = (req, res) => {
    res.render('register')
        // console.log('users....');
}
exports.UserLoginForm = (req, res) => {
    res.render('login')
        // console.log('users....');
}
exports.RegisterUser = async(req, res) => {
    let { username, email, password } = req.body;
    const image = req.file ? req.file.path : null;

    if (parseInt(password.length) >= 5 && image != "" && username != "" && email != "") {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        let user = new UserModel({
            username: username,
            email: email,
            password: password,
            image: image
        })
        await user.save();
        res.redirect('/login_form');
    } else {
        res.send("Not Registered User Due To Some Reason");
    }
}


exports.LoginUser = async(req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
        const match_password = await bcrypt.compare(password, user.password);
        if (match_password) {
            req.session.user = user;
            if (user.role == 'admin') {
                res.redirect('/dashboard');
            } else {
                res.redirect('/');
            }
        } else {
            res.render('login', { passwordmessage: 'Password Not Matching With DB' })
        }
    } else {
        res.render('login', { emailmessage: 'User Data Exist In DB' })
    }
}



exports.UserProfile = async(req, res) => {
    try {
        res.send(req.session.user);
    } catch (error) {
        console.log(error.message)
    }
}


exports.Logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error while destroying session:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/login_form');
    });
    // res.redirect('/login');
};
exports.ForgetPasswordForm = async(req, res) => {
    res.render('user/forget-password')
}
exports.ForgetPasswordVerify = async(req, res) => {
    try {
        const email = req.body.email;
        if (email) {
            const randomString = randomstring.generate();
            const user = await UserModel.findOneAndUpdate({ email }, // Filter condition
                { $set: { token: randomString } }, // Update operation
                { new: true } // Options: Return the updated document
            );

            SendPasswordRestEmail(user.username, user.email, user.token);
            res.render('user/forget-password', { message: 'Plz check your Email for Password Rest' })

        } else {
            res.render('user/forget-password', { message: "Your Email is Not Regsitered" });
        }
    } catch (err) {
        console.log(err.message)
    }
}


const SendPasswordRestEmail = async(name, email, token) => {
    const transport = nodemialer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.admin_email,
            pass: process.env.admin_password,
        }
    })
    const mailoptions = {
        from: process.env.admin_email,
        to: email,
        subject: "Password Reset Request", // Corrected subject
        html: `
            <p>Hi <b>${name}</b>,</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="http://localhost:4400/reset-password?token=${token}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
        `
    };

    transport.sendMail(mailoptions, (info, err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email Send');
        }
    })
}


exports.RestPasswordTokenLoad = async(req, res) => {
    try {
        let token = req.query.token;
        let tokenData = await UserModel.findOne({ token }); // Assuming 'token' field exists in UserModel
        // console.log(tokenData._id)
        if (tokenData && tokenData.token == token) {
            res.render('user/reset_password', { user_id: tokenData._id });
        } else {
            res.render('user/404', { message: 'Page Not Found...!' })
                // Handle case where token is not found
                // res.status(400).send('Invalid or expired token.');
        }
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).send('Server error.');
    }
};


exports.PasswordReset = async(req, res) => {
    try {
        const { user_id, password1, password2 } = req.body;
        const user = await UserModel.findOne({ _id: user_id });
        // Check if the passwords match and are at least 5 characters long
        if (password1 === password2 && password1.length >= 5) {
            let oldpassword = await bcrypt.compare(password2, user.password);
            if (!oldpassword) {
                // Generate salt and hash the new password
                const salt = await bcrypt.genSalt(10);
                const newPassword = await bcrypt.hash(password2, salt);

                // Update the user's password and clear the token
                await UserModel.findByIdAndUpdate({ _id: user_id }, // Use user_id directly as the filter
                    { $set: { password: newPassword, token: '' } } // Update operation
                    // Options: Return the updated document
                );

                // Redirect to the login page after successful password reset
                res.redirect('/login_form');
            } else {
                res.render('user/reset_password', { message: 'Your Are Using Old Password', user_id });
            } // Redirect instead of rendering login form directly
        } else {
            // Render the reset password page with an error message
            res.render('user/reset_password', { message: 'Passwords do not match or are too short.', user_id });
        }
    } catch (error) {
        console.error('Error during password reset:', error.message);
        // Handle the error and provide feedback to the user
        res.status(500).render('user/reset_password', { message: 'An error occurred. Please try again.' });
    }
};