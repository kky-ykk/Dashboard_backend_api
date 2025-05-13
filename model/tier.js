// models/Tier.js

const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // endPrice: {
  //   type: Number,
  //   required: true,
  //   min: 0,
  //   validate: {
  //     validator: function(value) {
  //       return value >= this.startPrice;
  //     },
  //     message: 'End price must be greater than or equal to start price.'
  //   }
  // },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after start date.'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Tier = mongoose.model('Tier', tierSchema);

module.exports = Tier;
