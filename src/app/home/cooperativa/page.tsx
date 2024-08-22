'use client'
import React, { useEffect, useState } from 'react';
import {auth} from '../../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '@/state/userSessionSlice';
import { useRouter } from 'next/navigation';
import 'dotenv/config'

const HomeCooperativa = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [response, setResponse] = useState("");
  const backendUrl = process.env.BACKEND_URL || "https://ecogestion-backend.onrender.com"

  const logOut = (() => {
    signOut(auth)
    .then(() => {
      dispatch(clearUserSession());
      router.replace("/")
    })
  })

  const testBackend = () => {
    const params = {
      headers: {
        "Authorization": accessToken,
      },
      method: "GET"
    }

    fetch(backendUrl+"/test", params)
    .then(res => res.json()) 
    .then(data => 
      console.log(data))
    .catch(error => 
      console.log(error))

  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) =>{
      if (user) {
        user.getIdToken().then( async (accessToken) => {
          setUser(user)
          setAccessToken(accessToken)
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
      <button className="bg-white px-5 text-black" onClick= {testBackend}>Test backend</button>
      {response}
      <button className="bg-white px-5 text-black" onClick={logOut}>Salir</button>
      </div>
    );
  }
};

export default HomeCooperativa;
