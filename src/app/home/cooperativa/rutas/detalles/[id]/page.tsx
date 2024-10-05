'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { getCoopPendingRequests, getUserById } from "@api/apiService";
import { WasteCollectionRequests, WasteQuantities, WasteCollectionRequest } from '@/types';
import {formatDateRange, formatDate} from '@utils/dateStringFormat';
import AddressFormat from '@utils/addressFormat';
import Spinner from '@/components/Spinner';
import { ToastContainer } from 'react-toastify';
import { mapTruckStatus } from '@constants/truck';
import { useRouter } from 'next/navigation';
import { mapRequestStatus } from '@constants/request';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface Marker {
  position: number[];
  content: string;
  popUp: string;
}

const mockDetails = {
  "truck": {
    "id": 1,
    "patent": "TFW624",
    "brand": "Ford",
    "model": "2008",
    "capacity": 10,
    "status": "ENABLED",
    "created_at": "2024-10-04T00:25:18",
    "updated_at": null
  },
  "driver": {
    "id": 1,
    "username": "Juan Perez",
    "email": "driver@test.com",
    "phone": "123456789",
    "status": "ENABLED",
  },
  "total_weight": 5,
  "delivery_time": "2024-10-04T00:25:18",
  "id": 5,
  "status": "CREATED",
  "created_at": "2024-10-04T00:25:18",
  "updated_at": null
}

const mockRequests = [
  {
    "id": 1,
    "request_date": "2024-10-04T00:25:18",
    "pickup_date_from": "2024-10-04T00:25:18",
    "pickup_date_to": "2024-10-04T00:25:18",
    "status": "COMPLETED",
    "address": {
      "id": 1,
      "street": "Calle Falsa 123",
      "zone": "Zona 1",
      "lat": "-34.603722",
      "lng": "-58.381592",
      "created_at": "2024-10-04T00:25:18",
      "updated_at": null
    },
    "generator": {
      "id": 1,
      "username": "Juan Perez",
      "email": "juan@gen.com",
      "phone": "123456789",
      "status": "ENABLED",
    },
    "waste_quantities": [
        {
            "id": 17,
            "waste_type": "Plastico",
            "quantity": 50,
            "waste_collection_request_id": 1
        },
        {
            "id": 18,
            "waste_type": "Vidrio",
            "quantity": 500,
            "waste_collection_request_id": 1
        },
        {
            "id": 19,
            "waste_type": "Cartón",
            "quantity": 150,
            "waste_collection_request_id": 1
        }
    ]
  },
  {
    "id": 2,
    "request_date": "2024-10-04T00:25:18",
    "pickup_date_from": "2024-10-04T00:25:18",
    "pickup_date_to": "2024-10-04T00:25:18",
    "status": "COMPLETED",
    "address": {
      "id": 2,
      "street": "Calle Falsa 123",
      "zone": "Zona 2",
      "lat": "-34.603722",
      "lng": "-58.381592",
      "created_at": "2024-10-04T00:25:18",
      "updated_at": null
    },
    "generator": {
      "id": 2,
      "username": "Hotel 5 estrellas",
      "email": "hotel@gmail.com",
      "phone": "123456789",
      "status": "ENABLED",
    },
    "waste_quantities": [
        {
            "id": 20,
            "waste_type": "Carton",
            "quantity": 10,
            "waste_collection_request_id": 2
        }
    ]
  },
  {
    "id": 3,
    "request_date": "2024-10-04T00:25:18",
    "pickup_date_from": "2024-10-04T00:25:18",
    "pickup_date_to": "2024-10-04T00:25:18",
    "status": "REPROGRAMED",
    "address": {
      "id": 3,
      "street": "Calle Falsa 123",
      "zone": "Zona 3",
      "lat": "-34.603722",
      "lng": "-58.381592",
      "created_at": "2024-10-04T00:25:18",
      "updated_at": null
    },
    "generator": {
      "id": 3,
      "username": "Hotel Rivadavia",
      "email": "hotel@rivadavia.com",
      "phone": "123456789",
      "status": "ENABLED",
    },
    "waste_quantities": [
        {
            "id": 21,
            "waste_type": "Papel",
            "quantity": 60,
            "waste_collection_request_id": 3
        }
    ]
  }
];
    

const detallesRuta = (props: {params?: { id?: string } }) => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const [loading, setLoading] = useState(false);

  const [coopCoords, setCoopCoords] = useState([0,0]);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [requests, setRequests] = useState<WasteCollectionRequests>([]);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    setLoading(true);
    try {
      const userInfo = await getUserById(userSession.userId);
      setCoopCoords([parseFloat(userInfo.address.lat), parseFloat(userInfo.address.lng)]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const setMarkersFromRequests = (requests: WasteCollectionRequests) => {
    const markers = requests
      .filter((request) => request.address && request.generator)
      .map((request) => ({
        position: [
          parseFloat(request.address?.lat ?? "0"), 
          parseFloat(request.address?.lng ?? "0")
        ],
        content: request.generator?.username ?? "Desconocido",
        popUp: request.address ? AddressFormat(request.address) : "Dirección desconocida",
      }));
    setMarkers(markers);
  };

  const formatWasteQuantities = (wasteQuantities: WasteQuantities): string => {
    return wasteQuantities.map(waste => `${waste.waste_type}: ${waste.quantity} kg`).join(', ');
  };

  return (
    <div className='flex flex-col h-screen p-3 gap-3'>
      <h1 className='text-2xl font-bold text-center'>Detalles de la ruta de recolección</h1>
      {loading ? (<Spinner />) : (
      <div>
        <div className='p-2'>
          <div className='grid grid-cols-2 gap-4'>
            <Card className='pl-2'>
              <CardHeader className='justify-center'>
                <h3 className='text-lg font-bold'>Camión asignado</h3>
              </CardHeader>
              <Divider className="mt-2 border-t border-gray-900/10"/>
              <CardBody>
                <li>Patente: {mockDetails.truck.patent}</li>
                <li>Marca: {mockDetails.truck.brand}</li>
                <li>Modelo: {mockDetails.truck.model}</li>
                <li>Capacidad: {mockDetails.truck.capacity}</li>
                <li>Estado: {mapTruckStatus['ENABLED']}</li>
              </CardBody>
            </Card>
            <Card className='pl-2'>
              <CardHeader className='justify-center'>
                <h3 className='text-lg font-bold'>Conductor asignado</h3>
              </CardHeader>
              <Divider className="mt-2 border-t border-gray-900/10"/>
              <CardBody>
                <li>Nombre: {mockDetails.driver.username}</li>
                <li>Email: {mockDetails.driver.email}</li>
                <li>Teléfono: {mockDetails.driver.phone}</li>
                <li>Estado: {mockDetails.driver.status}</li>
              </CardBody>
            </Card>
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold'>Recolecciones incluidas en la ruta</h2>
          <Table>
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Fecha de retiro</TableColumn>
              <TableColumn>Recolección</TableColumn>
              <TableColumn>Zona</TableColumn>
              <TableColumn>Direccion</TableColumn>
              <TableColumn>Estado</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No hay solicitudes para seleccionar"}>
              {mockRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{formatWasteQuantities(request.waste_quantities)}</TableCell>
                  <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                  <TableCell>{request.address ? request.address.zone : ""}</TableCell>
                  <TableCell>{request.address ? AddressFormat(request.address) : ""}</TableCell>
                  <TableCell>{mapRequestStatus['COMPLETED']}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='p-2 mt-4'>
          <h2 className='text-xl'>Recorrido</h2>
          <MapView centerCoordinates={coopCoords} zoom={12} markers={markers}/>
        </div>
      </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default detallesRuta;
