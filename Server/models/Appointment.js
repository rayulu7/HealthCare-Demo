import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine-checkup'],
    default: 'consultation'
  },
  reason: {
    type: String,
    required: true,
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  symptoms: [String],
  notes: {
    patient: String,
    doctor: String,
    reception: String
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    advice: String,
    followUpDate: Date
  },
  labTests: [{
    test: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    },
    results: String,
    resultDate: Date
  }],
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'online'],
      default: 'cash'
    },
    transactionId: String,
    paidAt: Date
  },
  duration: {
    estimated: {
      type: Number,
      default: 30 
    },
    actual: Number
  },
  rating: {
    patientRating: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String,
      ratedAt: Date
    },
    doctorRating: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String,
      ratedAt: Date
    }
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  cancellationReason: String,
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  isFollowUp: {
    type: Boolean,
    default: false
  },
  parentAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });


appointmentSchema.virtual('endTime').get(function() {
  if (this.appointmentDate && this.timeSlot.startTime) {
    const startTime = new Date(this.appointmentDate);
    const [hours, minutes] = this.timeSlot.startTime.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes));
    
    const duration = this.duration.estimated || 30;
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    return endTime.toTimeString().slice(0, 5);
  }
  return null;
});


appointmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.duration.estimated) {
    try {
      
      const { predictAppointmentDuration } = await import('../services/mlService.js');
      
      const predictedDuration = await predictAppointmentDuration({
        type: this.type,
        reason: this.reason,
        symptoms: this.symptoms,
        isFollowUp: this.isFollowUp
      });
      
      this.duration.estimated = predictedDuration;
    } catch (error) {
      console.log('ML prediction failed, using default duration:', error.message);
      this.duration.estimated = 30; 
    }
  }
  next();
});


appointmentSchema.statics.checkConflict = async function(doctorId, appointmentDate, timeSlot, excludeId = null) {
  const query = {
    doctor: doctorId,
    appointmentDate: appointmentDate,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        'timeSlot.startTime': { $lt: timeSlot.endTime },
        'timeSlot.endTime': { $gt: timeSlot.startTime }
      }
    ]
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflictingAppointment = await this.findOne(query);
  return !!conflictingAppointment;
};

export default mongoose.model('Appointment', appointmentSchema);