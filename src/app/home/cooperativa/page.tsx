'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@state/userProvider";
import PieChart from '@/components/PieChart';
import { Card, CardHeader, CardBody, Divider, CardFooter } from '@nextui-org/react';
import dynamic from 'next/dynamic'
import 'dotenv/config'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const HomeCooperativa = () => {
  const { user } = useUser();
  const router = useRouter();
  console.log(user)

  useEffect(() => {
    console.log("Estado del usuario en home:", user);
  }, [user]);

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
            <CardHeader className='bg-green-dark text-white'>Solicitudes abiertas: 10</CardHeader>
            <Divider />
            <CardBody>
              <div>
                <p>Listado de solicitudes abiertas del dia</p>
                <p>Listado de solicitudes abiertas del dia</p>
                <p>Listado de solicitudes abiertas del dia</p>
                <p>Listado de solicitudes abiertas del dia</p>
              </div>
            </CardBody>
          </Card>
          
          <Card className='flex-1'>
            <CardHeader className='bg-green-dark text-white'>Solicitudes aceptadas: 5</CardHeader>
            <Divider />
            <CardBody>
              <div>
                <p>Listado de solicitudes aceptadas del dia</p>
                <p>Listado de solicitudes aceptadas del dia</p>
                <p>Listado de solicitudes aceptadas del dia</p>
                <p>Listado de solicitudes aceptadas del dia</p>
              </div>
            </CardBody>
          </Card>
          
          <Card className='flex-1'>
            <CardHeader className='bg-green-dark text-white'>Camiones activos: 2</CardHeader>
            <Divider />
            <CardBody>
              <div>
                <p>Listado de camiones activos</p>
                <p>Listado de camiones activos</p>
                <p>Listado de camiones activos</p>
                <p>Listado de camiones activos</p>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className='flex flex-row items-center justify-center gap-5'>
          <Card className='flex flex-row justify-between items-center flex-1'>
            <div className='flex flex-col items-start p-4'>
              <h1 className='text-center'>Estadisticas de recolecciones</h1>
              <p>Materiales recibidos</p>
            </div>
            <PieChart />
          </Card>
          <div className='flex-1'>
            {/* TODO: Change center coordinate ; Add markers */}
            <MapView centerCoordinates={[-34.5814551, -58.4211107]}/>
          </div>
        </div>
      </div>
    );
  }
};

export default HomeCooperativa;