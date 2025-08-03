import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/schedule/doctor/:doctorId
// @desc    Get doctor's schedule
// @access  Public
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.doctorId);
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // This is a simplified implementation
    // In a real app, you would have a separate Schedule model
    const schedule = {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: null, end: null } // Off day
    };

    res.json({
      success: true,
      schedule
    });
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule',
      error: error.message
    });
  }
});

// @route   GET /api/schedule/available/:doctorId/:date
// @desc    Get available time slots for a doctor on a specific date
// @access  Public
router.get('/available/:doctorId/:date', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.doctorId);
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(req.params.date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // This is a simplified implementation
    // In a real app, you would check against existing appointments
    const availableSlots = [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '11:30', endTime: '12:00' },
      { startTime: '13:00', endTime: '13:30' },
      { startTime: '13:30', endTime: '14:00' },
      { startTime: '14:00', endTime: '14:30' },
      { startTime: '14:30', endTime: '15:00' },
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' },
      { startTime: '16:00', endTime: '16:30' },
      { startTime: '16:30', endTime: '17:00' }
    ];

    res.json({
      success: true,
      date: req.params.date,
      availableSlots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
});

// @route   PUT /api/schedule
// @desc    Update doctor's schedule (doctor only)
// @access  Private
router.put('/', authenticate, [
  body('schedule').isObject().withMessage('Schedule is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update schedule'
      });
    }

    // This is a simplified implementation
    // In a real app, you would update a separate Schedule model
    const { schedule } = req.body;
    
    // Update user's schedule in the database
    await User.findByIdAndUpdate(req.user._id, { schedule });

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: error.message
    });
  }
});

export default router;
