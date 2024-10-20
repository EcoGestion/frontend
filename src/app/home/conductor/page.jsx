'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn, Input, Select, SelectItem, Pagination
 } from '@nextui-org/react';
 import {RadioGroup, Radio, cn} from "@nextui-org/react";
import dynamic from 'next/dynamic';
import 'dotenv/config';
import AddressFormat from '@utils/addressFormat';
import { useUser } from '../../../state/userProvider';
import Spinner from '../../../components/Spinner';
import { getRequestsByRouteId, getRoutesByDriverId, startRouteById, getRouteById, updateRouteRequestById, getUserById} from '../../../api/apiService';
import "./style.css"
import Route from "../conductor/components/Route"
import { RequestStatus } from '@/constants/request';

const MapView = dynamic(() => import('@/components/MapWithRouteView'), { ssr: false });

const zones = [
  { value: "Abasto", label: "Abasto" },
  { value: "Almagro", label: "Almagro" },
  { value: "Balvanera", label: "Balvanera" },
  { value: "Barracas", label: "Barracas" },
  { value: "Belgrano", label: "Belgrano" },
  { value: "Boedo", label: "Boedo" },
  { value: "Caballito", label: "Caballito" },
  { value: "Centro", label: "Centro" },
  { value: "Chacarita", label: "Chacarita" },
  { value: "Coghlan", label: "Coghlan" },
  { value: "Colegiales", label: "Colegiales" },
  { value: "Constitución", label: "Constitución" },
  { value: "Devoto", label: "Devoto" },
  { value: "Flores", label: "Flores" },
  { value: "Floresta", label: "Floresta" },
  { value: "La Boca", label: "La Boca" },
  { value: "La Paternal", label: "La Paternal" },
  { value: "Liniers", label: "Liniers" },
  { value: "Mataderos", label: "Mataderos" },
  { value: "Monte Castro", label: "Monte Castro" },
  { value: "Morón", label: "Morón" },
  { value: "Núñez", label: "Núñez" },
  { value: "Palermo", label: "Palermo" },
  { value: "Paternal", label: "Paternal" },
  { value: "Puerto Madero", label: "Puerto Madero" },
  { value: "Recoleta", label: "Recoleta" },
  { value: "Retiro", label: "Retiro" },
  { value: "Saavedra", label: "Saavedra" },
  { value: "San Cristóbal", label: "San Cristóbal" },
  { value: "San Nicolás", label: "San Nicolás" },
  { value: "San Telmo", label: "San Telmo" },
  { value: "Villa Devoto", label: "Villa Devoto" },
  { value: "Villa del Parque", label: "Villa del Parque" },
  { value: "Villa Luro", label: "Villa Luro" },
  { value: "Villa Ortúzar", label: "Villa Ortúzar" },
  { value: "Villa Real", label: "Villa Real" },
  { value: "Villa Santa Rita", label: "Villa Santa Rita" },
  { value: "Villa Urquiza", label: "Villa Urquiza" }
];

const generatorTypes = [
{ value: "Restaurante", label: "Restaurante" },
{ value: "Edificio", label: "Edificio" },
{ value: "Empresa", label: "Empresa" },
{ value: "Oficina", label: "Oficina" },
{ value: "Hotel", label: "Hotel" },
{ value: "Fábrica", label: "Fábrica" },
{ value: "Club", label: "Club" },
{ value: "Institución Educativa", label: "Institución Educativa" },
{ value: "Hospital", label: "Hospital" },
{ value: "Mercado", label: "Mercado" },
{ value: "Otro", label: "Otro" }
];

const wasteTypes = [
{ label: 'Papel', value: 'Papel' },
{ label: 'Metal', value: 'Metal' },
{ label: 'Vidrio', value: 'Vidrio' },
{ label: 'Plástico', value: 'Plastico' },
{ label: 'Cartón', value: 'Cartón' },
{ label: 'Tetra Brik', value: 'Tetra Brik' },
{ label: 'Telgopor', value: 'Telgopor' },
{ label: 'Pilas', value: 'Pilas' },
{ label: 'Aceite', value: 'Aceite' },
{ label: 'Electrónicos', value: 'Electrónicos' }
];

const MockData = [
  {
    "request_date": "2024-09-01T00:00:00",
    "generator_id": 42,
    "status": "OPEN",
    "pickup_date_from": "2024-09-18T12:00:00",
    "zone": "Palermo",
    "id": 15,
    "coop_id": 50,
    "details": "2do piso",
    "pickup_date_to": "2024-09-20T18:00:00",
    "generator": {
        "username": "Test Gen",
        "email": "teo@test.com",
        "type": "GEN_BUILDING",
        "address_id": 2,
        "id": 42,
        "firebase_id": "4QM0hPEgrshWXnar8NG6dD08EPo1",
        "phone": "123456"
    },
    "coop": {
        "username": "Coop",
        "email": "coop@mail.com",
        "type": "COOP",
        "address_id": 10,
        "id": 50,
        "firebase_id": "wKRF2UykszP54caWiTo7U8lbxG02",
        "phone": "121212"
    }
  },
  {
    "request_date": "2024-09-01T00:00:00",
    "generator_id": 42,
    "status": "OPEN",
    "pickup_date_from": "2024-09-18T12:00:00",
    "zone": "Palermo",
    "id": 16,
    "coop_id": 50,
    "details": "2do piso",
    "pickup_date_to": "2024-09-20T18:00:00",
    "generator": {
        "username": "Test Gen",
        "email": "gen@test.com",
        "type": "GEN_OFFICE",
        "address_id": 3,
        "id": 42,
        "firebase_id": "4QM0hPEgrshWXnar8NG6dD08EPo1",
        "phone": "123456"
    },
    "coop": {
        "username": "Coop",
        "email": "coop@mail.com",
        "type": "COOP",
        "address_id": 10,
        "id": 50,
        "firebase_id": "wKRF2UykszP54caWiTo7U8lbxG02",
        "phone": "121212"
    }
  },
  {
    "request_date": "2024-09-01T00:00:00",
    "generator_id": 42,
    "status": "OPEN",
    "pickup_date_from": "2024-09-18T12:00:00",
    "zone": "Palermo",
    "id": 17,
    "coop_id": 50,
    "details": "2do piso",
    "pickup_date_to": "2024-09-20T18:00:00",
    "generator": {
        "username": "Test Gen",
        "email": "gen_hotel@gmail.com",
        "type": "GEN_HOTEL",
        "address_id": 4,
        "id": 42,
        "firebase_id": "4QM0hPEgrshWXnar8NG6dD08EPo1",
        "phone": "123456"
    },
    "coop": {
        "username": "Coop",
        "email": "coop@mail.com",
        "type": "COOP",
        "address_id": 10,
        "id": 50,
        "firebase_id": "wKRF2UykszP54caWiTo7U8lbxG02",
        "phone": "121212"
    }
  }
]

const HomeConductor = () => {
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

  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [routeActive, setRouteActive] = useState(null);
  const [userId, setUserId] = useState(null);
  const rowsPerPage = 5;
  const router = useRouter();

  const filteredRequests = requests?.filter(request => {
    return (
      (!filters.generator || request.generator.username.toLowerCase().includes(filters.generator.toLowerCase())) &&
      (filters.zone.length == 0 || (filters.zone.length == 1 && !filters.zone[0]) || filters.zone.includes(request.address.zone)) &&
      (filters.status.length == 0 || (filters.status.length == 1 && !filters.status[0])  || filters.status.includes(request.route_request_status))
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

  const getStatus = (status) => {
    switch (status) {
        case 'REJECTED':
            return 'Cancelada';
  
        case 'COMPLETED':
            return 'Completada';
  
        case 'PENDING':
            return 'En proceso';
  
        case 'OPEN':
            return 'Ingresada';
  
        case 'ON_ROUTE':
            return 'En ruta';
    }
  }

  const getRouteStatus = (status) => {
    switch (status) {
        case 'CANCELED':
            return 'Cancelada';
  
        case 'COMPLETED':
            return 'Completada';
  
        case 'IN_PROGRESS':
            return 'En proceso';
  
        case 'CREATED':
            return 'Creada';
    }
  }

  const getRouteRequestStatus = (status) => {
    switch (status) {
        case 'REPROGRAMED':
            return 'Reprogramada';
  
        case 'COMPLETED':
            return 'Completada';
  
        case 'ON_ROUTE':
            return 'En ruta';
  
        case 'PENDING':
            return 'Pendiente';
    }
  }
  
  const getGeneratorType = (type) => {
    switch (type) {
      case "GEN_RESTAURANT":
          return 'Restaurante';
  
      case "GEN_BUILDING":
          return 'Edificio';
  
      case "GEN_COMPANY":
          return 'Empresa';
  
      case "GEN_OFFICE":
          return 'Oficina';
  
      case "GEN_HOTEL":
          return 'Hotel';
  
      case "GEN_FACTORY":
          return 'Fábrica';
  
      case "GEN_CLUB":
          return 'Club';
  
      case "GEN_EDUCATIONAL_INSTITUTION":
          return 'Institución Educativa';
  
      case "GEN_HOSPITAL":
          return 'Hospital';
  
      case "GEN_MARKET":
          return 'Mercado';
  
      case "GEN_OTHER":
          return 'Otro';
    }
  }

  const formatDate = (value) => {
    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
  
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
    };

    const dateString = value.toLocaleDateString('en-GB', dateOptions);
    const timeString = value.toLocaleTimeString('en-GB', timeOptions);
  
    return `${dateString} ${timeString}`;
  };

  const formatWasteType = (value) => {
    return value.join(", ");
  };

  const transform_requests = async (request) => {
    request.route_request_status = getRouteRequestStatus(getRequestStatus(request.id))
    request.route_request_id = getRequestId(request.id)
    return request
}

const transform_route_data = async (route) => {
  console.log("RUTA")
  console.log(route)
  route.created_at = new Date(route.created_at)
  route.status = getRouteStatus(route.status)
  return route
}

const filter_daily_orders = (orders) => {
  const today = new Date(Date.now())
  return orders.filter(order => {
    const date = new Date(order.pickup_date_from)

    return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  })
}

const filter_daily_routes = (routes) => {
  console.log("RUTITAS")
  console.log(routes)
  const today = new Date(Date.now())
  console.log(today)
  return routes.filter(route => {
    const date = route.created_at

    return date.getFullYear() <= today.getFullYear() &&
    date.getMonth() <= today.getMonth() &&
    date.getDate() <= today.getDate()
  })
}

const filter_canceled = (routes) => {
  return routes.filter(route => {
    return route.status != "Cancelada"
  })
}

const getPoints = (order, address) => {
  return { position: [parseFloat(address.lat), parseFloat(address.lng)], content: order.generator.username, popUp: `${address.street} ${address.number}`}
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
  const fetchOrders = async () => {
    if(wastes) {
      console.log("PIDO REQUESTSS")
      console.log(wastes)
      await getRequestsByRouteId(routeActive)
      .then((response) => Promise.all(response.map(request => transform_requests(request))))
      .then(async (transformed) => {
        const coop = await getUserById(transformed[0].coop_id)
        setRequests(transformed)
        setMarkersFromRequests(transformed, coop);
      })
      .then(() => setLoading(false))
    }
  }
  fetchOrders()
}, [wastes])

useEffect(() => {
  const fetchOrders = async () => {
    if(routeActive) {
      console.log("PIDO RUTARDA")
      await getRouteById(routeActive)
      .then(async (response) => {
        setWastes(response.route_requests)
        const coop = await getUserById(response.truck.coop_id)
        setCoords([parseFloat(coop.address.lat), parseFloat(coop.address.lng)]);
        setRouteCoordsFromRequests(response.route_requests, coop.address);
      })
    }
  }
  fetchOrders()
}, [routeActive])

const setMarkersFromRequests = (requests, coopInfo) => {
  console.log("Requests en page: ", requests);
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
  const fetchOrders = async () => {
    if (user.userId) {
      console.log(user)
      try {
        setUserId(user.userId)
        await getRoutesByDriverId(user.userId)
        .then((response) => Promise.all(response.map(route => transform_route_data(route))))
        .then((transformed_routes) => {
          //const filtered_routes = filter_daily_routes(transformed_routes)
          const filtered_routes = filter_canceled(transformed_routes)
          const activeRoute = filtered_routes.find(route => route.status === "En proceso")
          if(activeRoute) {
            console.log("HAY ACTIVA")
            setRouteActive(activeRoute.id)
          }
          else{
            setLoading(false)
          }
          setRoutes(filtered_routes)
        })
        
      } catch (error) {
        console.log("Error al obtener pedidos", error);
      } 
    } else {
      setLoading(false);
    }
  };

  fetchOrders();
}, [user.userId]);

const redirectDetailPage = (rowData) => {
  router.replace(`/home/conductor/rutas/recoleccion/detalles/${rowData.id}`)
};

const startRoute = async (id) => {
  await startRouteById(id)
  .then(() => setRouteActive(id))
};

const cancelRoute = (rowData) => {
  router.replace(`/home/cooperativa/pedidos/detalles/${rowData.id}`)
};

const updateRouteRequest = async (id, routeId, status) => {
  setLoading(true)
  await updateRouteRequestById(id, routeId, status)
  .then((response) => {
    if(response.route_status == "COMPLETED"){
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
          request.route_request_id === id ? { ...request, route_request_status: getRouteRequestStatus(status) } : request
        )
      );
      setLoading(false)
    }
    
})
};

function formatDateRange(date_from, date_to) {
  const fromDate = new Date(date_from);
  const toDate = new Date(date_to);

  const day = fromDate.getDate().toString().padStart(2, '0');
  const month = (fromDate.getMonth() + 1).toString().padStart(2, '0');
  const year = fromDate.getFullYear();

  const fromHours = fromDate.getHours().toString().padStart(2, '0');
  const fromMinutes = fromDate.getMinutes().toString().padStart(2, '0');

  const toHours = toDate.getHours().toString().padStart(2, '0');
  const toMinutes = toDate.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${fromHours}:${fromMinutes} - ${toHours}:${toMinutes}`;
}

  return (
    <div className='flex flex-col p-4 gap-3 h-screen'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Bienvenido!</h1>
      </div>
      {(loading || !routes) && <Spinner/>}

    {!loading && routes && 
      <div className='flex flex-col'>
        {routes.map((route) => (
          <Route route={route} startRoute={startRoute} cancelRoute={cancelRoute}></Route>
        ))}
      </div>
    }

      <div className='flex flex-col gap-2 w-full home-col'>
      {!loading && requests &&
          <Card className='lg:mx-9 my-4'>
            <CardHeader className='bg-green-dark text-white pl-4 text-xl font-bold py-3'>RECOLECCIONES DEL DÍA</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <div className="flex gap-4 m-4">
                <Input
                  className='select h-14'
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
                  options={RequestStatus}
                  selectionMode="multiple"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value.split(',') })}
                >
                    {RequestStatus.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                </Select>
                </div>
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
                  <TableColumn>Nombre generador</TableColumn>
                  <TableColumn>Dirección</TableColumn>
                  <TableColumn>Zona</TableColumn>
                  <TableColumn>Estado</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {get_orders.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{request.generator.username}</TableCell>
                      <TableCell>{request.address? request.address.street : request.generator.address.street} {request.address? request.address.number : request.generator.address.number}</TableCell>
                      <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                      <TableCell>{request.route_request_status}</TableCell>
                      <TableCell>
                        <div className='flex gap-3'>
                          <Button className="" onClick={() => redirectDetailPage(request)}>Ver</Button>
                          {request.route_request_status != "Completada" &&
                          <Button className="bg-green-dark text-white" onClick={() => updateRouteRequest(request.route_request_id, routeActive, "COMPLETED")}>Completar</Button> }
                          {(request.route_request_status == "Pendiente" || request.route_request_status == "En ruta") &&
                          <Button className="bg-red-dark text-white" onClick={() => updateRouteRequest(request.route_request_id, routeActive, "REPROGRAMED")}>Reprogramar</Button>
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
}
      </div>

      {!loading && requests &&
      <div className='p-2 mt-4'>
          <h2 className='text-xl'>Recorrido</h2>
          <MapView centerCoordinates={coords} zoom={14} markers={markers} routeCoordinates={routeCoords}/>
      </div>
      }
    </div>
  );
};

export default HomeConductor;
