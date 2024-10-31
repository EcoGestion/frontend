'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { getRouteById, getUserById, getRequestsByRouteId } from "@api/apiService";
import { formatDate} from '@utils/dateStringFormat';
import AddressFormat from '@utils/addressFormat';
import Spinner from '@/components/Spinner';
import { mapTruckStatus } from '@constants/truck';
import { mapRouteStatus } from '@constants/route';
import { mapRouteRequestStatus } from '@/constants/routeRequest';
import { ToastNotifier } from '@/components/ToastNotifier';
import { ToastContainer } from 'react-toastify';

const MapView = dynamic(() => import('@/components/MapWithRouteView'), { ssr: false });

const detallesRuta = (props) => {
  const router = useRouter();
  const route_id = parseInt(props.params?.id ?? '0');
  const [loading, setLoading] = useState(false);

  const [coopCoords, setCoopCoords] = useState([]);
  const [coopInfo, setCoopInfo] = useState();
  const [markers, setMarkers] = useState([]);

  const [routeInfo, setRouteInfo] = useState();
  const [requests, setRequests] = useState([]);
  const [wasteRequests, setWasteRequests] = useState([]);

  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    setLoading(true);
    try {
      const routeInfo_response = await getRouteById(route_id);
      setRouteInfo(routeInfo_response);
      setRequests(routeInfo_response.route_requests);

      const coopInfo = await getUserById(routeInfo_response.truck.coop_id);
      const coopCoordinates = [parseFloat(coopInfo?.address?.lat ?? "0"), parseFloat(coopInfo?.address?.lng ?? "0")];
      setCoopInfo(coopInfo);
      setCoopCoords(coopCoordinates);

      const wasteRequests_response = await getRequestsByRouteId(route_id);
      setMarkersFromRequests(wasteRequests_response);
      setWasteRequests(wasteRequests_response);
    } catch (error) {
      console.error(error);
      ToastNotifier.error("Error al cargar la información de la ruta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coopCoords.length > 0) {
      setRouteCoordsFromRequests();
    }
  }, [coopCoords]);


  const setMarkersFromRequests = (requests) => {
    if (coopCoords.length === 0) {
      return;
    }
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
      position: [coopCoords[0], coopCoords[1]],
      content: 'Cooperativa',
      popUp: coopInfo ? AddressFormat(coopInfo.address) : "Dirección desconocida",
    }
    ]
    setMarkers(markers);
    console.log("Markers en page: ", markers);
  };

  const setRouteCoordsFromRequests = () => {
    const routeCoords = routeInfo.route_requests
      .filter((request) => request.lat && request.lng)
      .map((request) => [parseFloat(request.lat), parseFloat(request.lng)]);
    const updatedRouteCoords = [coopCoords, ...routeCoords, coopCoords];
    console.log("Route coords en setRouteCoordsFromRequests: ", updatedRouteCoords);
    setRouteCoords(updatedRouteCoords);
  }

  const getGeneratorTextFromRequestId = (requestId) => {
    const request = wasteRequests.find((request) => request.id === requestId);
    return request ? request.generator?.username : 'Generador';
  }

  const getAddressTextFromRequestId = (requestId) => {
    const request = wasteRequests.find((request) => request.id === requestId);
    return request ? AddressFormat(request.address) : 'Dirección';
  }

  const handleRequestDetails = (requestId) => {
    router.push(`/home/conductor/rutas/recoleccion/detalles/${requestId}`);
  }

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <ToastContainer />
      <h1 className='text-2xl font-bold text-center'>Detalles de la ruta de recolección</h1>
      {loading ? (<Spinner />) : (
      <div>
        <div className='p-2'>
          <div className='grid grid-cols-3 gap-4'>
            <Card className='pl-2'>
              <CardHeader className='justify-center'>
                <h3 className='text-lg font-bold'>Detalle de la ruta</h3>
              </CardHeader>
              <Divider className="mt-2 border-t border-gray-900/10"/>
              <CardBody>
                <li>Estado: {routeInfo ? mapRouteStatus[routeInfo.status]: 'No definido'}</li>
                <li>Peso total: {routeInfo?.total_weight} kg</li>
                <li>Fecha de retiro: {routeInfo ? formatDate(routeInfo.created_at) : 'No definido'}</li>
                <li>Ultima actualizacion: {routeInfo ? formatDate(routeInfo.updated_at): 'No definido'}</li>
              </CardBody>
            </Card>
            <Card className='pl-2'>
              <CardHeader className='justify-center'>
                <h3 className='text-lg font-bold'>Camión asignado</h3>
              </CardHeader>
              <Divider className="mt-2 border-t border-gray-900/10"/>
              <CardBody>
                <li>Patente: {routeInfo?.truck.patent}</li>
                <li>Marca: {routeInfo?.truck.brand}</li>
                <li>Modelo: {routeInfo?.truck.model}</li>
                <li>Capacidad: {routeInfo?.truck.capacity}</li>
                <li>Estado: {routeInfo ? mapTruckStatus[routeInfo.truck.status] : ""}</li>
              </CardBody>
            </Card>
            <Card className='pl-2'>
              <CardHeader className='justify-center'>
                <h3 className='text-lg font-bold'>Conductor asignado</h3>
              </CardHeader>
              <Divider className="mt-2 border-t border-gray-900/10"/>
              <CardBody>
                <li>Nombre: {routeInfo?.driver.username}</li>
                <li>Email: {routeInfo?.driver.email}</li>
                <li>Teléfono: {routeInfo?.driver.phone}</li>
              </CardBody>
            </Card>
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold'>Recolecciones incluidas en la ruta</h2>
          <Table>
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Generador</TableColumn>
              <TableColumn>Dirección</TableColumn>
              <TableColumn>Fecha de retiro</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Acciónes</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No hay solicitudes para seleccionar"}>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.request_id}</TableCell>
                  <TableCell>{getGeneratorTextFromRequestId(request.request_id)}</TableCell>
                  <TableCell>{getAddressTextFromRequestId(request.request_id)}</TableCell>
                  <TableCell>{request.status === 'COMPLETED' ? formatDate(request.delivery_time) : ' - '}</TableCell>
                  <TableCell>{mapRouteRequestStatus[request.status]}</TableCell>
                  <TableCell>
                    <button className='bg-white text-green-dark px-4 py-2 rounded-2xl border border-green-800' onClick={()=>handleRequestDetails(request.request_id)}>
                      Ver detalles
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='p-2 mt-4'>
          <h2 className='text-xl'>Recorrido</h2>
          <MapView centerCoordinates={coopCoords} zoom={14} markers={markers} routeCoordinates={routeCoords}/>
        </div>
      </div>
      )}
    </div>
  );
};

export default detallesRuta;
