import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboard/stats/:role
// @desc    Get dashboard stats for a specific role
// @access  Private
router.get('/stats/:role', authenticate, async (req, res) => {
  try {
    const { role } = req.params;
    
    // Check if user is authorized to view stats for this role
    if (req.user.role !== 'admin' && req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these stats'
      });
    }

    let stats = {};

    switch (role) {
      case 'admin':
        // Admin stats
        const totalUsers = await User.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
        
        stats = {
          totalUsers,
          totalAppointments,
          pendingAppointments,
          confirmedAppointments
        };
        break;
        
      case 'doctor':
        // Doctor stats
        const doctorAppointments = await Appointment.countDocuments({ doctor: req.user._id });
        const todayAppointments = await Appointment.countDocuments({
          doctor: req.user._id,
          appointmentDate: {
            $gte: new Date().setHours(0, 0, 0, 0),
            $lt: new Date().setHours(23, 59, 59, 999)
          }
        });
        const completedAppointments = await Appointment.countDocuments({
          doctor: req.user._id,
          status: 'completed'
        });
        
        stats = {
          totalAppointments: doctorAppointments,
          todayAppointments,
          completedAppointments
        };
        break;
        
      case 'patient':
        // Patient stats
        const patientAppointments = await Appointment.countDocuments({ patient: req.user._id });
        const upcomingAppointments = await Appointment.countDocuments({
          patient: req.user._id,
          appointmentDate: { $gte: new Date() },
          status: { $in: ['pending', 'confirmed'] }
        });
        const pastAppointments = await Appointment.countDocuments({
          patient: req.user._id,
          appointmentDate: { $lt: new Date() }
        });
        
        stats = {
          totalAppointments: patientAppointments,
          upcomingAppointments,
          pastAppointments
        };
        break;
        
      case 'receptionist':
        // Receptionist stats
        const todayAppointmentsReception = await Appointment.countDocuments({
          appointmentDate: {
            $gte: new Date().setHours(0, 0, 0, 0),
            $lt: new Date().setHours(23, 59, 59, 999)
          }
        });
        const pendingAppointmentsReception = await Appointment.countDocuments({ status: 'pending' });
        const confirmedAppointmentsReception = await Appointment.countDocuments({ status: 'confirmed' });
        
        stats = {
          todayAppointments: todayAppointmentsReception,
          pendingAppointments: pendingAppointmentsReception,
          confirmedAppointments: confirmedAppointmentsReception
        };
        break;
        
      case 'lab':
        // Lab stats
        const pendingLabTests = await Appointment.countDocuments({
          'labTests.status': 'pending'
        });
        const completedLabTests = await Appointment.countDocuments({
          'labTests.status': 'completed'
        });
        
        stats = {
          pendingTests: pendingLabTests,
          completedTests: completedLabTests
        };
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
    }

    res.json({
      success: true,
      role,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/activity/:role
// @desc    Get recent activity for a specific role
// @access  Private
router.get('/activity/:role', authenticate, async (req, res) => {
  try {
    const { role } = req.params;
    
    // Check if user is authorized to view activity for this role
    if (req.user.role !== 'admin' && req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this activity'
      });
    }

    let activity = [];

    switch (role) {
      case 'admin':
        // Admin activity - recent appointments and user registrations
        const recentAppointments = await Appointment.find()
          .populate('patient', 'name')
          .populate('doctor', 'name')
          .sort({ createdAt: -1 })
          .limit(10);
          
        const recentUsers = await User.find()
          .select('name email role createdAt')
          .sort({ createdAt: -1 })
          .limit(10);
          
        activity = [
          ...recentAppointments.map(app => ({
            type: 'appointment',
            id: app._id,
            title: `Appointment: ${app.patient.name} with Dr. ${app.doctor.name}`,
            date: app.createdAt,
            status: app.status
          })),
          ...recentUsers.map(user => ({
            type: 'user',
            id: user._id,
            title: `New ${user.role}: ${user.name}`,
            date: user.createdAt
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10);
        break;
        
      case 'doctor':
        // Doctor activity - recent appointments
        activity = await Appointment.find({ doctor: req.user._id })
          .populate('patient', 'name')
          .sort({ createdAt: -1 })
          .limit(10);
        break;
        
      case 'patient':
        // Patient activity - recent appointments
        activity = await Appointment.find({ patient: req.user._id })
          .populate('doctor', 'name specialization')
          .sort({ createdAt: -1 })
          .limit(10);
        break;
        
      default:
        activity = [];
    }

    res.json({
      success: true,
      role,
      activity
    });
  } catch (error) {
    console.error('Error fetching dashboard activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard activity',
      error: error.message
    });
  }
});

export default router;
