const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// Schema
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must hae a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equal then 40 characters',
            ],
            minlength: [
                10,
                'A tour name must have greater or equal then 10 characters',
            ],
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        slug: String,
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
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, or difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            required: [true, 'A tour must hae a rating'],
            max: [5, 'A tour name must be less or equal to 5'],
            min: [1, 'A tour name must be greater or equal then 1'],
            set: val => Math.round(val * 10 ) / 10
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
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: 'Discount price   should be below regular price',
            },
        },

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
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            type: {
                String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

tourSchema.index({
    price: 1,
    ratingsAverage: -1,
});
tourSchema.index({
    slug: 1,
});
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
// Virtual Populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });
    next();
});
tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query tok ${Date.now() - this.start}milliseconds`);
    next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
