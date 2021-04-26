"use strict";

var mongoose = require('mongoose');

var dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});

var app = require('./app');

var DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(function (con) {
  console.log(con.connection);
  console.log('Connection successful');
})["catch"](function (err) {
  console.log('Error');
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server is listening at ".concat(port));
});