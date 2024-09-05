// Required dependencies
require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const path = require('path');
const UserRoute = require('./routes/UserRoute');
const AdminRoute = require('./routes/AdminRoute');
const BlogRoute = require('./routes/BlogRoute');
const session = require('express-session');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Failed to connect to DB", err));

// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

// Set view engine and static file directories
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'media')));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'media')));
// Middleware to pass session to views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Use routes
app.use(UserRoute);
app.use(AdminRoute);
app.use(BlogRoute);

// Start server
app.listen(process.env.PORT_NO, () => {
    console.log(`Server is running on port ${process.env.PORT_NO}`);
});