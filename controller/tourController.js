const Tour = require('../models/tourModel');
const catchAsync = require('./../utilis/catchAsync')
const APIFeatures = require('./../utilis/apiFeatures');
const AppError = require('../utilis/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
}

// APIFeatuers(Tour.find(), req.query)

// exports.getAllTour = async (req, res) => {
//   try {
//     const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitingFields()
//     .paginate();
//     const tours = await features.query;

//     // Sending response to server
//     res.status(200).json({
//       status: 'success',
//       result: tours.length,
//       requested: req.requestTime,
//       data: {
//         tours
//       }
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'Error at sending',
//       message: err
//     });
//   }, next
// };

exports.getAllTour = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
});

//  Get one tour
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if(!tour) {
      return next(new AppError('No tour find with ID', 404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
});



// Create a new tour
exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  
  if(!tour) {
    return next(new AppError('No tour find with ID', 404))
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  });
});

// Update a tour
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if(!tour) {
      return next(new AppError('No tour find with ID', 404))
    }
    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
});

// Delete a tours
exports.deletTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if(!tour) {
      return next(new AppError('No tour find with ID', 404))
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
});

// Get tours statisists function
exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingAverage: { $gte: 4.5 }
        }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numQuantity: { $sum: '$ratingQuantity' },
          numRatings: { $sum: '$ratingAverage' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' }
        }
      },
      {
        $sort: { avgPrice: -1 }
      },
      {
        $limit: 6
      }
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats
      }
    });
});

// Get tours monthly plan function
exports.getMontlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: {
          numTourStarts: -1
        }
      }
    ]);
    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: {
        plan
      }
    });
});
