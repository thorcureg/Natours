const Tour = require('../models/tourModel');
//MIDDLE WARE
// HANDLERS
//GET ALL TOURS
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200) //status code
            .json({
                status: `sucess`,
                results: tours.length, //number of results
                data: {
                    tours, //data parsed from dev_data
                },
            });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};
// GET TOUR
exports.getTour = async (req, res) => {
    try {
        const tours = await Tour.findById(req.params.id);
        res.status(200) //status code
            .json({
                status: `sucess`,
                results: tours.length, //number of results
                data: {
                    tours, //data parsed from dev_data
                },
            });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

// CREATE TOUR
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent',
        });
    }
};
// UPDATE TOUR
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};
// DELETE TOUR
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(204).json({
            status: 'fail',
            message: err,
        });
    }
};
