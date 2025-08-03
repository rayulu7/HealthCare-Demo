import React from 'react';
import Navbar from '../components/common/Navbar';

const DoctorLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default DoctorLayout;
