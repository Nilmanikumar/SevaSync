const express = require('express');
const router = express.Router();

const {
  triageAndFindDoctors,
  bookAppointment,
  getQueue
} = require('../controllers/patientController');

const { protect } = require('../middleware/authMiddleware');

router.post('/triage', protect, triageAndFindDoctors);
router.post('/book', protect, bookAppointment);
router.get('/queue', protect, getQueue);

module.exports = router;
