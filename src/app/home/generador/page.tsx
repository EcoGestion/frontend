'use client'
import React, { useEffect, useState } from 'react';
import {auth} from '../../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '@/state/userSessionSlice';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react'
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
      <div className='flex flex-col p-4 gap-5 h-screen'>
        <div className='flex flex-row items-start gap-2'>
          <Card className='flex-1'>
            <CardHeader className='bg-green-dark text-white min-h-16'>Solicitudes activas: 2</CardHeader>
          </Card>
          
          <Card className='flex-1'>
            <CardHeader className='bg-green-dark text-white min-h-16'>Solicitudes completadas: 5</CardHeader>
          </Card>
          
          <Card className='flex-1 p-0'>
            <CardHeader className='bg-green-dark text-white min-h-16'>Solicitudes  pendientes: 2</CardHeader>
          </Card>
        </div>
        <div className='flex flex-col justify-center gap-3 w-full'>
          <h1 className='text-2xl justify-start'>Novedades</h1>
          <div className='flex flex-col gap-2'>
          <Card className='flex flex-col justify-between items-center flex-1'>
            <CardBody>¡Su recolección se realizará el dia de hoy!</CardBody>
            <Divider/>
            <CardFooter>Fecha: 10-09-2024 | Hora: 08:00</CardFooter>
          </Card>

          <Card className='flex flex-col justify-between items-center flex-1'>
            <CardBody>¡Su recolección se realizó con exito!</CardBody>
            <Divider/>
            <CardFooter>Fecha: 20-08-2024 | Hora: 13:36</CardFooter>
          </Card>

          <Card className='flex flex-col justify-between items-center flex-1'>
            <CardBody>¡Usted es el proximo destino de la cooperativa!</CardBody>
            <Divider/>
            <CardFooter>Fecha: 20-08-2024 | Hora: 13:02</CardFooter>
          </Card>

          <Card className='flex flex-col justify-between items-center flex-1'>
          <CardBody>¡Su recolección se realizará el dia de hoy!</CardBody>
            <Divider/>
            <CardFooter>Fecha: 20-08-2024 | Hora: 08:00</CardFooter>
          </Card>
          </div>
        </div>
      </div>
    );
  }
};

export default HomeGenerador;
