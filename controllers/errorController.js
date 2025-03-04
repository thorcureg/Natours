const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value: (${value}). Use another value.`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid ${errors.join(' ')}`;
    return new AppError(message, 400);
};
const handleJWTError = () => {
    const message = `Invalid Token. Please Log In again`;
    return new AppError(message, 401);
};
const handleJWTExpiredError = () => {
    const message = `Invalid Token. Your Token has Expired`;
    return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: {
                message: err.message,
                operational: '✅',
            },
        });
    } else {
        //1) Log Error
        // eslint-disable-next-line no-console
        console.error('ERROR❌❌', err);

        //2) Send Generic Message
        res.status(500).json({
            status: 500,
            message: {
                message: 'Something went very wrong!',
                operational: '❌',
            },
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err, name: err.name };

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
