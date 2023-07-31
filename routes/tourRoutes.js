const express = require('express');

const tourController = require('../controllers/tourController');
const router = express.Router();

//router.param('id', tourController.checkID); -> used for tourControllerJson.js

router
  .route('/')
  .get(tourController.getAllTours)
  // post(tourController.checkBody, tourController.createTour); -> used for tourControllerJson.js
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.editTour)
  .delete(tourController.deleteTour);

module.exports = router;
