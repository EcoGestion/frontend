'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '../../../../state/userSessionSlice';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../state/userProvider';
import dynamic from 'next/dynamic';
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Divider } from '@nextui-org/react';
import {Select, SelectItem} from "@nextui-org/react";

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const camionesMocked = [
  {
    id: 1,
    placa: 'AAA-111',
    modelo: 2020,
    marca: 'Volvo',
    capacidad: '10 toneladas',
    estado: 'Disponible',
  },
  {
    id: 2,
    placa: 'BBB-222',
    modelo: 2021,
    marca: 'Volvo',
    capacidad: '10 toneladas',
    estado: 'En uso',
  },
  {
    id: 3,
    placa: 'CCC-333',
    modelo: 2022,
    marca: 'Volvo',
    capacidad: '10 toneladas',
    estado: 'Disponible',
  },
];

const conductoresMocked = [
  {
    id: 1,
    nombre: 'Juan Perez',
    documento: '123456789',
    telefono: '123456789',
    email: 'conductor@gmail.com',
    estado: 'Disponible',
  },
  {
    id: 2,
    nombre: 'Carlos Perez',
    documento: '123456789',
    telefono: '123456789',
    email: 'conductor2@hotmail.com',
    estado: 'En uso',
  },
  {
    id: 3,
    nombre: 'Jose Perez',
    documento: '123456789',
    telefono: '123456789',
    email: 'conductor3@gmail.com',
    estado: 'Disponible',
  },
];

const requestsMocked = [
  {
    id: 1,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Belgrano',
    status: 'OPEN',
  },
  {
    id: 2,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Palermo',
    status: 'OPEN',
  },
  {
    id: 3,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Recoleta',
    status: 'OPEN',
  },
  {
    id: 4,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Caballito',
    status: 'OPEN',
  },
  {
    id: 5,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Villa Crespo',
    status: 'OPEN',
  },
  {
    id: 6,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Villa Urquiza',
    status: 'OPEN',
  },
  {
    id: 7,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Nuñez',
    status: 'OPEN',
  }
];

const rutasCooperativa = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();
  const [camion, setCamion] = useState('');
  const [conductor, setConductor] = useState('');
  const [camionesNoDisponibles, setCamionesNoDisponibles] = useState([]);
  const [conductoresNoDisponibles, setConductoresNoDisponibles] = useState([]);

  const generarRuta = () => {
    console.log('Generar ruta');
  }

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <h1 className='text-2xl font-bold'>Generación de rutas de recolección</h1>
      <p>Selecciona las solicitudes para las que deseas generar una ruta óptima</p>
      <div className='w-full'>
        <h2 className='text-xl font-bold'>Recolecciones pendientes</h2>
        <Table selectionMode='multiple'>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Fecha de solicitud</TableColumn>
            <TableColumn>Fecha de retiro</TableColumn>
            <TableColumn>Zona</TableColumn>
            <TableColumn>Estado</TableColumn>
          </TableHeader>
          <TableBody>
            {requestsMocked.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.request_date}</TableCell>
                <TableCell>{request.pickup_date_from} - {request.pickup_date_to}</TableCell>
                <TableCell>{request.zone}</TableCell>
                <TableCell>{request.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-row w-full'>
        <div className='flex-1 flex-col'>
          <h2 className='text-xl font-semibold'>Camiones disponibles</h2>
          <Select placeholder='Selecciona un camión' disabledKeys={camionesNoDisponibles} radius='sm'>
            {camionesMocked.map((camion) => (
              <SelectItem key={camion.id} value={camion.placa}>
                {camion.id} - {camion.placa} - {camion.estado} - {camion.capacidad}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className='flex-1 flex-col'>
          <h2 className='text-xl font-semibold'>Conductores disponibles</h2>
          <Select placeholder='Selecciona un conductor' disabledKeys={conductoresNoDisponibles} radius='sm'>
            {conductoresMocked.map((conductor) => (
              <SelectItem key={conductor.id} value={conductor.nombre}>
                {conductor.id} - {conductor.nombre} - {conductor.estado}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <button className='bg-white text-green-dark px-4 py-2 rounded-full border border-green-800' onClick={generarRuta}>
          Generar ruta
        </button>
      </div>
      <div className='p-2'>
        <MapView />
      </div>
    </div>
  );
};

export default rutasCooperativa;
