import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import DocumentTitleManager from '../components/common/DocumentTitleManager';


import PublicLayout from '../layouts/PublicLayout';


import LandingPage from '../features/LandingPage';
import DoctorList from '../pages/public/DoctorList';
import DoctorProfile from '../features/DoctorProfile';
import BookAppointment from '../pages/public/BookAppointment';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';


import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';


import DoctorDashboard from '../pages/doctor/Dashboard';
import Schedule from '../pages/doctor/Schedule';


import PatientDashboard from '../pages/patient/Dashboard';
import ReceptionistDashboard from '../pages/receptionist/Dashboard';
import LabDashboard from '../pages/lab/Dashboard';


const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


const DashboardRedirect = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />;
    case 'receptionist':
      return <Navigate to="/receptionist/dashboard" replace />;
    case 'lab':
      return <Navigate to="/lab/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

const AppRouter = () => {
  return (
    <Router>
      <DocumentTitleManager />
      <Routes>
        
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="doctors" element={<DoctorList />} />
          <Route path="doctors/:id" element={<DoctorProfile />} />
          <Route path="book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="about" element={<div>About Page</div>} />
          <Route path="contact" element={<div>Contact Page</div>} />
        </Route>

        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

       
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } 
        />

        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="admin-dashboard-container">
              <Outlet />
            </div>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/manage-users" replace />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        
        <Route path="/doctor/*" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <div className="doctor-dashboard-container">
              <Outlet />
            </div>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>

        
        
        <Route path="/patient/*" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <div className="patient-dashboard-container">
              <Outlet />
            </div>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
        </Route>

        
        <Route path="/receptionist/*" element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <div className="receptionist-dashboard-container">
              <Outlet />
            </div>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/receptionist/dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionistDashboard />} />
        </Route>

        
        <Route path="/lab/*" element={
          <ProtectedRoute allowedRoles={['lab']}>
            <div className="lab-dashboard-container">
              <Outlet />
            </div>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/lab/dashboard" replace />} />
          <Route path="dashboard" element={<LabDashboard />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;