const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

exports.doctorProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer")) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await Doctor.findById(decoded.id).select("-password");

    if (!doctor) {
      return res.status(401).json({ msg: "Doctor not authorized" });
    }

    req.user = doctor; // 👈 doctor stored here
    next();

  } catch (error) {
    res.status(401).json({ msg: "Token invalid" });
  }
};
