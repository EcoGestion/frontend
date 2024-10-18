'use client'
import React, { useState, useEffect, useMemo } from "react";
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Spinner from "@/components/Spinner";
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Pagination } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { ToastNotifier } from "@/components/ToastNotifier";
import { getCoopRoutes, getCoopActiveRoutes } from "@/api/apiService";
import { Route, Routes } from "@/types";
import { formatDate } from "@/utils/dateStringFormat";
import { FormatTruckString } from "@/utils/truckFormat";
import { mapRouteStatus } from '@constants/route';


const rutasCooperativa = () => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [activeRoutes, setActiveRoutes] = useState<Routes>([]);
  const [historyRoutes, setHistoryRoutes] = useState<Routes>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const activeRoutes = await getCoopActiveRoutes(userSession.userId);
      setActiveRoutes(activeRoutes);
      const historyRoutes = await getCoopRoutes(userSession.userId);
      setHistoryRoutes(historyRoutes);
    } catch (error) {
      console.error('Error retrieving routes:', error);
      ToastNotifier.error('Error al obtener las rutas');
    } finally {
      setLoading(false);
    }
  }

  const [historyPage, setHistoryPage] = useState(1);
  const [pages, setPages] = useState(1);
  const rowsPerPage = 5;

  const items = useMemo(() => {
    setPages(Math.ceil(historyRoutes.length / rowsPerPage));
    const start = (historyPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return historyRoutes.slice(start, end);
  }, [historyPage, historyRoutes]);

  const handleCreateRoute = () => {
    router.push('/home/cooperativa/rutas/crear');
  }

  const handleRouteDetails = (id: number) => {
    router.push(`/home/cooperativa/rutas/detalles/${id}`);
  }

  const handleCancelRoute = (id: number) => {
    // cancelar ruta
  }

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <ToastContainer />
      <h1 className='text-2xl font-bold text-center'>Administre sus rutas de recolección</h1>
      {loading ? (<Spinner />) : (
      <div>
        <div className='w-full gap-2 pt-2'>
          <button className='bg-white text-green-dark px-4 py-2 rounded-medium border border-green-800' onClick={handleCreateRoute}>
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
                <TableColumn>Cantidad [kg]</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Acciónes</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay rutas para mostrar">
                {activeRoutes.map((route, index) => (
                  <TableRow key={index}>
                    <TableCell>{route.id}</TableCell>
                    <TableCell>{formatDate(route.created_at)}</TableCell>
                    <TableCell>{route.driver.username}</TableCell>
                    <TableCell>{FormatTruckString(route.truck)}</TableCell>
                    <TableCell>{route.total_weight} kg</TableCell>
                    <TableCell>{mapRouteStatus[route.status]}</TableCell>
                    <TableCell>
                      <div className="gap-2">
                      <button className='bg-white text-green-dark px-4 py-2 rounded-2xl border border-green-800' onClick={()=>handleRouteDetails(route.id)}>
                        Ver detalles
                      </button>
                      {route.status === 'CREATED' && (
                        <button className='bg-white text-red-dark px-4 py-2 rounded-2xl border border-red-dark' onClick={() => handleCancelRoute(route.id)}>
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
          <div className='w-full pt-2'>
            <h2 className='text-xl font-bold'>Historial de rutas</h2>
            <Table>
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Fecha de recolección</TableColumn>
                <TableColumn>Conductor</TableColumn>
                <TableColumn>Camión</TableColumn>
                <TableColumn>Cantidad [kg]</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Acciónes</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay rutas para mostrar">
                {items.map((route, index) => (
                  <TableRow key={index}>
                    <TableCell>{route.id}</TableCell>
                    <TableCell>{formatDate(route.created_at)}</TableCell>
                    <TableCell>{route.driver.username}</TableCell>
                    <TableCell>{FormatTruckString(route.truck)}</TableCell>
                    <TableCell>{route.total_weight} kg</TableCell>
                    <TableCell>{mapRouteStatus[route.status]}</TableCell>
                    <TableCell>
                      <button className='bg-white text-green-dark px-4 py-2 rounded-2xl border border-green-800' onClick={()=>handleRouteDetails(route.id)}>
                        Ver detalles
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex w-full justify-center">
              <Pagination
                page={historyPage}
                color="success"
                showControls
                showShadow
                size="lg"
                variant="bordered"
                total={pages}
                onChange={(page) => setHistoryPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
      )}
      <ToastContainer />
    </div>
  );
}
export default rutasCooperativa;
