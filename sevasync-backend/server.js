const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));

app.use("/api/doctor/auth", require("./routes/doctorAuthRoutes"));


const Doctor = require('./models/Doctor');

// Seed doctors
app.post('/api/doctors/seed', async (req, res) => {
  try {
    await Doctor.insertMany(req.body);
    res.status(201).json({ msg: "Doctors added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Seva Sync Backend running on port ${PORT}`);
});
