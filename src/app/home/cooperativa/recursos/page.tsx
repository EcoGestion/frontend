'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearUserSession } from '../../../../state/userSessionSlice';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../state/userProvider';
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Divider } from '@nextui-org/react';
import { TableFooter } from '@mui/material';
import TruckModal from './components/truckModal';

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

const recursosCooperativa = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();

  const [modalTruckIsOpen, setModalTruckIsOpen] = useState(false);

  const handleAgregarCamion = () => {
    setModalTruckIsOpen(true);
  };

  const handleAgregarConductor = () => {
    // Lógica para agregar conductor
    console.log('Agregar conductor');
  };

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <TruckModal isOpen={modalTruckIsOpen} onRequestClose={()=> setModalTruckIsOpen(false)}/>
      <h1 className='text-2xl font-bold'>Gestión de los recursos de la Cooperativa</h1>
      <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold'>Camiones</h2>
        <button onClick={handleAgregarCamion} className='bg-white text-green-dark px-4 py-2 rounded-full border border-green-800'>
          Agregar camión
        </button>
      </div>
        <Table>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Placa</TableColumn>
            <TableColumn>Modelo</TableColumn>
            <TableColumn>Marca</TableColumn>
            <TableColumn>Capacidad</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {camionesMocked.map((camion) => (
              <TableRow key={camion.id}>
                <TableCell>{camion.id}</TableCell>
                <TableCell>{camion.placa}</TableCell>
                <TableCell>{camion.modelo}</TableCell>
                <TableCell>{camion.marca}</TableCell>
                <TableCell>{camion.capacidad}</TableCell>
                <TableCell>{camion.estado}</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='w-full'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Conductores</h2>
          <button onClick={handleAgregarConductor} className='bg-white text-green-dark px-4 py-2 rounded-full border border-green-800'>
            Agregar conductor
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Documento</TableColumn>
            <TableColumn>Telefono</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {conductoresMocked.map((conductor) => (
              <TableRow key={conductor.id}>
                <TableCell>{conductor.id}</TableCell>
                <TableCell>{conductor.nombre}</TableCell>
                <TableCell>{conductor.documento}</TableCell>
                <TableCell>{conductor.telefono}</TableCell>
                <TableCell>{conductor.email}</TableCell>
                <TableCell>{conductor.estado}</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default recursosCooperativa;