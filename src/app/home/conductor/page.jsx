'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn, Input, Select, SelectItem, Pagination
 } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import 'dotenv/config';
import AddressFormat from '@utils/addressFormat';
import Spinner from '../../../components/Spinner';
import { getRequestsByRouteId, getRoutesByDriverId, startRouteById, getRouteById, updateRouteRequestById, getUserById, verifyGeneratorCode, getDriverHomeRoutes} from '@api/apiService';
import "./style.css"
import Route from "../conductor/components/Route"
import { ToastNotifier } from '@/components/ToastNotifier';
import zones from '@/constants/zones';
import AcceptConfirmationModal from '@components/AcceptConfirmationModal';
import CodeConfirmationModal from '@components/CodeConfirmationModal';
import { ToastContainer } from 'react-toastify';
import { RouteStatus, mapRouteStatus, mapRouteStatusToKey } from '@/constants/route';
import { RequestStatus, mapRequestStatus, mapRequestStatusToKey } from '@/constants/request';
import { RouteRequestStatus, mapRouteRequestStatus, mapRouteRequestStatusToKey} from '@/constants/routeRequest';
import ClearIcon from '@mui/icons-material/Clear';

const MapView = dynamic(() => import('@/components/MapWithRouteView'), { ssr: false });

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

const HomeConductor = () => {
  const userSession = useSelector((state) => state.userSession);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(null);
  const [requests, setRequests] = useState(null)
  const [wastes, setWastes] = useState(null)
  const [routes, setRoutes] = useState(null)
  const [coords, setCoords] = useState([0,0]);
  const [markers, setMarkers] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [filters, setFilters] = useState({ zone: [], status: [], generator: '' });
  const [points, setPoints] = useState(null)

  const [loading, setLoading] = useState(true);
  const [routeActive, setRouteActive] = useState(null);
  const rowsPerPage = 5;
  const router = useRouter();

  const [routeToStart, setRouteToStart] = useState(null);
  const [requestToConfirm, setRequestToConfirm] = useState(null);
  const [indexToConfirm, setIndexToConfirm] = useState(null);
  const [requestToReprogram, setRequestToReprogram] = useState(null);

  const [isModalStartRouteOpen, setIsModalStartRouteOpen] = useState(false);
  const [isModalConfirmRequestOpen, setIsModalConfirmRequestOpen] = useState(false);
  const [isModalReprogramRequestOpen, setIsModalReprogramRequestOpen] = useState(false);

  const [refreshValue, setRefreshValue] = useState(false);

  const refresh = () => {
    setRefreshValue(!refreshValue)
  }

  const filteredRequests = requests?.filter(request => {
    return (
      (!filters.generator || request.generator.username.toLowerCase().includes(filters.generator.toLowerCase())) &&
      (filters.zone.length == 0 || (filters.zone.length == 1 && !filters.zone[0]) || filters.zone.includes(request.address.zone)) &&
      (filters.status.length == 0 || (filters.status.length == 1 && !filters.status[0])  || filters.status.includes(mapRouteRequestStatusToKey[request.route_request_status]))
    );
  });

  useEffect(() => {
    if (filteredRequests) {
      setPages(Math.ceil(filteredRequests.length / rowsPerPage)); 
    } 
  }, [requests, filters]);

  const get_orders = React.useMemo(() => {
    if (filteredRequests) {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return filteredRequests.slice(start, end);
    }
    else
      return []
  
  }, [page, filteredRequests]);

  const transform_requests = (request) => {
    const status = getRequestStatus(request.id);
    request.route_request_status = mapRouteRequestStatus[status];
    request.route_request_id = getRequestId(request.id)
    return request
  }

  const transform_route_data = (route) => {
    route.status = mapRouteStatus[route.status]
    return route
  }

  const getRequestStatus = (requestId) => {
    const request = wastes.find((request) => request.request_id === requestId);
    return request.status;
  }

  const getRequestId = (requestId) => {
    const request = wastes.find((request) => request.request_id === requestId);
    return request.id;
}

  useEffect(() => {
    const fetchRequestsByRouteId = async () => {
      if(wastes) {
        try {
          setLoading(true)
          await getRequestsByRouteId(routeActive)
          .then((response) => Promise.all(response.map(request => transform_requests(request))))
          .then(async (transformed) => {
            const coop = await getUserById(transformed[0].coop_id)
            setRequests(transformed)
            setMarkersFromRequests(transformed, coop);
          })
        } catch (error) {
          console.log("Error al obtener rutas", error);
          ToastNotifier.error("Error al obtener rutas\nPor favor, intente nuevamente")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchRequestsByRouteId()
  }, [wastes])

  useEffect(() => {
    const fetchActiveRoute = async () => {
      if(routeActive) {
        try {
          setLoading(true)
          await getRouteById(routeActive)
          .then(async (response) => {
            setWastes(response.route_requests)
            const coop = await getUserById(response.truck.coop_id)
            setCoords([parseFloat(coop.address.lat), parseFloat(coop.address.lng)]);
            setRouteCoordsFromRequests(response.route_requests, coop.address);
          })
        } catch (error) {
          console.log("Error al obtener rutas", error);
          ToastNotifier.error("Error al obtener rutas\nPor favor, intente nuevamente")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchActiveRoute()
  }, [routeActive])

  const setMarkersFromRequests = (requests, coopInfo) => {
    const genMarkers = requests
      .map((request) => ({
        position: [
          parseFloat(request.address?.lat ?? "0"), 
          parseFloat(request.address?.lng ?? "0")
        ],
        content: request.generator?.username ?? "Desconocido",
        popUp: request.address ? AddressFormat(request.address) : "Dirección desconocida",
      }));
    const markers = [...genMarkers, {
      position: [parseFloat(coopInfo.address.lat), parseFloat(coopInfo.address.lng)],
      content: 'Cooperativa',
      popUp: AddressFormat(coopInfo.address),
    }
    ]
    setMarkers(markers);
    console.log("Markers en page: ", markers);
  };

  const setRouteCoordsFromRequests = (requests, coopAddress) => {
    const coopCoords = [parseFloat(coopAddress.lat), parseFloat(coopAddress.lng)];
    const routeCoords = requests
      .filter((request) => request.lat && request.lng)
      .map((request) => [parseFloat(request.lat), parseFloat(request.lng)]);
    const updatedRouteCoords = [coopCoords, ...routeCoords, coopCoords];
    setRouteCoords(updatedRouteCoords);
  }

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true)
        await getDriverHomeRoutes(userSession.userId)
        .then((response) => Promise.all(response.map(route => transform_route_data(route))))
        .then((transformed_routes) => {
          const activeRoute = transformed_routes.find(route => route.status === "En proceso")
          if(activeRoute) {
            setRouteActive(activeRoute.id)
          }
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

  const redirectDetailPage = (rowData) => {
    router.push(`/home/conductor/rutas/recoleccion/detalles/${rowData.id}`)
  };

  const startRoute = async (id) => {
    setRouteToStart(id);
    setIsModalStartRouteOpen(true);
  };

  const handleStartRoute = async () => {
    await startRouteById(routeToStart)
    .then(() => setRouteActive(routeToStart))
    .catch((error) => {
      console.log("Error al comenzar ruta", error);
      ToastNotifier.error("Error al comenzar ruta\nPor favor, intente nuevamente")
    })
    setIsModalStartRouteOpen(false);
  };

  const confirmRequest = (route_request_id, index) => {
    setRequestToConfirm(route_request_id);
    setIndexToConfirm(index);
    setIsModalConfirmRequestOpen(true);
  };

  const handleConfirmRequest = async (code) => {
    try {
      const verification = await verifyGeneratorCode(requestToConfirm, code);
      if (verification.passed) {
        await updateRouteRequest(indexToConfirm, routeActive, "COMPLETED");
        ToastNotifier.success("Solicitud completada");
      } else {
        ToastNotifier.warning("Código incorrecto");
      }
    } catch (error) {
      console.log("Error al confirmar solicitud", error);
      ToastNotifier.error("Error al confirmar solicitud\nPor favor, intente nuevamente")
    } finally {
      setIsModalConfirmRequestOpen(false);
    }
  };

  const reprogramRequest = (id) => {
    setRequestToReprogram(id);
    setIsModalReprogramRequestOpen(true);
  };

  const handleReprogramRequest = async () => {
    try {
      await updateRouteRequest(requestToReprogram, routeActive, "REPROGRAMED");
      ToastNotifier.success("Solicitud reprogramada");
    } catch (error) {
      console.log("Error al reprogramar solicitud", error);
      ToastNotifier.error("Error al reprogramar solicitud\nPor favor, intente nuevamente")
    } finally {
      setIsModalReprogramRequestOpen(false);
    }
  };

  const cancelRoute = (rowData) => {
    // Cancelar ruta
  };

  const updateRouteRequest = async (id, routeId, status) => {
    setLoading(true)
    await updateRouteRequestById(id, routeId, status)
    .then((response) => {
      if(response.route_status == "COMPLETED" || response.route_status == "PARTIALLY_COMPLETED") {
        setRouteActive(null)
        setWastes(null)
        setRequests(null)
        setRoutes(prevRoutes => 
          prevRoutes.map(route => 
              route.id === routeId ? { ...route, status: "Completada" } : route
          )
        );
        setLoading(false)
      }
      else{
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.route_request_id === id ? { ...request, route_request_status: mapRouteRequestStatus[status] } : request
          )
        );
        setLoading(false)
      }  
    }).catch((error) => {
      console.log("Error al actualizar solicitud:", error);
      setLoading(false);
      throw error;
    })
  };

  return (
    <div className="overflow-x-auto max-w-full w-full h-full text-2xs md:text-sm min-h-full flex flex-col">
      <ToastContainer />
      <AcceptConfirmationModal isOpen={isModalStartRouteOpen} onRequestClose={() => setIsModalStartRouteOpen(false)} onConfirm={handleStartRoute} title="¿Seguro que desea comenzar la ruta?" />
      <CodeConfirmationModal isOpen={isModalConfirmRequestOpen} onRequestClose={() => setIsModalConfirmRequestOpen(false)} onConfirm={handleConfirmRequest} />
      <AcceptConfirmationModal isOpen={isModalReprogramRequestOpen} onRequestClose={() => setIsModalReprogramRequestOpen(false)} onConfirm={handleReprogramRequest} title="¿Seguro que desea reprogramar la solicitud?" />
      <div className='mt-4 mx-4'>
        <h1 className='text-2xl font-bold text-center'>Bienvenido</h1>
        <h2 className='text-xl font-semibold text-start mt-2'>Aqui puede ver las rutas que la cooperativa le asignó y se encuentran en progreso o pendientes de iniciar</h2>
        {routes && routes.length == 0 && 
          <div className='flex justify-center items-center mt-10'>
            {noRutesComponent()}
          </div>
        }
      </div>
      {(loading || !routes) && <Spinner/>}

    {!loading && routes && 
      <div className='flex flex-col mx-4 my-4'>
        {routes.map((route) => (
          <Route route={route} startRoute={startRoute} cancelRoute={cancelRoute}></Route>
        ))}
      </div>
    }

    {!loading && requests &&
    <div className='flex justify-between items-center mt-4 mx-4'>
        <p className='text-start text-xl font-bold ml-2'>Recolecciónes de la ruta</p>
    </div>
    }

    {!loading && requests &&
      <div className='flex flex-col mx-4 my-4 gap-2'>
          <Card className='rounded-md'>
          <CardBody className='p-0'>
          <div className="flex gap-4 items-center my-3 mx-4">
            <Input
              className='select'
              placeholder="Generador"
              onChange={(e) => {
                setFilters({...filters, generator: e.target.value})
              }}>
            </Input>
            <Select
              className='select'
              placeholder="Zona"
              value={filters.zone}
              options={zones}
              selectionMode="multiple"
              onChange={(e) => setFilters({ ...filters, zone: e.target.value.split(',') })}
            >
                {zones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
            </Select>
            <Select
              className='select'
              placeholder="Estado"
              value={filters.status}
              options={RouteRequestStatus}
              selectionMode="multiple"
              onChange={(e) => setFilters({ ...filters, status: e.target.value.split(',') })}
            >
            {RouteRequestStatus.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
            </Select>
          </div>
          </CardBody>
          </Card>
          <Table
          bottomContent={
            <div className="flex w-full justify-between items-center">
              <span className='flex 1 invisible'>{get_orders.length} de {filteredRequests.length} solicitudes</span>
              <Pagination
                className='flex 1'
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
              <span className='flex 1'>{get_orders.length} de {filteredRequests.length} solicitudes</span>
            </div>}>
            <TableHeader>
              <TableColumn>Id</TableColumn>
              <TableColumn>Nombre generador</TableColumn>
              <TableColumn>Dirección</TableColumn>
              <TableColumn>Zona</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {get_orders.map((request, index) => (
                <TableRow key={index}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.generator.username}</TableCell>
                  <TableCell>{request.address? request.address.street : request.generator.address.street} {request.address? request.address.number : request.generator.address.number}</TableCell>
                  <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                  <TableCell>{request.route_request_status}</TableCell>
                  <TableCell>
                    <div className='flex gap-3'>
                      <Button className="" onClick={() => redirectDetailPage(request)}>Ver</Button>
                      {request.route_request_status != "Completada" & request.route_request_status != "Reprogramada" &&
                      <Button className='bg-white text-green-dark px-3 py-2 rounded-medium border-medium border-green-dark' onClick={() => confirmRequest(request.route_request_id, index + 1)}>Completar</Button> }
                      {(request.route_request_status == "Pendiente" || request.route_request_status == "En ruta") &&
                      <Button className='bg-white text-red-dark px-3 py-2 rounded-medium border-medium border-red-dark' onClick={() => reprogramRequest(index + 1)}>Reprogramar</Button>
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    }

      {/*!loading && requests &&
      <div className='p-2 mt-4'>
          <h2 className='text-xl'>Recorrido</h2>
          <MapView centerCoordinates={coords} zoom={14} markers={markers} routeCoordinates={routeCoords}/>
      </div>
      */}
    </div>
  );
};

export default HomeConductor;
