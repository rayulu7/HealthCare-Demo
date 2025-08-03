import express from 'express';
import { body, validationResult } from 'express-validator';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();


router.get('/', authenticate, async (req, res) => {
  try {
    let appointments;
    
  
    if (req.user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('patient', 'name email phone')
        .populate('doctor', 'name email specialization');
    } else {
    
      appointments = await Appointment.find({
        $or: [
          { patient: req.user._id },
          { doctor: req.user._id }
        ]
      })
        .populate('patient', 'name email phone')
        .populate('doctor', 'name email specialization');
    }

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});


router.get('/my', authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization profileImage')
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});


router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization profileImage');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

   
    if (req.user.role !== 'admin' && 
        appointment.patient._id.toString() !== req.user._id.toString() && 
        appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
});


router.post('/', [
  body('patientName').trim().isLength({ min: 2 }).withMessage('Patient name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('phone').matches(/^[+]?[\d\s\-\(\)]{10,}$/).withMessage('Please enter a valid phone number'),
  body('doctor').isMongoId().withMessage('Doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('timeSlot').isObject().withMessage('Time slot is required'),
  body('timeSlot.startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required'),
  body('timeSlot.endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required'),
  body('reason').trim().isLength({ min: 5 }).withMessage('Reason for visit is required')
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

    const { patientName, email, phone, doctor, appointmentDate, timeSlot, reason } = req.body;

    
    const doctorExists = await User.findById(doctor);
    if (!doctorExists || doctorExists.role !== 'doctor') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor'
      });
    }

   
    const conflict = await Appointment.checkConflict(doctor, appointmentDate, timeSlot);
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

   
    const appointment = new Appointment({
      patientName,
      email,
      phone,
      doctor,
      appointmentDate,
      timeSlot,
      reason
    });

    await appointment.save();

   
    await appointment.populate('doctor', 'name specialization profileImage');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
});


router.put('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

   
    if (req.user.role !== 'admin' && 
        appointment.patient.toString() !== req.user._id.toString() && 
        appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'notes', 'prescription', 'labTests'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates'
      });
    }

    updates.forEach(update => appointment[update] = req.body[update]);
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
});


router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    
    if (req.user.role !== 'admin' && 
        appointment.patient.toString() !== req.user._id.toString() && 
        appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user._id;
    appointment.cancelledAt = new Date();
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
});


router.patch('/:id/confirm', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    
    if (req.user.role !== 'admin' && 
        req.user.role !== 'receptionist' && 
        appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this appointment'
      });
    }

   
    if (appointment.status === 'confirmed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be confirmed'
      });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment confirmed successfully',
      appointment
    });
  } catch (error) {
    console.error('Error confirming appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm appointment',
      error: error.message
    });
  }
});

export default router;
