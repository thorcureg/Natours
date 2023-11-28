
const express = require('express');
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

//1)middleware
app.use(morgan('dev')); 
app.use(express.json());


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})
//2)route handler
//3)route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//4)start server

module.exports = app;