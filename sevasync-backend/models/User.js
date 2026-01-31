const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    nic: {
      type: String,
      required: true,
      unique: true
    },
    dob: {
      type: Date,
      required: true
    },
    address: {
      type: String
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
