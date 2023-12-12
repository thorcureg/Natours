const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
    });
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'SUCCESS',
        token,
        data: {
            newUser,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //1) check if email and pass exist
    if (!email || !password) {
        return next(new AppError('Please provide email and passowrd!', 400));
    }
    //2) check if user exist and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
    }
    //3) if everything is ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'SUCCESS',
        token,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get token and check if its true
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access. ',
                401,
            ),
        );
    }
    // 2) Verifying Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token no longer exist',
                401,
            ),
        );
    }
    // 4) Check if user changed passwords after the JWT/Token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password. Please log in again.',
                401,
            ),
        );
    }

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission', 401));
        }
        console.log(req.user.role);
        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get User based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    } // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save( {validateBeforeSave: false} );
    // 3) Send it to user's email
});
exports.resetPassword = (req, res, next)=>{

}
