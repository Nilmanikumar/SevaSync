const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },

  symptoms: { type: String, required: true },

  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },

  predictedDepartment: { type: String },
  aiSeverityScore: { type: Number },

  // Selected doctor
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },

  status: {
    type: String,
    default: 'Pending'
  },

  notification: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
