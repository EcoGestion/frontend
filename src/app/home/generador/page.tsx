'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react'
import { getGeneratorHomeStats } from '@api/apiService';
import { GenHomeStats } from '@/types';
import Spinner from '@/components/Spinner';
import 'dotenv/config'

const HomeGenerador = () => {
  const [loadingStats, setLoadingStats] = useState(true);
  const userSession = useSelector((state: RootState) => state.userSession);
  const [homeStats, setHomeStats] = useState<GenHomeStats | null>(null);

  useEffect(() => {
    const getHomeStats = async () => {
      const response = await getGeneratorHomeStats(userSession.userId);
      setHomeStats(response);
      setLoadingStats(false);
    }
    getHomeStats();
  }, [])

  return (
    <div className='flex flex-col p-4 gap-5 h-screen'>
      {loadingStats && <Spinner />}
      {!loadingStats &&
        <div className='flex flex-row items-start gap-2'>
        <Card className='flex-1'>
          <CardHeader className='bg-green-dark text-white min-h-16'>Solicitudes no coordinadas: {homeStats?.open}</CardHeader>
        </Card>
        
        <Card className='flex-1'>
          <CardHeader className='bg-green-dark text-white min-h-16'>Solicitudes pendientes de recolección: {homeStats?.pending}</CardHeader>
        </Card>
        
        <Card className='flex-1 p-0'>
          <CardHeader className='bg-green-dark text-white min-h-16'>Solicitudes  completadas: {homeStats?.completed}</CardHeader>
        </Card>
      </div>
      }
      
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
};

export default HomeGenerador;
