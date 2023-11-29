const mongoose = require('mongoose');
// Schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must hae a name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
        required: [true, 'A tour must hae a rating'],
    },
    price: {
        type: Number,
        required: [true, 'A tour must hae a price'],
    },
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
