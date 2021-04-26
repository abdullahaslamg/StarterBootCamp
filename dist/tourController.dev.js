"use strict";

var fs = require('fs');

var tours = JSON.parse(fs.readFileSync("".concat(__dirname, "/../dev-data/data/tours-simple.json"))); // Get all tours

var getAllTour = function getAllTour(req, res) {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requested: req.requestTime,
    length: tours.length,
    data: {
      tours: tours
    }
  });
}; //  Get one tour


var getTour = function getTour(req, res) {
  console.log(req.params);
  var id = req.params.id * 1;
  var tour = tours.find(function (el) {
    return el.id === id;
  }); // if(id > tours.length) {

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Page Not Found'
    });
  }

  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: {
      tour: tour
    }
  });
}; // Create a new tour


var createTour = function createTour(req, res) {
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


var updateTour = function updateTour(req, res) {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Page Not Found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
}; // Delete a tours


var deletTour = function deletTour(req, res) {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Page Not Found'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};