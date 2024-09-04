'use client'
import React, { useEffect, useState } from 'react';
import {auth} from '../../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '@/state/userSessionSlice';
import { useRouter } from 'next/navigation';
import 'dotenv/config'

const HomeGenerador = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");

  const logOut = (() => {
    signOut(auth)
    .then(() => {
      dispatch(clearUserSession());
      router.replace("/")
    })
  })

  useEffect(() => {
    onAuthStateChanged(auth, (user) =>{
      if (user) {
        user.getIdToken().then( async (accessToken) => {
          setUser(user)
          setAccessToken(accessToken)
        })
      }
      else {
        router.replace("/")
      }
    });
  }, [])

  if(Object.keys(user).length == 0)
    return (
      <div className='flex flex-col items-center justify-center gap-5 h-screen'>
        Loading...
      </div>
  )
  else {
    return (
      <div className='flex flex-col items-center justify-center gap-5 h-screen'>
      Home Generador
      <button className="bg-white px-5 text-black" onClick={logOut}>Salir</button>
      </div>
    );
  }
};

export default HomeGenerador;
