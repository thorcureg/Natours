const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync =require('./../utils/catchAsync')
const AppError =require('./../utils/appError')


exports.signup = catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })
    const token =jwt.sign({id: newUser._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
        status: 'SUCCESS',
        token ,
        data: {
            newUser
        }
    });
});

exports.login =catchAsync(async(req,res,next)=>{
    const{email, password} = req.body;
    //1) check if email and pass exist
    if(!email || !password){
        return next (new AppError ('Please provide email and passowrd!', 400));
    }
    //2) check if user exist and password is correct
    const user = await user
    .findOne({ email })
    .select('password');
    //3) if everything is ok, send token to client
    const token ='';
    res.status(200).json({
        status:'SUCCESS',
        token,
    });
});

