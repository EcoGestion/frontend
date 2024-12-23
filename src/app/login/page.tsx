'use client'
import React, { useEffect } from 'react';
import {auth} from '../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import GreenRoundedButton from '../../components/greenRoundedButton';
import BlueRoundedButton from '../../components/blueRoundedButton';

const InitialPage = () => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const router = useRouter();

  const handleBack = () => {
    // Redirigir a la página anterior
    //router.back();
    router.push('/');
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ToDo: Enviar a home de cada tipo de usuario -> Cambiar estado a persistente
        //router.push('/home/' + userType);
      }
    });
  }, []);

  const handleLogInTypeSelection = ((userType:string) => {
    router.push('/login/' + userType);
  })

  return (
    
      <div className='flex flex-col items-center justify-center gap-5 h-screen bg-white'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4 text-center'>Bienvenido al sistema EcoGestion</h1>
        <p className='text-lg text-gray-600 mb-6'>Por favor, seleccione su tipo de usuario:</p>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-row gap-2'>
            
            <button className="bg-green-dark hover:bg-green-light border-green-dark hover:border-green-light text-white py-2 px-3 rounded-medium border-medium shadow-md transition duration-300"
              onClick={() => handleLogInTypeSelection('cooperativa')}
              >
              Cooperativa
            </button>
            
            <button className="bg-cyan-800 hover:bg-cyan-300 border-cyan-800 hover:border-cyan-300 text-white py-2 px-3 rounded-medium border-medium shadow-md transition duration-300"
              onClick={() => handleLogInTypeSelection('conductor')}
              >
              Conductor
            </button>
            
          </div>
          <div className='flex justify-center'>
          <button 
            type='button'
            className="bg-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-6 rounded-medium shadow-md transition duration-300 mt-4" 
            onClick={handleBack}
          >
            Volver
          </button>
          </div>
        </div>
      </div>
    
  );
};

export default InitialPage;
