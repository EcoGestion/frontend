'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from '@nextui-org/react';
import TruckModal from './components/truckModal';
import DriverModal from './components/driverModal';
import { getDriversByCoopId, getTrucksByCoopId, updateTruckStatus, deleteTruck, deleteUserById } from '@/api/apiService';
import { TrucksResources, DriversResources, Truck } from '@/types';
import { mapTruckStatus } from '@constants/truck';
import { FormatTruckCapacityToFront } from '@/utils/truckFormat';
import { ToastContainer } from 'react-toastify';
import { ToastNotifier } from '@/components/ToastNotifier';
import { getAuth, deleteUser } from 'firebase/auth';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

const recursosCooperativa = () => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const auth = getAuth();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [modalTruckIsOpen, setModalTruckIsOpen] = useState(false);
  const [modalDriverIsOpen, setModalDriverIsOpen] = useState(false);
  const [modalDeleteTruckIsOpen, setModalDeleteTruckIsOpen] = useState(false);
  const [modalDeleteDriverIsOpen, setModalDeleteDriverIsOpen] = useState(false);
  const [deletedTruckId, setDeletedTruckId] = useState<number | null>(null);
  const [deletedDriverId, setDeletedDriverId] = useState<number | null>(null);

  const [camiones, setCamiones] = useState<TrucksResources>([]);
  const [conductores, setConductores] = useState<DriversResources>([]);

  useEffect(() => {
    retrieveData();
  }, [modalTruckIsOpen, modalDriverIsOpen]);

  const retrieveData = async () => {
    try {
      setLoading(true);
      const camiones_response = await getTrucksByCoopId(userSession.userId);
      const camiones_formatted = camiones_response.map((camion: Truck) => FormatTruckCapacityToFront(camion));
      setCamiones(camiones_formatted);

      const conductores_response = await getDriversByCoopId(userSession.userId);
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

  const handleDeleteCamion = async () => {
    if (!deletedTruckId) {
      return;
    }
    try {
      setModalDeleteTruckIsOpen(false);
      await deleteTruck(deletedTruckId)
      ToastNotifier.success('Camión eliminado correctamente');
      retrieveData();
    } catch (error) {
      console.error('Error deleting truck:', error);
      ToastNotifier.error('Error al eliminar el camión');
    }
  }

  const handleDeleteConductor = () => {
    if (!deletedDriverId) {
      return;
    }
    try {
      setModalDeleteDriverIsOpen(false);
      deleteUserById(deletedDriverId).then(() => {
        if (user) {
          deleteUser(user).then(() => {
            ToastNotifier.success('Conductor eliminado correctamente');
            retrieveData();
          }).catch((error) => {
            console.error('Error deleting driver:', error);
            ToastNotifier.error('Error al eliminar el conductor');
          });
        } else {
          throw new Error('User not found to delete from Firebase');
        }
      }).catch((error) => {
        console.error('Error deleting driver from Firebase:', error);
        throw error;
      });
    }
    catch (error) {
      console.error('Error deleting driver:', error);
      ToastNotifier.error('Error al eliminar el conductor');
    }
  }

  const handleDisableCamion = (id: number) => {
    const camion = camiones.find((c) => c.id === id);
    if (camion) {
      camion.status = 'DISABLE';
      updateTruckStatus(camion.id, camion).then(() => {
        ToastNotifier.success('Camión deshabilitado correctamente');
        retrieveData();
      }).catch((error) => {
        console.error('Error disabling truck:', error);
        ToastNotifier.error('Error al deshabilitar el camión');
      });
    }

  }

  const handleEnableCamion = (id: number) => {
    const camion = camiones.find((c) => c.id === id);
    if (camion) {
      camion.status = 'ENABLED';
      updateTruckStatus(camion.id, camion).then(() => {
        ToastNotifier.success('Camión habilitado correctamente');
        retrieveData();
      }).catch((error) => {
        console.error('Error enabling truck:', error);
        ToastNotifier.error('Error al habilitar el camión');
      });
    }
  }

  const handleDisableConductor = (id: number) => {
    console.log('Deshabilitar conductor', id);
  }

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <ToastContainer />
      <TruckModal isOpen={modalTruckIsOpen} onRequestClose={()=> setModalTruckIsOpen(false)}/>
      <DriverModal isOpen={modalDriverIsOpen} onRequestClose={()=> setModalDriverIsOpen(false)}/>
      <DeleteConfirmationModal isOpen={modalDeleteTruckIsOpen} onRequestClose={()=> setModalDeleteTruckIsOpen(false)} onConfirm={handleDeleteCamion}/>
      <DeleteConfirmationModal isOpen={modalDeleteDriverIsOpen} onRequestClose={()=> setModalDeleteDriverIsOpen(false)} onConfirm={handleDeleteConductor}/>
      <h1 className='text-2xl font-bold'>Gestión de los recursos de la Cooperativa</h1>
      <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold'>Camiones</h2>
        <button onClick={handleAgregarCamion} className='bg-white text-green-dark px-4 py-2 rounded-medium border-medium border-green-800'>
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
                <TableCell>{camion.capacity} tons</TableCell>
                <TableCell>{mapTruckStatus[camion.status]}</TableCell>
                <TableCell>
                  
                {camion.status === 'ENABLED' && (
                  <button
                    onClick={() => handleDisableCamion(camion.id)}
                    className='bg-white text-yellow-dark px-3 py-2 rounded-medium border-medium border-yellow-light mr-2'
                  >
                    Deshabilitar
                  </button>
                )}

                {camion.status === 'DISABLE' && (
                  <button
                    onClick={() => handleEnableCamion(camion.id)}
                    className='bg-white text-green-dark px-3 py-2 rounded-medium border-medium border-green-dark mr-2'
                  >
                    Habilitar
                  </button>
                )}

                {camion.status === 'ON_ROUTE' && (
                  <button
                    disabled
                    className='bg-white text-gray-400 px-3 py-2 rounded-medium border-medium border-gray-300 mr-2'
                  >
                    En Ruta
                  </button>
                )}

                  <button onClick={() => {setDeletedTruckId(camion.id); setModalDeleteTruckIsOpen(true)}} className='bg-white text-red-dark px-3 py-2 rounded-medium border-medium border-red-800 mr-2'>
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
          <button onClick={handleAgregarConductor} className='bg-white text-green-dark px-4 py-2 rounded-medium border-medium border-green-800'>
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
                  <button onClick={() => handleDisableConductor(conductor.id)} className='bg-white text-yellow-dark px-3 py-2 rounded-medium border-medium border-yellow-light mr-2'>
                    Deshabilitar
                  </button>
                  <button onClick={() => {setDeletedDriverId(conductor.id); setModalDeleteDriverIsOpen(true)}} className='bg-white text-red-dark px-3 py-2 rounded-medium border-medium border-red-800 mr-2'>
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