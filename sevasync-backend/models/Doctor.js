const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  consultationFee: { type: Number, required: true },
  availability: { type: String, default: "10:00 AM - 2:00 PM" }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
