'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Spinner from "@/components/Spinner";
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { ToastNotifier } from "@/components/ToastNotifier";

const ActiveRoutesMock = [
  {
    id: 1,
    date: '2021-10-10',
    driver: 'Matias Garrido',
    truck: 'FE123AW',
    quantity: 5,
    status: 'Pendiente'
  },
  {
    id: 2,
    date: '2021-10-10',
    driver: 'Sandra Martinez',
    truck: 'AGE237',
    quantity: 5,
    status: 'En ruta'
  }
];

const historyRoutesMock = [
  {
    id: 1,
    date: '2021-10-10',
    driver: 'Matias Garrido',
    truck: 'FE123AW',
    quantity: 2,
    status: 'Completada'
  },
  {
    id: 2,
    date: '2021-10-10',
    driver: 'Sandra Martinez',
    truck: 'AGE237',
    quantity: 8,
    status: 'Completada'
  }
];

const rutasCooperativa = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoute = () => {
    router.push('/home/cooperativa/rutas/crear');
  }

  const handleViewHistory = () => {
    // navegar a historial de rutas
  }

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <h1 className='text-2xl font-bold text-center'>Administre sus rutas de recolección</h1>
      {loading ? (<Spinner />) : (
      <div>
        <div className='w-full gap-4 pt-4'>
          <button className='bg-white text-green-dark px-4 py-2 rounded-full border border-green-800' onClick={handleCreateRoute}>
            Crear nueva ruta
          </button>
          <div className='w-full pt-2'>
            <h2 className='text-xl font-bold'>Rutas activas en este momento</h2>
            <Table>
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Fecha de recolección</TableColumn>
                <TableColumn>Conductor</TableColumn>
                <TableColumn>Camión</TableColumn>
                <TableColumn>Cantidad de recolecciónes</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Acciónes</TableColumn>
              </TableHeader>
              <TableBody>
                {ActiveRoutesMock.map((route, index) => (
                  <TableRow key={index}>
                    <TableCell>{route.id}</TableCell>
                    <TableCell>{route.date}</TableCell>
                    <TableCell>{route.driver}</TableCell>
                    <TableCell>{route.truck}</TableCell>
                    <TableCell>{route.quantity}</TableCell>
                    <TableCell>{route.status}</TableCell>
                    <TableCell>
                      <div className="gap-2">
                      <button className='bg-white text-green-dark px-4 py-2 rounded-2xl border border-green-800'>
                        Ver detalles
                      </button>
                      {route.status === 'Pendiente' && (
                        <button className='bg-white text-green-dark px-4 py-2 rounded-2xl border border-green-800'>
                          Cancelar
                        </button>
                      )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className='w-full gap-4 pt-4'>
          <button className='bg-white text-green-dark px-4 py-2 rounded-full border border-green-800' onClick={handleViewHistory}>
            Ver historial de rutas
          </button>

          <div className='w-full pt-2'>
            <h2 className='text-xl font-bold'>Historial de rutas</h2>
            <Table>
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Fecha de recolección</TableColumn>
                <TableColumn>Conductor</TableColumn>
                <TableColumn>Camión</TableColumn>
                <TableColumn>Cantidad de recolecciónes</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Acciónes</TableColumn>
              </TableHeader>
              <TableBody>
                {historyRoutesMock.map((route, index) => (
                  <TableRow key={index}>
                    <TableCell>{route.id}</TableCell>
                    <TableCell>{route.date}</TableCell>
                    <TableCell>{route.driver}</TableCell>
                    <TableCell>{route.truck}</TableCell>
                    <TableCell>{route.quantity}</TableCell>
                    <TableCell>{route.status}</TableCell>
                    <TableCell>
                      <button className='bg-white text-green-dark px-4 py-2 rounded-2xl border border-green-800'>
                        Ver detalles
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      )}
      <ToastContainer />
    </div>
  );
}
export default rutasCooperativa;
