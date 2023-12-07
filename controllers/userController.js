const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
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
    res
      .status(200) //status code
      .json({
        status: `sucess`,
        results: users.length, //number of results
        data: {
            users, //data parsed from dev_data
        },
      });
});
// GET USER
exports.getUser = (req, res) => {
    // console.log(req.params);

    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id=== id);

    // // if(id>tours.length)
    // if (!tour)
    // {return res.status(404).json({
    //     status:'fail',
    //     message: 'failed to find id'
    // })}

    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};
////////////////////
// UPDATE USER
exports.updateUser = (req, res) => {
    // if(req.params.id * 1 >Users.length)
    //     {return res.status(404).json({
    //         status:'fail',
    //         message: 'failed to find id'
    //     })}
    res.status(200).json({
        status: 'success',
        data: {
            User: 'updated data here',
        },
    });
};
// DELETE USER
exports.deleteUser = (req, res) => {
    // if(req.params.id * 1 >tours.length)
    //     {return res.status(404).json({
    //         status:'fail',
    //         message: 'failed to find id'
    //     })}
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};
