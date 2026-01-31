const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      nic,
      dob,
      address,
      gender,
      role
    } = req.body;

    // 1. Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { nic }]
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'User with this Email or NIC already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      nic,
      dob,
      address,
      gender,
      role: role || 'patient'
    });

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      msg: 'Registration Successful',
      token,
      role: user.role
    });
  } catch (err) {
    console.error(err);

    // Duplicate key error
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ msg: 'User with this Email or NIC already exists' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        msg: "Request body missing. Send JSON."
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login Successful",
      token,
      role: user.role,
      name: user.name
    });
  } catch (err) {
    console.error(" LOGIN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};
