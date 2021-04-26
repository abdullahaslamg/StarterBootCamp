"use strict";

var fs = require('fs');

var tours = JSON.parse(fs.readFileSync("".concat(__dirname, "/../dev-data/data/tours-simple.json"))); // Get all tours

exports.checkID = function (req, res, next, value) {
  console.log("Tour id id ".concat(value));

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Page Not Found'
    });
  }

  next();
};

exports.getAllTour = function (req, res) {
  res.status(200).json({
    status: 'success',
    requested: req.requestTime,
    length: tours.length,
    data: {
      tours: tours
    }
  });
}; //  Get one tour


exports.getTour = function (req, res) {
  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: {
      tours: tours
    }
  });
}; // Create a new tour


exports.createTour = function (req, res) {
  var newId = tours[tours.length - 1].id + 1;
  var newTour = Object.assign({
    id: newId
  }, req.body);
  tours.push(newTour);
  fs.writeFile("".concat(__dirname, "/dev-data/data/tours-simple.json"), JSON.stringify(tours), function (err) {
    res.status(200).json({
      status: 'success',
      data: {
        tours: newTour
      }
    });
  });
}; // Update a tour


exports.updateTour = function (req, res) {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
}; // Delete a tours


exports.deletTour = function (req, res) {
  res.status(204).json({
    status: 'success',
    data: null
  });
};