const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes below this middleware
router.use(authController.protect);

// Route for getting all reviews and creating a new review
router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview,
    );

// Route for getting, updating, and deleting a specific review
router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview,
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview,
    );

module.exports = router;
