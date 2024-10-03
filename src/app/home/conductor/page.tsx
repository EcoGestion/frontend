'use client'
import React, { useEffect, useState } from 'react';
import {auth} from '../../firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '@/state/userSessionSlice';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn,
 } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import 'dotenv/config';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const MockData = [
  {
    "request_date": "2024-09-01T00:00:00",
    "generator_id": 42,
    "status": "OPEN",
    "pickup_date_from": "2024-09-18T12:00:00",
    "zone": "Palermo",
    "id": 15,
    "coop_id": 50,
    "details": "2do piso",
    "pickup_date_to": "2024-09-20T18:00:00",
    "generator": {
        "username": "Test Gen",
        "email": "teo@test.com",
        "type": "GEN_BUILDING",
        "address_id": 2,
        "id": 42,
        "firebase_id": "4QM0hPEgrshWXnar8NG6dD08EPo1",
        "phone": "123456"
    },
    "coop": {
        "username": "Coop",
        "email": "coop@mail.com",
        "type": "COOP",
        "address_id": 10,
        "id": 50,
        "firebase_id": "wKRF2UykszP54caWiTo7U8lbxG02",
        "phone": "121212"
    }
  },
  {
    "request_date": "2024-09-01T00:00:00",
    "generator_id": 42,
    "status": "OPEN",
    "pickup_date_from": "2024-09-18T12:00:00",
    "zone": "Palermo",
    "id": 16,
    "coop_id": 50,
    "details": "2do piso",
    "pickup_date_to": "2024-09-20T18:00:00",
    "generator": {
        "username": "Test Gen",
        "email": "gen@test.com",
        "type": "GEN_OFFICE",
        "address_id": 3,
        "id": 42,
        "firebase_id": "4QM0hPEgrshWXnar8NG6dD08EPo1",
        "phone": "123456"
    },
    "coop": {
        "username": "Coop",
        "email": "coop@mail.com",
        "type": "COOP",
        "address_id": 10,
        "id": 50,
        "firebase_id": "wKRF2UykszP54caWiTo7U8lbxG02",
        "phone": "121212"
    }
  },
  {
    "request_date": "2024-09-01T00:00:00",
    "generator_id": 42,
    "status": "OPEN",
    "pickup_date_from": "2024-09-18T12:00:00",
    "zone": "Palermo",
    "id": 17,
    "coop_id": 50,
    "details": "2do piso",
    "pickup_date_to": "2024-09-20T18:00:00",
    "generator": {
        "username": "Test Gen",
        "email": "gen_hotel@gmail.com",
        "type": "GEN_HOTEL",
        "address_id": 4,
        "id": 42,
        "firebase_id": "4QM0hPEgrshWXnar8NG6dD08EPo1",
        "phone": "123456"
    },
    "coop": {
        "username": "Coop",
        "email": "coop@mail.com",
        "type": "COOP",
        "address_id": 10,
        "id": 50,
        "firebase_id": "wKRF2UykszP54caWiTo7U8lbxG02",
        "phone": "121212"
    }
  }
]

const HomeConductor = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) =>{
      if (user) {
        user.getIdToken().then( async (accessToken) => {
          setUser(user)
        })
      }
      else {
        router.replace("/")
      }
    });
  }, []);

  function formatDateRange(date_from: string, date_to: string): string {
    const fromDate = new Date(date_from);
    const toDate = new Date(date_to);

    const day = fromDate.getDate().toString().padStart(2, '0');
    const month = (fromDate.getMonth() + 1).toString().padStart(2, '0');
    const year = fromDate.getFullYear();

    const fromHours = fromDate.getHours().toString().padStart(2, '0');
    const fromMinutes = fromDate.getMinutes().toString().padStart(2, '0');

    const toHours = toDate.getHours().toString().padStart(2, '0');
    const toMinutes = toDate.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${fromHours}:${fromMinutes} - ${toHours}:${toMinutes}`;
  }

  return (
    <div className='flex flex-col p-4 gap-3 h-screen'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Bienvenido!</h1>
      </div>

      <div className='flex-col'>
        <h2 className='text-xl font-bold'>Recolecciones del día</h2>
      <Table title='Ruta del día'>
        <TableHeader>
          <TableColumn>Generador</TableColumn>
          <TableColumn>Dirección</TableColumn>
          <TableColumn>Zona</TableColumn>
          <TableColumn>Detalles</TableColumn>
          <TableColumn>Fecha y rango horario</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {MockData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.generator.username}</TableCell>
              <TableCell>{data.generator.address_id}</TableCell>
              <TableCell>{data.zone}</TableCell>
              <TableCell>{data.details}</TableCell>
              <TableCell>{formatDateRange(data.pickup_date_from, data.pickup_date_to)}</TableCell>
              <TableCell>{data.status}</TableCell>
              <TableCell>
                <Button
                className='bg-white text-green-dark px-3 py-2 rounded-full border border-x-green-dark'
                >Ver detalles</Button>
                <Button
                className='bg-white text-green-dark px-3 py-2 rounded-full border border-x-green-dark'
                >Confirmar recepción</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      <Card>
        <CardHeader>
          <h2 className='text-xl font-bold'>Mapa de recolecciones</h2>
        </CardHeader>
        <CardBody>
          <MapView />
        </CardBody>
      </Card>
    </div>
  );
};

export default HomeConductor;
