const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= DOCTOR SIGNUP =================
exports.registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      consultationFee,
      availability
    } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ msg: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      department,
      consultationFee,
      availability
    });

    const token = jwt.sign(
      { id: doctor._id, role: doctor.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      msg: "Doctor Registered Successfully",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        department: doctor.department
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DOCTOR LOGIN =================
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: doctor._id, role: doctor.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login Successful",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        department: doctor.department
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
