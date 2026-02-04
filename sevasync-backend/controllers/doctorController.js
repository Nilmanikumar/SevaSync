const Appointment = require('../models/Appointment');

// ================= DOCTOR DASHBOARD =================
exports.getTodayAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // today date in dd-mm-yyyy
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayDate = `${dd}-${mm}-${yyyy}`;

    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: todayDate
    }).sort({
      aiSeverityScore: -1,
      appointmentTime: 1
    });

    res.json({
      success: true,
      date: todayDate,
      total: appointments.length,
      appointments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= UPDATE APPOINTMENT STATUS =================
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body; // Approved | Rejected | Completed

    if (!["Approved", "Rejected", "Completed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notification: `Your appointment has been ${status}`
      },
      { new: true }
    );

    res.json({
      success: true,
      msg: "Appointment status updated",
      appointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
