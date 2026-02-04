const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS CONFIG
app.use(cors({
  origin: "http://localhost:5173", // React frontend
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/doctor/auth", require("./routes/doctorAuthRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
