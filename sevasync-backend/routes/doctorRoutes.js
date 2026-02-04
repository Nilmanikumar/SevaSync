const express = require('express');
const router = express.Router();
const { getTodayAppointments,
     updateAppointmentStatus 

 } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { doctorProtect } = require('../middleware/doctorAuthMiddleware');

router.get('/dashboard/today', doctorProtect, getTodayAppointments);

router.patch(
  '/appointments/:id/status',
  doctorProtect,
  updateAppointmentStatus
);

module.exports = router;
