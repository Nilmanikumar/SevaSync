const express = require('express');
const router = express.Router();

const {
  triageAndFindDoctors,
  bookAppointment,
  getQueue ,
  getMyAppointments,
  getSpecialities,
  getDoctorsBySpeciality,
  getSpecialityFromAI,
  getDashboardSummary ,
  getNotifications

} = require('../controllers/patientController');

const { protect } = require('../middleware/authMiddleware');

router.post('/triage', protect, triageAndFindDoctors);
router.post('/book', protect, bookAppointment);
router.get('/queue', protect, getQueue);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/specialities', protect, getSpecialities);
router.get('/doctors', protect, getDoctorsBySpeciality);
router.post('/ai/speciality', protect, getSpecialityFromAI);
router.get('/dashboard-summary', protect, getDashboardSummary);
router.get('/notifications', protect, getNotifications);




// router.get('/my-appointments', protect, getMyAppointments);
// router.get('/specialities', protect, getSpecialities);
// router.get('/doctors', protect, getDoctorsBySpeciality);
// //router.post('/book', protect, bookAppointment);
// router.post('/ai/speciality', protect, getSpecialityFromAI);





module.exports = router;
