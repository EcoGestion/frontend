'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody,
  Table, TableHeader, TableBody, TableRow, TableCell,
  TableColumn, Pagination
 } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import 'dotenv/config';
import AddressFormat from '@utils/addressFormat';
import Spinner from '@components/Spinner';
import { getRoutesByDriverId } from '@api/apiService';
import { mapRouteStatus } from '@/constants/route';
import ClearIcon from '@mui/icons-material/Clear';
import { formatDate } from '@/utils/dateStringFormat';
import { FormatTruckString } from '@/utils/truckFormat';

const noRutesComponent = () => {
  return (
  <Card className="rounded-md mt-6 shadow-lg bg-gray-50 border border-gray-200">
    <CardBody className="flex flex-col items-center py-8 px-4">
      <div className="flex flex-col items-center">
        <div className="mb-4 text-gray-400">
          <ClearIcon fontSize='large' color='error' />
        </div>
        <p className="text-center text-gray-700 font-medium text-lg mb-2">
          No hay rutas asignadas para el conductor
        </p>
        <p className="text-center text-gray-500 text-sm mb-4">
          Cuando la cooperativa asigne rutas, aparecerán aquí
        </p>
      </div>
    </CardBody>
  </Card>
  );
};

const RutasConductor = () => {
  const userSession = useSelector((state) => state.userSession);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(null);
  const [routes, setRoutes] = useState([])
  const rowsPerPage = 10;

  const items = useMemo(() => {
    setPages(Math.ceil(routes.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return routes.slice(start, end);
  }, [routes, page]);

  const transform_route_data = (route) => {
    route.status = mapRouteStatus[route.status]
    return route
  }

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true)
        await getRoutesByDriverId(userSession.userId, userSession.accessToken)
        .then((response) => Promise.all(response.map(route => transform_route_data(route))))
        .then((transformed_routes) => {
          setRoutes(transformed_routes)
        })
      } catch (error) {
        console.log("Error al obtener pedidos", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }, []);


  const handleRouteDetails = (routeId) => {
    router.push(`/home/conductor/rutas/detalle/${routeId}`)
  };


  return (
    <div className="overflow-x-auto max-w-full w-full h-full text-2xs md:text-sm min-h-full flex flex-col">
      <div className='mt-4 mx-4'>
        <h1 className='text-2xl font-bold text-center'>Historial de rutas</h1>
        <h2 className='text-xl font-semibold text-start mt-2'>Aqui puede ver todas las rutas realizadas por el conductor.</h2>
        {!loading && routes.length == 0 && 
          <div className='flex justify-center items-center mt-10'>
            {noRutesComponent()}
          </div>
        }
      </div>
      {(loading || !routes) && <Spinner/>}

    {!loading && routes && 
    <div className='flex justify-between items-center m-4'>
      <div className='w-full pt-2'>
      <Table>
        <TableHeader>
          <TableColumn>Id</TableColumn>
          <TableColumn>Fecha de recolección</TableColumn>
          <TableColumn>Camión</TableColumn>
          <TableColumn>Cantidad de recolecciones</TableColumn>
          <TableColumn>Peso total [kg]</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No hay rutas para mostrar">
          {items.map((route, index) => (
            <TableRow key={index}>
              <TableCell>{route.id}</TableCell>
              <TableCell>{formatDate(route.route_requests[0].delivery_time)}</TableCell>
              <TableCell>{FormatTruckString(route.truck)}</TableCell>
              <TableCell>{route.route_requests.length}</TableCell>
              <TableCell>{route.total_weight} kg</TableCell>
              <TableCell>{route.status}</TableCell>
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
                page={page}
                color="success"
                showControls
                showShadow
                size="lg"
                variant="bordered"
                total={pages}
                onChange={(page) => setPage(page)}
              />
        </div>
        </div>
      </div>
    }
    </div>
  );
};

export default RutasConductor;
