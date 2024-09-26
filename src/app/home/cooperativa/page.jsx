'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@state/userProvider";
import PieChart from '@/components/PieChart';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn, Pagination
 } from '@nextui-org/react';
import dynamic from 'next/dynamic'
import 'dotenv/config'
import { getUserById, getPendingOrders, getCoopOrdersById } from '../../../api/apiService';
import Spinner from '../../../components/Spinner';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const camionesMocked = [
  {
    id: 1,
    placa: 'ABC-142',
    modelo: 2020,
    marca: 'VolksWagen',
    capacidad: '10 toneladas',
    estado: 'Disponible',
  },
  {
    id: 2,
    placa: 'AE-913-TR',
    modelo: 2021,
    marca: 'Mercedes Benz',
    capacidad: '5 toneladas',
    estado: 'En uso',
  },
  {
    id: 3,
    placa: 'JQR-204',
    modelo: 2022,
    marca: 'Toyota',
    capacidad: '10 toneladas',
    estado: 'Disponible',
  },
];

const HomeCooperativa = () => {
  const [page, setPage] = React.useState(1);
  const [dailyPage, setDailyPage] = React.useState(1);
  const [pages, setPages] = React.useState(null);
  const [dailyPages, setDailyPages] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;
  const [availableOrders, setAvailableOrders] = useState(null)
  const [dailyOrders, setDailyOrders] = useState(null)
  const { user } = useUser();
  console.log(user)
  const router = useRouter();

  const get_available_orders = React.useMemo(() => {
    if (availableOrders) {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return availableOrders.slice(start, end);
    }
    else
      return []

  }, [page, availableOrders]);

  const get_daily_orders = React.useMemo(() => {
    if (dailyOrders) {
      const start = (dailyPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return dailyOrders.slice(start, end);
    }
    else
      return []

  }, [dailyPage, dailyOrders]);

  const getStatus = (status) => {
    switch (status) {
        case 'CANCELED':
            return 'Cancelada';

        case 'COMPLETED':
            return 'Completada';

        case 'OPEN':
            return 'Ingresada';

        case 'Coordinada':
            return 'Coordinada';
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
    order.pickup_date = formatDate(order.pickup_date_from) + " - " + formatDate(order.pickup_date_to)
    order.generator_type = getGeneratorType(order.generator.type)
    order.generator_name = order.generator.username
    order.waste_types = order.waste_quantities.map(waste => waste.waste_type).sort()
    //order.waste_quantities = getCombinations(order.waste_quantities.map(waste => waste.waste_type))
    order.status = getStatus(order.status)
    return order
}

const filter_available_orders = (orders) => {
  return orders.filter(order => order.status == "Ingresada")
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

useEffect(() => {
  const fetchOrders = async () => {
    if (user.userId) {
      try {
        await getCoopOrdersById(user.userId)
        .then((response) => Promise.all(response.map(order => transform_order_data(order))))
        .then((transformed_orders) => {
          const filtered_orders = filter_daily_orders(transformed_orders)
          setDailyOrders(filtered_orders)
          setDailyPages(Math.ceil(filtered_orders.length / rowsPerPage))
          })

        await getCoopOrdersById(user.userId)
        .then((response) => Promise.all(response.map(order => transform_order_data(order))))
        .then((transformed_orders) => {
          const filtered_orders = filter_available_orders(transformed_orders)
          setAvailableOrders(filtered_orders)
          setPages(Math.ceil(filtered_orders.length / rowsPerPage))
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

  const formatDateRange = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    const date = fromDate.toLocaleDateString();
    const fromTime = fromDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const toTime = toDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${date} ${fromTime} - ${toTime}`;
  };

    return (
      <div className='flex flex-col p-4 gap-5 h-screen'>
        {(loading || !availableOrders || !dailyOrders) && <Spinner/>}
        {!loading && availableOrders && dailyOrders &&
        <div className='flex flex-col gap-2 w-full'>
          {availableOrders &&
          <Card className='lg:mx-9 my-4'>
            <CardHeader className='bg-green-dark text-white p-2'>Solicitudes disponibles: {availableOrders.length}</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <Table
                    bottomContent={
                      <div className="flex w-full justify-center">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          color="secondary"
                          page={page}
                          total={pages}
                          onChange={(page) => setPage(page)}
                        />
                      </div>}
              >
                <TableHeader>
                  <TableColumn>Fecha de creación</TableColumn>
                  <TableColumn>Fecha de recolección</TableColumn>
                  <TableColumn>Zona</TableColumn>
                  <TableColumn>Elementos</TableColumn>
                  <TableColumn>Tipo de generador</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {get_available_orders.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(request.request_date)}</TableCell>
                      <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                      <TableCell>{request.zone}</TableCell>
                      <TableCell>{formatWasteType(request.waste_types)}</TableCell>
                      <TableCell>{request.generator_type}</TableCell>
                      <TableCell>
                        <Button >Ver</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
  }
          {dailyOrders &&
          <Card className='lg:mx-9 my-4'>
            <CardHeader className='bg-green-dark text-white p-2 text-lg'>Solicitudes del dia de hoy: {dailyOrders.length}</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <Table
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={dailyPage}
                    total={dailyPages}
                    onChange={(page) => setDailyPage(page)}
                  />
                </div>}>
                <TableHeader>
                  <TableColumn>Fecha de creación</TableColumn>
                  <TableColumn>Nombre generador</TableColumn>
                  <TableColumn>Tipo de generador</TableColumn>
                  <TableColumn>Dirección</TableColumn>
                  <TableColumn>Zona</TableColumn>
                  <TableColumn>Elementos</TableColumn>
                  <TableColumn>Estado</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {get_daily_orders.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(request.request_date)}</TableCell>
                      <TableCell>{request.generator_name}</TableCell>
                      <TableCell>{request.generator_type}</TableCell>
                      <TableCell>{request.generator.address.street} {request.generator.address.number}</TableCell>
                      <TableCell>{request.zone}</TableCell>
                      <TableCell>{formatWasteType(request.waste_types)}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        <Button >Ver</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
}
          <Card className='lg:mx-9 my-4'>
            <CardHeader className='bg-green-dark text-white p-2'>Camiones activos: 2</CardHeader>
            <Divider />
            <CardBody className='p-0'>
              <Table>
                <TableHeader>
                  <TableColumn>Placa</TableColumn>
                  <TableColumn>Marca</TableColumn>
                  <TableColumn>Capacidad</TableColumn>
                  <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody>
                  {camionesMocked.map((camion) => (
                    <TableRow key={camion.id}>
                      <TableCell>{camion.placa}</TableCell>
                      <TableCell>{camion.marca}</TableCell>
                      <TableCell>{camion.capacidad}</TableCell>
                      <TableCell>{camion.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
        }
        {!loading &&
        <div className='flex flex-row items-center justify-center gap-5'>
          <Card className='flex flex-row justify-between items-center flex-1'>
            <div className='flex flex-col items-start p-4'>
              <h1 className='text-center'>Estadisticas de recolecciones</h1>
              <p>Materiales recibidos</p>
            </div>
            <PieChart />
          </Card>
          <div className='flex-1'>
            {/* TODO: Change center coordinate ; Add markers */}
            <MapView centerCoordinates={[-34.5814551, -58.4211107]}/>
          </div>
        </div> 
        }
      </div>
    );
  }

export default HomeCooperativa;
