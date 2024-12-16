'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react'
import { getGeneratorHomeStats, getGeneratorNotifications } from '@api/apiService';
import { GenHomeStats, Notifications } from '@/types';
import Spinner from '@/components/Spinner';
import { formatDate, formatTime } from '@/utils/dateStringFormat';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import 'dotenv/config'

const HomeGenerador = () => {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  const userSession = useSelector((state: RootState) => state.userSession);

  const [homeStats, setHomeStats] = useState<GenHomeStats | null>(null);
  const [notifications, setNotifications] = useState<Notifications | null>([]);

  useEffect(() => {
    const getHomeStats = async () => {
      try {
        const response = await getGeneratorHomeStats(userSession.userId);
        setHomeStats(response);
      }
      catch (error) {
        console.log(error);
      }
      finally {
      setLoadingStats(false);
      }
    }
    getHomeStats();
  }, [])

 
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await getGeneratorNotifications(userSession.userId);
        setNotifications(response);
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setLoadingNotifications(false);
      }
    }
    getNotifications();
  }, [])

  return (
    <div className='flex flex-col px-3 py-1 md:p-4 gap-5 h-screen'>
      {loadingStats && <Spinner />}
      {!loadingStats &&
        <div className='flex flex-col md:flex-row items-start gap-2'>
        <Card className='flex-1 w-full md:w-auto'>
          <CardHeader className='bg-green-dark text-white min-h-16 font-semibold'>Solicitudes no coordinadas: {homeStats?.open}</CardHeader>
        </Card>
        
        <Card className='flex-1 w-full md:w-auto'>
          <CardHeader className='bg-green-dark text-white min-h-16 font-semibold'>Solicitudes pendientes de recolección: {homeStats?.pending}</CardHeader>
        </Card>
        
        <Card className='flex-1 w-full md:w-auto'>
          <CardHeader className='bg-green-dark text-white min-h-16 font-semibold'>Solicitudes  completadas: {homeStats?.completed}</CardHeader>
        </Card>
      </div>
      }
      
      <div className='flex flex-col justify-center gap-3 mb-2 w-full'>
        <h1 className='text-2xl justify-start'>Novedades</h1>
        {loadingNotifications && <Spinner />}

        {!loadingNotifications &&
        <div className='flex flex-col gap-2 pt-1 pb-3'>
          {notifications?.map((notification, index) => (
          <Card className='flex flex-col justify-between items-center flex-1' key={notification.id}>
            <CardBody>{notification.details}</CardBody>
            <Divider/>
            <CardFooter>Fecha: {formatDate(notification.created_at)} | Hora: {formatTime(notification.created_at)}</CardFooter> {/* TODO Cambiar a fecha real */}
          </Card>
          ))}
        </div>
        }

        {
          notifications?.length === 0 && (
            <div style={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '20px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              backgroundColor: '#f9f9f9',
              color: '#555'
            }}>
              <HorizontalRuleIcon fontSize='large' className='mb-3' />
              <p style={{ fontSize: '16px', margin: 0, textAlign: 'center' }}>
                ¡Aún no tienes novedades!<br />
                Comienza a solicitar recolecciones.
              </p>
            </div>
          )
        }


      </div>
    </div>
  );
};

export default HomeGenerador;
