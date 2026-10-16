import React from 'react';
import { RegisterForm } from '../../components/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
