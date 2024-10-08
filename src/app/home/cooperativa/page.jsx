'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PieChart from '@/components/PieChart';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn, Pagination, Select, SelectItem, Input, DateRangePicker
 } from '@nextui-org/react';
import dynamic from 'next/dynamic'
import 'dotenv/config'
import { getTrucksById, getOpenOrders, getCoopOrdersById, updateOrderById } from '../../../api/apiService';
import Spinner from '../../../components/Spinner';
import { useRouter } from 'next/navigation';
import "./style.css"
import { mapMaterialNameToLabel } from '@/constants/recyclables';
import { ToastNotifier } from '@/components/ToastNotifier';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const HomeCooperativa = () => {
  const userSession = useSelector((state) => state.userSession);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(null);
  const [availableOrders, setAvailableOrders] = useState(null)
  const [availableFilters, setAvailableFilters] = useState({ zone: [], wasteType: [], generatorType: [], date_from: '', date_to: '' });

  const [dailyPage, setDailyPage] = React.useState(1);
  const [dailyPages, setDailyPages] = React.useState(null);
  const [dailyOrders, setDailyOrders] = useState(null)
  const [dailyFilters, setDailyFilters] = useState({ zone: [], status: [], wasteType: [], generatorType: [], generator: '' });
  const [points, setPoints] = useState([{position: [-34.5814551, -58.4211107], content: 'Cooperativa', popUp: 'Ubicación de la cooperativa'}])

  const [truckPage, setTruckPage] = React.useState(1);
  const [truckPages, setTruckPages] = React.useState(null);
  const [trucks, setTrucks] = useState(null)
  const [brands, setBrands] = useState(null)
  const [truckFilters, setTruckFilters] = useState({ brand: [], patent: '' });
  
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;
  const router = useRouter();
  
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

  const filteredAvailableOrders = availableOrders?.filter(order => {
    const zone = order.address? order.address.zone : order.generator.address.zone
    return (
      ((!availableFilters.date_from && !availableFilters.date_to) ||
      (availableFilters.date_from && availableFilters.date_to && (order.pickup_date_to >= availableFilters.date_from && order.pickup_date_from <= availableFilters.date_to))) &&
      (availableFilters.wasteType.length == 0 || (availableFilters.wasteType.length == 1 && !availableFilters.wasteType[0]) || availableFilters.wasteType.every(element => order.waste_types.includes(element))) &&
      (availableFilters.zone.length == 0 || (availableFilters.zone.length == 1 && !availableFilters.zone[0]) || availableFilters.zone.includes(zone)) &&
      (availableFilters.generatorType.length == 0 || (availableFilters.generatorType.length == 1 && !availableFilters.generatorType[0]) || availableFilters.generatorType.includes(order.generator_type))
    );
  });

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

  const filteredTrucks = trucks?.filter(truck => {
    return (
      (!truckFilters.patent || truck.patent.toLowerCase().includes(truckFilters.patent.toLowerCase())) &&
      (truckFilters.brand.length == 0 || (truckFilters.brand.length == 1 && !truckFilters.brand[0]) || truckFilters.brand.includes(truck.brand))
    );
  });

  useEffect(() => {
    if (filteredAvailableOrders) {
      setPages(Math.ceil(filteredAvailableOrders.length / rowsPerPage)); 
    } 
  }, [availableOrders, availableFilters]);

  useEffect(() => {
    if (filteredDailyOrders) {
      setPages(Math.ceil(filteredDailyOrders.length / rowsPerPage)); 
    } 
  }, [dailyOrders, dailyFilters]);

  useEffect(() => {
    if (filteredTrucks) {
      setTruckPages(Math.ceil(filteredTrucks.length / rowsPerPage)); 
    } 
  }, [trucks, truckFilters]);

  const get_available_orders = React.useMemo(() => {
    if (filteredAvailableOrders) {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return filteredAvailableOrders.slice(start, end);
    }
    else
      return []

  }, [page, filteredAvailableOrders]);

  const get_daily_orders = React.useMemo(() => {
    if (filteredDailyOrders) {
      const start = (dailyPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return filteredDailyOrders.slice(start, end);
    }
    else
      return []

  }, [dailyPage, filteredDailyOrders]);

  const get_trucks = React.useMemo(() => {
    if (filteredTrucks) {
      const start = (truckPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return filteredTrucks.slice(start, end);
    }
    else
      return []

  }, [truckPage, filteredTrucks]);

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
    console.log(order)
    order.request_date = new Date(order.request_date)
    order.pickup_date_from = new Date(order.pickup_date_from)
    order.pickup_date_to = new Date(order.pickup_date_to)
    order.pickup_date = formatDate(order.pickup_date_from) + " - " + formatDate(order.pickup_date_to)
    order.generator_type = getGeneratorType(order.generator.type)
    order.generator_name = order.generator.username
    order.waste_types = order.waste_quantities.map(waste => mapMaterialNameToLabel[waste.waste_type]).sort()
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

  const getPoints = (order, address) => {
    return { position: [parseFloat(address.lat), parseFloat(address.lng)], content: order.generator.username, popUp: `${address.street} ${address.number}`}
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (userSession.userId) {
        try {
          setLoading(true);
          await getCoopOrdersById(userSession.userId)
          .then((response) => Promise.all(response.map(order => transform_order_data(order))))
          .then((transformed_orders) => {
            const filtered_orders = filter_daily_orders(transformed_orders)
            setDailyOrders(filtered_orders)
            setPoints(filtered_orders.map(order => getPoints(order, order.address? order.address : order.generator.address)))
            setDailyPages(Math.ceil(filtered_orders.length / rowsPerPage))
            })

          await getOpenOrders()
          .then((response) => Promise.all(response.map(order => transform_order_data(order))))
          .then((transformed_orders) => {
            const filtered_orders = filter_available_orders(transformed_orders)
            setAvailableOrders(filtered_orders)
            setPages(Math.ceil(filtered_orders.length / rowsPerPage))
            })

          await getTrucksById(userSession.userId)
            .then((response) => {
              setTrucks(response)
              setTruckPages(Math.ceil(response.length / rowsPerPage))
              setBrands([...new Set(response.map(truck => truck.brand))].map(brand => ({ value: brand, label: brand })))
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
  }, [userSession.userId, refresh]);

  const redirectDetailPage = (rowData) => {
    router.replace(`/home/cooperativa/pedidos/detalles/${rowData.id}`)
  };

  const acceptRequest = async (rowData) => {
    await updateOrderById(rowData.id, userSession.userId, "PENDING")
      .then(() => {
        ToastNotifier.success("Solicitud aceptada correctamente");
        setRefresh(!refresh);
      })
      .catch(() => {
        ToastNotifier.error("Error al aceptar la solicitud");
        console.log("Error al aceptar la solicitud");
      });
  };

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
        {loading  && <Spinner/>}
        {!loading &&
        <div className='flex flex-col gap-2 w-full home-col'>
          {availableOrders &&
          <Card className='lg:mx-9 my-4'>
            <CardHeader className='bg-green-dark text-white pl-4 text-xl font-bold py-3'>SOLICITUDES DISPONIBLES</CardHeader>
            <Divider />
            <CardBody className='p-0'>
            <div className="flex gap-4 m-4">
              <DateRangePicker label="Fecha" className="max-w-[284px]" onChange={(e) => 
                setAvailableFilters({ ...availableFilters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })} />
              <Select
                  className='select'
                  placeholder="Zona"
                  value={availableFilters.zone}
                  options={zones}
                  selectionMode="multiple"
                  onChange={(e) => setAvailableFilters({ ...availableFilters, zone: e.target.value.split(',') })}
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
                  value={availableFilters.wasteType}
                  options={wasteTypes}
                  selectionMode="multiple"
                  onChange={(e) => setAvailableFilters({ ...availableFilters, wasteType: e.target.value.split(',')})}
                >
                    {wasteTypes.map((waste) => (
                      <SelectItem key={waste.value} value={waste.value}>
                        {waste.label}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  className='select'
                  placeholder="Tipo de Generador"
                  value={availableFilters.generatorType}
                  options = {generatorTypes}
                  selectionMode="multiple"
                  onChange={(e) => {
                    setAvailableFilters({ ...availableFilters, generatorType: e.target.value.split(',') }) }}
                >
                    {generatorTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                </Select>
              </div>
              <Table
                   bottomContent={
                    <div className="flex w-full justify-between items-center">
                    <span className='flex 1 invisible'>{get_available_orders.length} de {filteredAvailableOrders.length} solicitudes</span>
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
                    <span className='flex 1'>{get_available_orders.length} de {filteredAvailableOrders.length} solicitudes</span>
                  </div>}
              >
                <TableHeader>
                  <TableColumn>Fecha de recolección</TableColumn>
                  <TableColumn>Zona</TableColumn>
                  <TableColumn>Tipo de residuo</TableColumn>
                  <TableColumn>Tipo de generador</TableColumn>
                  <TableColumn>Fecha de creación</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {get_available_orders.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                      <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                      <TableCell>{formatWasteType(request.waste_types)}</TableCell>
                      <TableCell>{request.generator_type}</TableCell>
                      <TableCell>{formatDate(request.request_date)}</TableCell>
                      <TableCell>
                        <div className='flex gap-3'>
                          <Button className="" onClick={() => redirectDetailPage(request)}>Ver</Button>
                          <Button className="bg-green-dark text-white" onClick={() => acceptRequest(request)}>Aceptar</Button>
                        </div>
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
            <CardHeader className='bg-green-dark text-white pl-4 text-xl font-bold py-3'>SOLICITUDES DE HOY</CardHeader>
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
    {trucks && brands &&
          <Card className='lg:mx-9 my-4'>
            <CardHeader className='bg-green-dark text-white pl-4 text-xl font-bold py-3'>CAMIONES ACTIVOS</CardHeader>
            <Divider />
            <CardBody className='p-0'>
            <div className="flex gap-4 m-4">
              <Select
                  className='select'
                  placeholder="Marca"
                  value={truckFilters.brand}
                  options = {brands}
                  selectionMode="multiple"
                  onChange={(e) => {
                    setTruckFilters({ ...truckFilters, brand: e.target.value.split(',') }) }}
                >
                    {brands.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                </Select>
                <Input
                  className='select h-14'
                  placeholder="Patente"
                  onChange={(e) => {
                    setTruckFilters({...truckFilters, patent: e.target.value})
                  }}>
                </Input>
                </div>
              <Table
                bottomContent={
                  <div className="flex w-full justify-between items-center">
                    <span className='flex 1 invisible'>{get_trucks.length} de {filteredTrucks.length} solicitudes</span>
                    <Pagination
                      className='flex 1'
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={truckPage}
                      total={truckPages}
                      onChange={(page) => setTruckPage(page)}
                    />
                    <span className='flex 1'>{get_trucks.length} de {filteredTrucks.length} camiones</span>
                  </div>}>
                <TableHeader>
                  <TableColumn>Marca</TableColumn>
                  <TableColumn>Modelo</TableColumn>
                  <TableColumn>Patente</TableColumn>
                  <TableColumn>Capacidad</TableColumn>
                </TableHeader>
                <TableBody>
                  {get_trucks.map((truck, index) => (
                    <TableRow key={index}>
                      <TableCell>{truck.brand}</TableCell>
                      <TableCell>{truck.model}</TableCell>
                      <TableCell>{truck.patent}</TableCell>
                      <TableCell>{truck.capacity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        }
        {console.log(points)}
          <MapView className="lg:mx-9 my-4 h-96 justify-center" centerCoordinates={[-34.5814551, -58.4211107]} markers={points}/>
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
          </div> 
        }
      </div>
    );
  }

export default HomeCooperativa;
