'use client'
import React, { useEffect, useState } from 'react';
import {auth} from '../../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '@/state/userSessionSlice';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../state/userProvider';
import 'dotenv/config'

const HomeCooperativa = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();
  console.log(user)

  useEffect(() => {
    console.log("Estado del usuario en home:", user);
  }, [user]);

  const logOut = (() => {
    signOut(auth)
    .then(() => {
      dispatch(clearUserSession());
      router.replace("/")
    })
  })

  if(Object.keys(user).length == 0)
    return (
      <div className='flex flex-col items-center justify-center gap-5 h-screen'>
        Loading...
      </div>
  )
  else {
    return (
      <div className='flex flex-col items-center justify-center gap-5 h-screen'>
      Home
      <button className="bg-white px-5 text-black" onClick={logOut}>Salir</button>
      </div>
    );
  }
};

export default HomeCooperativa;
