const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');





// ================= GET MY APPOINTMENTS =================

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      email: req.user.email   // patient-specific
    }).sort({ appointmentDate: -1 });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    const {
      patientName,
      phone,
      email,
      symptoms,
      appointmentDate,
      appointmentTime,
      predictedDepartment,
      aiSeverityScore,
      doctorId   // 👈 NEW
    } = req.body;

    if (!patientName || !phone || !symptoms || !appointmentDate || !appointmentTime || !doctorId) {
      return res.status(400).json({
        msg: "Required fields are missing"
      });
    }

    // Count queue for THIS doctor
    const patientsBefore = await Appointment.countDocuments({
      doctorId,
      status: "Pending"
    });

    const appointment = await Appointment.create({
      patientName,
      phone,
      email,
      symptoms,
      appointmentDate,
      appointmentTime,
      predictedDepartment,
      aiSeverityScore: aiSeverityScore || 2,
      doctorId
    });

    res.status(201).json({
      success: true,
      msg: "Appointment booked successfully",
      appointment,
      queueInfo: {
        patientsBefore,
        yourPosition: patientsBefore + 1,
        estimatedWaitTime: `${patientsBefore * 7} minutes`
      }
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



// ================= GET SPECIALITIES =================
exports.getSpecialities = async (req, res) => {
  try {
    const specialities = await Doctor.distinct("department");

    res.json({
      success: true,
      specialities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET DOCTORS BY SPECIALITY =================
exports.getDoctorsBySpeciality = async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ msg: "Department required" });
    }

    const doctors = await Doctor.find({ department });

    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET SPECIALITY FROM AI MODEL =================
// This controller ONLY sends symptoms to ML model
exports.getSpecialityFromAI = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ msg: "Symptoms are required" });
    }

    /*
      ML MODEL HANDLED BY TEAMMATE
      --------------------------------
      Input  : symptoms (string)
      Output : predictedSpeciality (string)
    */

    // Example response from ML service
    const predictedSpeciality = "Cardiology"; // from ML model

    res.json({
      success: true,
      predictedSpeciality,
      message: `Based on your symptoms, we recommend ${predictedSpeciality}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= DASHBOARD SUMMARY =================
exports.getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayDate = `${dd}-${mm}-${yyyy}`;

    // 1️⃣ Today’s appointment (latest)
    const todayAppointment = await Appointment.findOne({
      email: req.user.email,
      appointmentDate: todayDate
    }).sort({ appointmentTime: 1 });

    let queueInfo = null;

    if (todayAppointment) {
      const patientsBefore = await Appointment.countDocuments({
        status: "Pending",
        appointmentDate: todayDate
      });

      queueInfo = {
        patientsBefore,
        yourPosition: patientsBefore + 1,
        estimatedWaitTime: `${patientsBefore * 7} minutes`
      };
    }

    res.json({
      success: true,
      todayAppointment,
      queueInfo,
      aiSuggestion: todayAppointment?.predictedDepartment || null
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= GET NOTIFICATIONS =================
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Appointment.find({
      email: req.user.email,
      notification: { $exists: true }
    }).select("notification appointmentDate status");

    res.json({
      success: true,
      notifications
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
