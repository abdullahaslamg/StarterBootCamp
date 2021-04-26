"use strict";

var express = require('express');

var router = express.Router();

var tourController = require('./../controller/tourController');

router.param('id', tourController.checkID);
router.route('/').get(tourController.getAllTour).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour)["delete"](tourController.deletTour);
module.exports = router;