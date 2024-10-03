'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import PieChart from '@/components/PieChart';
import BarChart from '@/components/BarChart';

const mockMaterials = {
  labels: ['Plastico', 'Vidrio', 'Cartón'],
  datasets: [
    {
      label: 'Cantidad de kg recibidos',
      data: [15, 10, 30],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const mockMonths = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Cantidad de solicitudes',
      data: [12, 9, 6, 8, 2, 3, 4, 8, 6, 0, 0, 0],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const mockDays = {
  labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  datasets: [
    {
      label: 'Cantidad de solicitudes en promedio por día por mes',
      data : [12, 8, 3, 5, 2, 2, 0],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const mockRequests = {
  labels: ['Pendientes', 'Finalizadas', 'Canceladas'],
  datasets: [
    {
      label: 'Cantidad de solicitudes',
      data: [1, 10, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const EstadisticasGenerador = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");

  return (
    <div className='flex flex-col items-center justify-center gap-5 h-screen p-2'>
      <h1 className='text-2xl font-bold'>Estadísticas de recolecciones</h1>
      <div className='grid grid-cols-2 grid-rows-2 gap-4 w-full h-full pt-0 p-3'>
        <div className='bg-green-lighter shadow-md rounded-lg p-4'>
          <h2 className='text-xl font-semibold'>Materiales reciclados</h2>
          <PieChart data={mockMaterials}/>
        </div>
        <div className='bg-green-lighter shadow-md rounded-lg p-4'>
          <h2 className='text-xl font-semibold'>Cantidad de solicitudes por mes</h2>
          <BarChart data={mockMonths} />
        </div>
        <div className='bg-green-lighter shadow-md rounded-lg p-4'>
          <h2 className='text-xl font-semibold'>Promedio de solicitudes por dia de la semana</h2>
          <BarChart data={mockDays} />
        </div>
        <div className='bg-green-lighter shadow-md rounded-lg p-4'>
          <h2 className='text-xl font-semibold'>Estados de solicitudes</h2>
          <PieChart data={mockRequests} />
        </div>
      </div>
    </div>
  );
};

export default EstadisticasGenerador;