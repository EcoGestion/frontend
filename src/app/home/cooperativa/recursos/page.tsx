'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '../../../../state/userSessionSlice';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../state/userProvider';

const recursosCooperativa = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center gap-5 h-screen'>
      Administracion de recursos de la cooperativa
    </div>
  );
};

export default recursosCooperativa;
