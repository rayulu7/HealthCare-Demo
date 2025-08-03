import React from 'react';

const ReceptionistDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Receptionist Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
          <p>View and manage today's appointments</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Patient Registration</h2>
          <p>Register new patients</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Appointment Scheduling</h2>
          <p>Schedule appointments for patients</p>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
