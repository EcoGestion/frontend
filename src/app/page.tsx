'use client'
import React, { useEffect } from 'react';
import {auth} from './firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const InitialPage = () => {
  const router = useRouter();

  const handleLogInTypeSelection = ((userType) => {
    router.push('/login/' + userType);
  })

  return (
    <div className='flex flex-col items-center justify-center gap-5 h-screen bg-white'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>Bienvenido al sistema EcoGestion</h1>
      <p className='text-lg text-gray-600 mb-6'>Por favor, seleccione su tipo de usuario:</p>
      <div className='flex gap-4'>
        <button 
          className="bg-[rgb(57,194,99)] hover:bg-[rgb(50,175,89)] text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300" 
          onClick={() => handleLogInTypeSelection('cooperativa')}
        >
          Cooperativa
        </button>
        <button 
          className="bg-[rgb(76,200,230)] hover:bg-[rgb(68,180,207)] text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300" 
          onClick={() => handleLogInTypeSelection('generador')}
        >
          Generador
        </button>
      </div>
    </div>
  );
};

export default InitialPage;
