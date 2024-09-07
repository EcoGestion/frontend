'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

const EstadisticasGenerador = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");

return (
    <div className='flex flex-col items-center justify-center gap-5 h-screen'>
        Estadisticas del generador
    </div>
);
};

export default EstadisticasGenerador;
