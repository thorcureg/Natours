const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Mount the review router
router.use('/:tourId/reviews', reviewRouter);

// Top 5 cheap tours route
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

// Tour statistics route
router.route('/tour-stats').get(tourController.getTourStats);

// Monthly plan route
router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan,
    );

// Tour routes (protected by authentication and role-based access)
router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        tourController.createTour,
    );

// Single tour routes (protected by authentication and role-based access)
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour,
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour,
    );

module.exports = router;
