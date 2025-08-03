import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient', 'receptionist', 'lab'],
    default: 'patient'
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[+]?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: function() {
      return this.role === 'patient';
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() {
      return this.role === 'patient';
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profileImage: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  
  
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    }
  },
  licenseNumber: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    },
    unique: true,
    sparse: true
  },
  experience: {
    type: Number,
    required: function() {
      return this.role === 'doctor';
    }
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  consultationFee: {
    type: Number,
    required: function() {
      return this.role === 'doctor';
    }
  },
  bio: String,
  achievements: [String],
  languages: [String],
  

  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function() {
      return this.role === 'patient';
    }
  },
  allergies: [String],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      default: 'active'
    }
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  
  
  labName: {
    type: String,
    required: function() {
      return this.role === 'lab';
    }
  },
  labLicense: {
    type: String,
    required: function() {
      return this.role === 'lab';
    }
  },
  services: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


userSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }
  return null;
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ specialization: 1 });
userSchema.index({ isActive: 1 });


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

export default mongoose.model('User', userSchema);