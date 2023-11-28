const express = require('express')
const fs = require('fs');
// GET ALL USER 
exports.getAllUsers = (req,res)=>{
    // console.log(req.requestTime);

    res
    .status(500)
    .json({
        status:'error',
        message:'This route is not yet defined'
    })
}
// GET USER 
exports.getUser = (req,res)=>{
    // console.log(req.params);

    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id=== id);

    // // if(id>tours.length)
    // if (!tour)
    // {return res.status(404).json({
    //     status:'fail',
    //     message: 'failed to find id'
    // })}
    

    res
    .status(500)
    .json({
        status:'error',
        message:'This route is not yet defined'
    })
}
// CREATE USER 
exports.createUser =(req,res)=>{
    // console.log(req.body);
    // const newId = tours[tours.length -1].id+1;
    // const newTour = Object.assign({id:newId},req.body) 
    
    // tours.push(newTour);
    // fs.writeFile(
    //     `${__dirname}/dev-data/data/tours-simple.json`,
    //     JSON.stringify(tours),
    //     err =>{
        res
        .status(500)
        .json({
            status:'error',
            message:'This route is not yet defined'
        })
    //});
    
    // res.send('done'); //cannot send two
}
// UPDATE USER 
exports.updateUser = (req,res)=>{

    // if(req.params.id * 1 >tours.length)
    //     {return res.status(404).json({
    //         status:'fail',
    //         message: 'failed to find id'
    //     })}
     res
        .status(200)
        .json({
            status:'success',
            data:{
                tour:"updated data here"
            }
        })
        
}
// DELETE USER 
exports.deleteUser = (req,res)=>{

    // if(req.params.id * 1 >tours.length)
    //     {return res.status(404).json({
    //         status:'fail',
    //         message: 'failed to find id'
    //     })}
     res
        .status(500)
        .json({
            status:'error',
            message:'This route is not yet defined'
        })
        
}
