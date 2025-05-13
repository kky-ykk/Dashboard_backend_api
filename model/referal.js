// models/User.js

const mongoose = require('mongoose');

const referSchema = new mongoose.Schema({

  refer: {
    type: Number,
    required: true,
  }

}, {
  timestamps: true
});

const Referal = mongoose.model('Refer', referSchema);

module.exports = Referal;
