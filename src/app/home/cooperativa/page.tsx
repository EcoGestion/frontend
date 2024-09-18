'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@state/userProvider";
import PieChart from '@/components/PieChart';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn,
 } from '@nextui-org/react';
import dynamic from 'next/dynamic'
import 'dotenv/config'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const openRequestsMocked = [
  {
    id: 1,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Belgrano',
    elements: "Papel - Cartón - Plástico",
    status: 'DISPONIBLE',
    gen_type: 'Edificio',
  },
  {
    id: 2,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Palermo',
    elements: "Vidrio",
    status: 'DISPONIBLE',
    gen_type: 'Hotel',
  },
  {
    id: 3,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Recoleta',
    elements: "Carton - Aceite",
    status: 'DISPONIBLE',
    gen_type: 'Restaurante',
  }
];

const pendingRequestsMocked = [
  {
    id: 4,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Belgrano',
    elements: "Papel - Cartón - Plástico",
    gen_type: 'Building',
    status: 'PENDIENTE',
  },
  {
    id: 5,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Palermo',
    elements: "Vidrio",
    gen_type: 'Hotel',
    status: 'PENDIENTE',
  },
  {
    id: 6,
    request_date: '2024-09-01T00:00:00',
    pickup_date_from: '2024-09-01T08:00:00',
    pickup_date_to: '2024-09-01T10:00:00',
    zone: 'Recoleta',
    elements: "Carton - Aceite",
    gen_type: 'RestaurantE',
    status: 'PENDIENTE',
  }
];

const camionesMocked = [
  {
    id: 1,
    placa: 'ABC-142',
    modelo: 2020,
    marca: 'VolksWagen',
    capacidad: '10 toneladas',
    estado: 'Disponible',
  },
  {
    id: 2,
    placa: 'AE-913-TR',
    modelo: 2021,
    marca: 'Mercedes Benz',
    capacidad: '5 toneladas',
    estado: 'En uso',
  },
  {
    id: 3,
    placa: 'JQR-204',
    modelo: 2022,
    marca: 'Toyota',
    capacidad: '10 toneladas',
    estado: 'Disponible',
  },
];

const HomeCooperativa = () => {
  const { user } = useUser();
  const router = useRouter();
  console.log(user)

  useEffect(() => {
    console.log("Estado del usuario en home:", user);
  }, [user]);

  const formatDateRange = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    const date = fromDate.toLocaleDateString();
    const fromTime = fromDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const toTime = toDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${date} ${fromTime} - ${toTime}`;
  };

  if(Object.keys(user).length == 0)
    return (
      <div className='flex flex-col items-center justify-center gap-5 h-screen'>
        Loading...
      </div>
  )
  else {
    return (
      <div className='flex flex-col p-4 gap-5 h-screen'>
        <div className='flex flex-col gap-2 w-full'>
          <Card className='flex-1'>
            <CardHeader className='bg-green-dark text-white p-2'>Solicitudes disponibles: 10</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <Table>
                <TableHeader>
                  <TableColumn>Fecha de recolección</TableColumn>
                  <TableColumn>Zona</TableColumn>
                  <TableColumn>Elementos</TableColumn>
                  <TableColumn>Tipo de generador</TableColumn>
                  <TableColumn>Estado</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {openRequestsMocked.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                      <TableCell>{request.zone}</TableCell>
                      <TableCell>{request.elements}</TableCell>
                      <TableCell>{request.gen_type}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        <Button >Ver</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
          
          <Card className='flex-1'>
            <CardHeader className='bg-green-dark text-white p-2'>Solicitudes pendientes el dia de hoy: 5</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <Table>
                <TableHeader>
                  <TableColumn>Fecha de recolección</TableColumn>
                  <TableColumn>Zona</TableColumn>
                  <TableColumn>Elementos</TableColumn>
                  <TableColumn>Tipo de generador</TableColumn>
                  <TableColumn>Estado</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {pendingRequestsMocked.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                      <TableCell>{request.zone}</TableCell>
                      <TableCell>{request.elements}</TableCell>
                      <TableCell>{request.gen_type}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        <Button >Ver</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
          
          <Card className='flex-1'>
            <CardHeader className='bg-green-dark text-white p-2'>Camiones activos: 2</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <Table>
                <TableHeader>
                  <TableColumn>Placa</TableColumn>
                  <TableColumn>Marca</TableColumn>
                  <TableColumn>Capacidad</TableColumn>
                  <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody>
                  {camionesMocked.map((camion) => (
                    <TableRow key={camion.id}>
                      <TableCell>{camion.placa}</TableCell>
                      <TableCell>{camion.marca}</TableCell>
                      <TableCell>{camion.capacidad}</TableCell>
                      <TableCell>{camion.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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