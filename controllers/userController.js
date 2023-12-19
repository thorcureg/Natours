const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
// CREATE TOUR
exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newUser,
        },
    });
});

// GET ALL USER
// UPDATE ME
exports.updateMe = catchAsync(async (req, res, next) => {
    //1) Createa Error if User POSTS password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updatePassword',
                400,
            ),
        );
    }
    //2) Update user Document
    // console.log('Original req.body:', req.body);

    const filteredBody = filterObj(req.body, 'name', 'email');
    // console.log('Filtered req.body:', filteredBody);
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        },
    );

    res.status(200) //status code
        .json({
            status: `sucess`,
            data: {
                user: updatedUser,
            },
        });
    //3)
});
// DELETE ME
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'error',
        data: null,
    });
});
// userController.js
exports.getMe = (req, res, next) => {
    // Your logic here
    req.params.id = req.user.id;
    next();
};

//GET ALL USERS
exports.getAllUsers = factory.getAll(User);
// GET USER
exports.getUser = factory.getOne(User);
////////////////////
// UPDATE USER
exports.updateUser = factory.updateOne(User);
// DELETE USER
exports.deleteUser = factory.deleteOne(User);
