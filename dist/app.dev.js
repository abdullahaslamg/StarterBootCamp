"use strict";

var express = require('express');

var morgan = require('morgan');

var tourRouter = require('./routes/tourRouter');

var userRouter = require('./routes/userRouter');

var app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express["static"]("".concat(__dirname, "/public")));
app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(function (req, res, next) {
  console.log('Hello from the middle ware');
  next();
});
app.get('/', function (req, res) {
  res.json({
    message: 'Hello Welcome in natrous',
    name: 'Natrous project'
  });
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.post('/', function (req, res) {
  res.send('You can post to this end point');
});
module.exports = app;