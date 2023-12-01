const mongoose = require('mongoose');
// Schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must hae a name'],
        unique: true,
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        required: [true, 'A tour must hae a rating'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
        required: [true, 'A tour must hae a rating'],
    },
    price: {
        type: Number,
        required: [true, 'A tour must hae a price'],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDate: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
