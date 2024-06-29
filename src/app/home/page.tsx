'use client'
import React, { useEffect, useState } from 'react';
import {auth} from '../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState({});

  const logOut = (() => {
    signOut(auth)
  })

  useEffect(() => {
    onAuthStateChanged(auth, (user) =>{
      if (user) {
        user.getIdToken().then( async (accessToken) => {
          setUser(user)
          console.log(user)
        })
      }
      else {
        router.push("/login")
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
      Home
      <button className="bg-white px-5 text-black" onClick={logOut}>Salir</button>
      </div>
    );
  }
};

export default Home;
