export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  RECEPTIONIST: 'receptionist',
  LAB: 'lab',
};

export const PERMISSIONS = {
  
  MANAGE_USERS: 'manage_users',
  MANAGE_DOCTORS: 'manage_doctors',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SYSTEM: 'manage_system',

  
  MANAGE_SCHEDULE: 'manage_schedule',
  VIEW_PATIENT_RECORDS: 'view_patient_records',
  MANAGE_APPOINTMENTS_DOCTOR: 'manage_appointments_doctor',
  WRITE_PRESCRIPTIONS: 'write_prescriptions',

 
  BOOK_APPOINTMENTS: 'book_appointments',
  VIEW_OWN_RECORDS: 'view_own_records',
  MANAGE_PROFILE: 'manage_profile',

 
  MANAGE_APPOINTMENTS_RECEPTION: 'manage_appointments_reception',
  VIEW_PATIENT_BASIC_INFO: 'view_patient_basic_info',
  MANAGE_SCHEDULING: 'manage_scheduling',

 
  VIEW_LAB_REQUESTS: 'view_lab_requests',
  UPLOAD_LAB_RESULTS: 'upload_lab_results',
  MANAGE_LAB_QUEUE: 'manage_lab_queue',
};

const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_DOCTORS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_SYSTEM,
  ],
  [ROLES.DOCTOR]: [
    PERMISSIONS.MANAGE_SCHEDULE,
    PERMISSIONS.VIEW_PATIENT_RECORDS,
    PERMISSIONS.MANAGE_APPOINTMENTS_DOCTOR,
    PERMISSIONS.WRITE_PRESCRIPTIONS,
  ],
  [ROLES.PATIENT]: [
    PERMISSIONS.BOOK_APPOINTMENTS,
    PERMISSIONS.VIEW_OWN_RECORDS,
    PERMISSIONS.MANAGE_PROFILE,
  ],
  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.MANAGE_APPOINTMENTS_RECEPTION,
    PERMISSIONS.VIEW_PATIENT_BASIC_INFO,
    PERMISSIONS.MANAGE_SCHEDULING,
  ],
  [ROLES.LAB]: [
    PERMISSIONS.VIEW_LAB_REQUESTS,
    PERMISSIONS.UPLOAD_LAB_RESULTS,
    PERMISSIONS.MANAGE_LAB_QUEUE,
  ],
};

export const hasPermission = (userRole, permission) => {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const canAccessRoute = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};