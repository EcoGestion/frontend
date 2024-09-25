'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from '@nextui-org/react';
import TruckModal from './components/truckModal';
import DriverModal from './components/driverModal';
import { getDriversByCoopId, getTrucksByCoopId, updateTruckStatus } from '@/api/apiService';
import { TrucksResources, DriversResources } from '@/types';
import { mapTruckStatus } from '@constants/truck';

const recursosCooperativa = () => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const [loading, setLoading] = useState(false);
  const [modalTruckIsOpen, setModalTruckIsOpen] = useState(false);
  const [modalDriverIsOpen, setModalDriverIsOpen] = useState(false);

  const [camiones, setCamiones] = useState<TrucksResources>([]);
  const [conductores, setConductores] = useState<DriversResources>([]);

  useEffect(() => {
    retrieveData();
  }, [modalTruckIsOpen, modalDriverIsOpen]);

  const retrieveData = async () => {
    try {
      setLoading(true);
      const camiones_response = await getTrucksByCoopId(userSession.userId);
      const conductores_response = await getDriversByCoopId(userSession.userId);
      setCamiones(camiones_response);
      setConductores(conductores_response);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAgregarCamion = () => {
    setModalTruckIsOpen(true);
  };

  const handleAgregarConductor = () => {
    setModalDriverIsOpen(true);
  };

  const handleDeleteCamion = (id: number) => {
    console.log('Eliminar camion', id);
  }

  const handleDeleteConductor = (id: number) => {
    console.log('Eliminar conductor', id);
  }

  const handleDisableCamion = (id: number) => {
    const camion = camiones.find((c) => c.id === id);
    if (camion) {
      camion.status = 'DISABLE';
      updateTruckStatus(camion.id, camion).then(() => {
        retrieveData();
      })
    }

  }

  const handleEnableCamion = (id: number) => {
    const camion = camiones.find((c) => c.id === id);
    if (camion) {
      camion.status = 'ENABLED';
      updateTruckStatus(camion.id, camion).then(() => {
        retrieveData();
      })
    }
  }

  const handleDisableConductor = (id: number) => {
    console.log('Deshabilitar conductor', id);
  }

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <TruckModal isOpen={modalTruckIsOpen} onRequestClose={()=> setModalTruckIsOpen(false)}/>
      <DriverModal isOpen={modalDriverIsOpen} onRequestClose={()=> setModalDriverIsOpen(false)}/>
      <h1 className='text-2xl font-bold'>Gestión de los recursos de la Cooperativa</h1>
      <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold'>Camiones</h2>
        <button onClick={handleAgregarCamion} className='bg-white text-green-dark px-4 py-2 rounded-full border border-green-800'>
          Agregar camión
        </button>
      </div>
        <Table isStriped>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Placa</TableColumn>
            <TableColumn>Modelo</TableColumn>
            <TableColumn>Marca</TableColumn>
            <TableColumn>Capacidad</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No hay camiones registrados."}>
            {camiones.map((camion) => (
              <TableRow key={camion.id}>
                <TableCell>{camion.id}</TableCell>
                <TableCell>{camion.patent}</TableCell>
                <TableCell>{camion.model}</TableCell>
                <TableCell>{camion.brand}</TableCell>
                <TableCell>{camion.capacity}</TableCell>
                <TableCell>{mapTruckStatus[camion.status]}</TableCell>
                <TableCell>
                  
                {camion.status === 'ENABLED' && (
                  <button
                    onClick={() => handleDisableCamion(camion.id)}
                    className='bg-white text-yellow-dark px-3 py-2 rounded-full border border-yellow-light'
                  >
                    Deshabilitar
                  </button>
                )}

                {camion.status === 'DISABLE' && (
                  <button
                    onClick={() => handleEnableCamion(camion.id)}
                    className='bg-white text-green-dark px-3 py-2 rounded-full border border-green-light'
                  >
                    Habilitar
                  </button>
                )}

                {camion.status === 'ON_ROUTE' && (
                  <button
                    disabled
                    className='bg-white text-gray-400 px-3 py-2 rounded-full border border-gray-300'
                  >
                    En Ruta
                  </button>
                )}

                  <button onClick={() => handleDeleteCamion(camion.id)} className='bg-white text-red-dark px-3 py-2 rounded-full border border-red-800'>
                    Eliminar
                  </button>
                </TableCell>
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
        <Table isStriped>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Documento</TableColumn>
            <TableColumn>Telefono</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No hay conductores registrados."}>
            {conductores.map((conductor) => (
              <TableRow key={conductor.id}>
                <TableCell>{conductor.id}</TableCell>
                <TableCell>{conductor.username}</TableCell>
                <TableCell>{conductor.national_id}</TableCell>
                <TableCell>{conductor.phone}</TableCell>
                <TableCell>{conductor.email}</TableCell>
                <TableCell>
                  <button onClick={() => handleDisableConductor(conductor.id)} className='bg-white text-yellow-dark px-3 py-2 rounded-full border border-yellow-light'>
                    Deshabilitar
                  </button>
                  <button onClick={() => handleDeleteConductor(conductor.id)} className='bg-white text-red-dark px-3 py-2 rounded-full border border-red-800'>
                    Eliminar
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default recursosCooperativa;