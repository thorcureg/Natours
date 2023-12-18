const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

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
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    //SEND RESPONSE
    res.status(200) //status code
        .json({
            status: `sucess`,
            results: users.length, //number of results
            data: {
                users, //data parsed from dev_data
            },
        });
});
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

// GET USER
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};
////////////////////
// UPDATE USER
exports.updateUser = factory.updateOne(User)
// DELETE USER
exports.deleteUser = factory.deleteOne(User)
