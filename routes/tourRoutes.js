const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

//router.param('id', tourController.checkID); -> used for tourControllerJson.js

// alias the route

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  // post(tourController.checkBody, tourController.createTour); -> used for tourControllerJson.js
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.editTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
