const mongoose = require('mongoose');
const slugify = require('slugify')

const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal to 40 charactes'],
    minlength: [10, 'A tour must have less or equal to 10 charactes'],
    // validate: [validator.isAlpha, 'Tour name must contain only characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maximum group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty must be either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.6,
    min: [1, 'Rating must be 1 or above'],
    max: [5, 'Rating must be 5 or above']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,

    validate: {
      validator: function(val) {
        return val < this.price
      },
      message: 'Discount price must be less than original price'
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration/7;
})

//DOCUMENT MIDDLEWARE
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next();
})

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({secretTour: {$ne: true}})
  this.start = Date.now();
  next();
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} millisecons`)
  next();
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
  next();
})
// tourSchema.pre('save', function(next) {
//   console.log('Will save documents')
//   next();
// })

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;


