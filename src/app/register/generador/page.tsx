'use client'
import React, { useEffect } from 'react';
import {auth} from '../../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// /register/generador

const RegisterGenerador = () => {
  const router = useRouter();

  const handleBack = () => {
    // Redirigir a la página anterior
    router.back();
  };

  return (
    <div className='flex flex-col items-center justify-center gap-5 h-screen'>
      Registro de generador
      <button 
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 mt-4" 
            onClick={handleBack}
          >
          Volver
      </button>
    </div>

    
  );
};

export default RegisterGenerador;
