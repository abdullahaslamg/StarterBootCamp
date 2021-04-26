const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const AppError = require('./utilis/appError')
const globalErrorHandler = require('./controller/errorController')

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use((req, res, next) => {
//   console.log('Hello from the middle ware');
//   next();
// });

app.get('/', (req, res) => {
  res.json({ message: 'Hello Welcome in natrous', name: 'Natrous project' });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.post('/', (req, res) => {
  res.send('You can post to this end point');
});

app.all('*', (req, res, next) => {
  // res.status(400).json({
  //   status: 'fail',
  //   message: `Cannot find ${req.originalUrl} on this server`
  // })

  // const err = new Error (`Cannot find ${req.originalUrl} on this server`)
  // err.status = 'fail'
  // err.statusCode = '404'

  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler)

module.exports = app;
