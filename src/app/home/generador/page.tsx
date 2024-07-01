'use client'
import React, { useEffect } from 'react';
import {auth} from '../../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const HomeGenerador = () => {
  const router = useRouter();

  const logOut = (() => {
    signOut(auth)
    .then(() => {
      router.replace("/")
    })
  })
  
  return (
    <div className='flex flex-col items-center justify-center gap-5 h-screen'>
      Home - Generador
      <button className="bg-white px-5 text-black" onClick={logOut}>Salir</button>
    </div>

    
  );
};

export default HomeGenerador;
