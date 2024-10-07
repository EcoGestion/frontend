'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn, Input, Select, SelectItem, Pagination
 } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import 'dotenv/config';
import { useUser } from '../../../state/userProvider';
import Spinner from '../../../components/Spinner';
import { getCoopOrdersById } from '../../../api/apiService';
import "./style.css"

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

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

const statuses = [
  { value: 'Ingresada', label: 'Ingresada' },
  { value: 'Completada', label: 'Completada' },
  { value: 'Cancelada', label: 'Cancelada' },
  { value: 'Coordinada', label: 'Coordinada' }
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
  const [dailyPage, setDailyPage] = React.useState(1);
  const [dailyPages, setDailyPages] = React.useState(null);
  const [dailyOrders, setDailyOrders] = useState(null)
  const [dailyFilters, setDailyFilters] = useState({ zone: [], status: [], wasteType: [], generatorType: [], generator: '' });
  const [points, setPoints] = useState(null)

  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;
  const router = useRouter();

  const filteredDailyOrders = dailyOrders?.filter(order => {
    const zone = order.address? order.address.zone : order.generator.address.zone
    return (
      (!dailyFilters.generator || order.generator_name.toLowerCase().includes(dailyFilters.generator.toLowerCase())) &&
      (dailyFilters.wasteType.length == 0 || (dailyFilters.wasteType.length == 1 && !dailyFilters.wasteType[0]) || dailyFilters.wasteType.every(element => order.waste_types.includes(element))) &&
      (dailyFilters.zone.length == 0 || (dailyFilters.zone.length == 1 && !dailyFilters.zone[0]) || dailyFilters.zone.includes(zone)) &&
      (dailyFilters.status.length == 0 || (dailyFilters.status.length == 1 && !dailyFilters.status[0])  || dailyFilters.status.includes(order.status)) &&
      (dailyFilters.generatorType.length == 0 || (dailyFilters.generatorType.length == 1 && !dailyFilters.generatorType[0]) || dailyFilters.generatorType.includes(order.generator_type))
    );
  });

  useEffect(() => {
    if (filteredDailyOrders) {
      setDailyPages(Math.ceil(filteredDailyOrders.length / rowsPerPage)); 
    } 
  }, [dailyOrders, dailyFilters]);

  const get_daily_orders = React.useMemo(() => {
    if (filteredDailyOrders) {
      const start = (dailyPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return filteredDailyOrders.slice(start, end);
    }
    else
      return []
  
  }, [dailyPage, filteredDailyOrders]);

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

  const transform_order_data = async (order) => {
    order.request_date = new Date(order.request_date)
    order.pickup_date_from = new Date(order.pickup_date_from)
    order.pickup_date_to = new Date(order.pickup_date_to)
    order.generator_type = getGeneratorType(order.generator.type)
    order.generator_name = order.generator.username
    order.waste_types = order.waste_quantities.map(waste => waste.waste_type).sort()
    order.status = getStatus(order.status)
    return order
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

const getPoints = (order, address) => {
  return { position: [parseFloat(address.lat), parseFloat(address.lng)], content: order.generator.username, popUp: `${address.street} ${address.number}`}
}



useEffect(() => {
  const fetchOrders = async () => {
    if (user.userId) {
      console.log(user)
      try {
        await getCoopOrdersById(user.userId)
        .then((response) => Promise.all(response.map(order => transform_order_data(order))))
        .then((transformed_orders) => {
          const filtered_orders = filter_daily_orders(transformed_orders)
          setDailyOrders(filtered_orders)
          setPoints(filtered_orders.map(order => getPoints(order, order.address? order.address : order.generator.address)))
          setDailyPages(Math.ceil(filtered_orders.length / rowsPerPage))
          })
        
      } catch (error) {
        console.log("Error al obtener pedidos", error);
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false);
    }
  };

  fetchOrders();
}, [user.userId]);

const redirectDetailPage = (rowData) => {
  router.replace(`/home/cooperativa/pedidos/detalles/${rowData.id}`)
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
      {(loading || !dailyOrders) && <Spinner/>}

      <div className='flex flex-col gap-2 w-full home-col'>
      {dailyOrders &&
          <Card className='lg:mx-9 my-4'>
            <CardHeader className='bg-green-dark text-white pl-4 text-xl font-bold py-3'>RECOLECCIONES DEL DÍA</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <div className="flex gap-4 m-4">
                <Input
                  className='select h-14'
                  placeholder="Generador"
                  onChange={(e) => {
                    setDailyFilters({...dailyFilters, generator: e.target.value})
                  }}>
                </Input>
              <Select
                  className='select'
                  placeholder="Tipo de Generador"
                  value={dailyFilters.generatorType}
                  options = {generatorTypes}
                  selectionMode="multiple"
                  onChange={(e) => {
                    setDailyFilters({ ...dailyFilters, generatorType: e.target.value.split(',') }) }}
                >
                    {generatorTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                </Select>
              <Select
                  className='select'
                  placeholder="Zona"
                  value={dailyFilters.zone}
                  options={zones}
                  selectionMode="multiple"
                  onChange={(e) => setDailyFilters({ ...dailyFilters, zone: e.target.value.split(',') })}
                >
                    {zones.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  className='select'
                  placeholder="Tipo"
                  value={dailyFilters.wasteType}
                  options={wasteTypes}
                  selectionMode="multiple"
                  onChange={(e) => setDailyFilters({ ...dailyFilters, wasteType: e.target.value.split(',')})}
                >
                    {wasteTypes.map((waste) => (
                      <SelectItem key={waste.value} value={waste.value}>
                        {waste.label}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  className='select'
                  placeholder="Estado"
                  value={dailyFilters.status}
                  options={statuses}
                  selectionMode="multiple"
                  onChange={(e) => setDailyFilters({ ...dailyFilters, status: e.target.value.split(',') })}
                >
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                </Select>
                </div>
              <Table
              bottomContent={
                <div className="flex w-full justify-between items-center">
                  <span className='flex 1 invisible'>{get_daily_orders.length} de {filteredDailyOrders.length} solicitudes</span>
                  <Pagination
                    className='flex 1'
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={dailyPage}
                    total={dailyPages}
                    onChange={(page) => setDailyPage(page)}
                  />
                  <span className='flex 1'>{get_daily_orders.length} de {filteredDailyOrders.length} solicitudes</span>
                </div>}>
                <TableHeader>
                  <TableColumn>Fecha de creación</TableColumn>
                  <TableColumn>Nombre generador</TableColumn>
                  <TableColumn>Tipo de generador</TableColumn>
                  <TableColumn>Dirección</TableColumn>
                  <TableColumn>Zona</TableColumn>
                  <TableColumn>Tipo de residuo</TableColumn>
                  <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody>
                  {get_daily_orders.map((request, index) => (
                    <TableRow key={index} onClick={() => redirectDetailPage(request)}>
                      <TableCell>{formatDate(request.request_date)}</TableCell>
                      <TableCell>{request.generator_name}</TableCell>
                      <TableCell>{request.generator_type}</TableCell>
                      <TableCell>{request.address? request.address.street : request.generator.address.street} {request.address? request.address.number : request.generator.address.number}</TableCell>
                      <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                      <TableCell>{formatWasteType(request.waste_types)}</TableCell>
                      <TableCell>{request.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
}
      </div>

      <Card>
        <CardHeader>
          <h2 className='text-xl font-bold'>Mapa de recolecciones</h2>
        </CardHeader>
        <CardBody>
          <MapView />
        </CardBody>
      </Card>
    </div>
  );
};

export default HomeConductor;
