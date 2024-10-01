'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from '@nextui-org/react';
import { getCoopOrdersById, getTrucksByCoopId, getDriversByCoopId } from "@api/apiService";
import { WasteCollectionRequests, Truck, TrucksResources, Driver, DriversResources } from '@/types';
import {formatDateRange, formatDate} from '@utils/dateStringFormat';
import AddressFormat from '@utils/addressFormat';
import Spinner from '@/components/Spinner';
import { ToastNotifier } from '@/components/ToastNotifier';
import { ToastContainer } from 'react-toastify';
import { mapTruckStatus } from '@constants/truck';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const rutasCooperativa = () => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requests, setRequests] = useState<WasteCollectionRequests>([]);
  const [trucks, setTrucks] = useState<TrucksResources>([]);
  const [drivers, setDrivers] = useState<DriversResources>([]);

  const [selectedRequests, setSelectedRequests] = useState(new Set());
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      setLoading(true);
      const camiones_response = await getTrucksByCoopId(userSession.userId);
      const conductores_response = await getDriversByCoopId(userSession.userId);
      const requests_response = await getCoopOrdersById(userSession.userId);
      setTrucks(camiones_response);
      setDrivers(conductores_response);
      setRequests(requests_response);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    } finally {
      setLoading(false);
    }
  }

  const hasErrors = () => {
    if (selectedRequests.size === 0) {
      setErrorMessage('Debes seleccionar al menos una solicitud');
      return true;
    }
    if (selectedTruck === '') {
      setErrorMessage('Debes seleccionar un camión');
      return true;
    }
    if (selectedDriver === '') {
      setErrorMessage('Debes seleccionar un conductor');
      return true;
    }
    return false
  }

  const generarRuta = () => {
    if (hasErrors()) {
      ToastNotifier.error(errorMessage);
      return;
    }
    const request_body = {
      requests_ids: Array.from(selectedRequests),
      truck_id: selectedTruck,
      driver_id: selectedDriver
    }
    console.log('Request body:', request_body);
    // Llamar a la API para generar la ruta
  }

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <h1 className='text-2xl font-bold'>Generación de rutas de recolección</h1>
      {loading ? (<Spinner />) : (
      <div>
      <p>Selecciona las solicitudes para las que deseas generar una ruta óptima</p>
      <div className='w-full'>
        <h2 className='text-xl font-bold'>Recolecciones pendientes</h2>
        <Table
          selectionMode='multiple'
          onSelectionChange={keys => setSelectedRequests(keys as Set<string>)}
          >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Fecha de solicitud</TableColumn>
            <TableColumn>Fecha de retiro</TableColumn>
            <TableColumn>Zona</TableColumn>
            <TableColumn>Direccion</TableColumn>
            <TableColumn>Estado</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No hay solicitudes para seleccionar"}>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{formatDate(request.request_date)}</TableCell>
                <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                <TableCell>{request.address ? request.address.zone : ""}</TableCell>
                <TableCell>{request.address ? AddressFormat(request.address) : ""}</TableCell>
                <TableCell>{request.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-row w-full'>
        <div className='flex-1 flex-col'>
          <h2 className='text-xl font-semibold'>Camiones disponibles</h2>
          <select className='w-full p-2 rounded-md border border-gray-300' onChange={(e) => setSelectedTruck(e.target.value)}>
            <option value=''>Selecciona un camión</option>
            {trucks.map((truck:Truck) => (
              <option key={truck.id} value={truck.id} disabled={truck.status !== 'ENABLED'}>
                {truck.id} - {truck.patent} - {truck.brand} {truck.model} - {mapTruckStatus[truck.status]} - {truck.capacity} tons.
              </option>
            ))}
          </select>
        </div>

        <div className='flex-1 flex-col'>
          <h2 className='text-xl font-semibold'>Conductores disponibles</h2>
          <select className='w-full p-2 rounded-md border border-gray-300' onChange={(e) => setSelectedDriver(e.target.value)}>
            <option value=''>Selecciona un conductor</option>
            {drivers.map((driver:Driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.id} - {driver.username}
              </option>
            ))}
          </select>
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
      )}
      <ToastContainer />
    </div>
  );
};

export default rutasCooperativa;
