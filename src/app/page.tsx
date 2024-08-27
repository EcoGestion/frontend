'use client'
import React, { useEffect } from 'react';
import {auth} from './firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import GreenRoundedButton from '../components/greenRoundedButton';
import BlueRoundedButton from '../components/blueRoundedButton';
import RootLayout from './layout';

const InitialPage = () => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const router = useRouter();

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
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>Bienvenido al sistema EcoGestion</h1>
        <p className='text-lg text-gray-600 mb-6'>Por favor, seleccione su tipo de usuario:</p>
        <div className='flex gap-4'>
          <GreenRoundedButton
            onClick={() => handleLogInTypeSelection('cooperativa')}
            buttonTitle='Cooperativa'
          />
          <BlueRoundedButton
            onClick={() => handleLogInTypeSelection('generador')}
            buttonTitle='Generador'
          />
        </div>
      </div>
    
  );
};

export default InitialPage;
