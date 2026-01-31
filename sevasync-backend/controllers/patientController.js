const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// ================= TRIAGE & FIND DOCTORS =================
exports.triageAndFindDoctors = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ msg: "Symptoms are required" });
    }

    // ---- MOCK AI LOGIC ----
    let dept = "General Medicine";
    let urgency = "Normal";

    const s = symptoms.toLowerCase();

    if (s.includes('chest') || s.includes('heart')) {
      dept = "Cardiology";
      urgency = "High";
    } else if (s.includes('bone') || s.includes('fracture')) {
      dept = "Orthopedics";
    } else if (s.includes('skin') || s.includes('rash')) {
      dept = "Dermatology";
    }

    const doctors = await Doctor.find({ department: dept });

    res.json({
      success: true,
      triageResult: {
        department: dept,
        urgency,
        message: `Based on your symptoms, we recommend ${dept}`
      },
      doctors
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= BOOK APPOINTMENT =================
exports.bookAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      predictedDepartment: req.body.predictedDepartment || "General Medicine",
      aiSeverityScore: 2
    });

    res.status(201).json({
      success: true,
      msg: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET QUEUE =================
exports.getQueue = async (req, res) => {
  try {
    const queue = await Appointment.find({ status: "Pending" })
      .populate("doctorId", "name department");

    res.json({ success: true, queue });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
