const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  consultationFee: {
    type: Number,
    required: true
  },

  availability: {
    type: String,
    default: "10:00 AM - 2:00 PM"
  },

  role: {
    type: String,
    default: "doctor"
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
