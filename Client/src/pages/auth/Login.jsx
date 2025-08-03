import React from 'react';
import LoginForm from '../../components/Auth/LoginForm';


const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;