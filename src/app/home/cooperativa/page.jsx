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
import { getTrucksById, getOpenOrders, getCoopOrdersById, acceptOrderById } from '@api/apiService';
import Spinner from '../../../components/Spinner';
import { useRouter } from 'next/navigation';
import "./style.css"
import { mapMaterialNameToLabel } from '@/constants/recyclables';
import { ToastNotifier } from '@/components/ToastNotifier';
import zones from '@/constants/zones';
import { mapGenType } from '@/constants/userTypes';
import { formatDate, formatDateRange } from '@/utils/dateStringFormat';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AcceptConfirmationModal from '@components/AcceptConfirmationModal';
import { FormatTruckCapacityToFront } from '@/utils/truckFormat';
import { mapTruckStatus } from '@/constants/truck';
import { ToastContainer } from 'react-toastify';
import { generatorTypes } from '@/constants/userTypes';
import { wasteTypesDefault } from '@/constants/recyclables';
import { RequestStatus, mapRequestStatusToKey, mapRequestStatus } from '@/constants/request';
import { parseDate } from "@internationalized/date";
import FiltersModal from '@/components/FiltersModal';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const HomeCooperativa = () => {
  const userSession = useSelector((state) => state.userSession);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [acceptedOrder, setAcceptedOrder] = useState(null);

  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(null);
  const [availableOrders, setAvailableOrders] = useState(null)
  const [availableFilters, setAvailableFilters] = useState({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });

  const [dailyPage, setDailyPage] = React.useState(1);
  const [dailyPages, setDailyPages] = React.useState(null);
  const [dailyOrders, setDailyOrders] = useState(null)
  const [dailyFilters, setDailyFilters] = useState({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });
  const [points, setPoints] = useState([{position: [-34.5814551, -58.4211107], content: 'Cooperativa', popUp: 'Ubicación de la cooperativa'}])

  const [truckPage, setTruckPage] = React.useState(1);
  const [truckPages, setTruckPages] = React.useState(null);
  const [trucks, setTrucks] = useState(null)
 
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;
  const router = useRouter();

  const [isAvailableFiltersModalOpen, setIsAvailableFiltersModalOpen] = useState(false);
  const [isDailyFiltersModalOpen, setIsDailyFiltersModalOpen] = useState(false);

  const [centerCoords, setCenterCoords] = useState([-34.5814551, -58.4211107]);
  // TODO: hange centerCoords to coopCoords

  const filteredAvailableOrders = availableOrders?.filter(order => {
    const zone = order.address? order.address.zone : order.generator.address.zone
    return (
      ((!availableFilters.date_from && !availableFilters.date_to) ||
      (availableFilters.date_from && availableFilters.date_to && (order.pickup_date_to >= availableFilters.date_from && order.pickup_date_from <= availableFilters.date_to))) &&
      (availableFilters.wasteType.length == 0 || (availableFilters.wasteType.length == 1 && !availableFilters.wasteType[0]) || availableFilters.wasteType.some(element => order.waste_types.includes(element))) &&
      (availableFilters.zones.length == 0 || (availableFilters.zones.length == 1 && !availableFilters.zones[0]) || availableFilters.zones.includes(zone)) &&
      (availableFilters.genTypes.length == 0 || (availableFilters.genTypes.length == 1 && !availableFilters.genTypes[0]) || availableFilters.genTypes.includes(order.generator_type))
    );
  });

  const filteredDailyOrders = dailyOrders?.filter(order => {
    const zone = order.address? order.address.zone : order.generator.address.zone
    return (
      (!dailyFilters.genName || order.generator_name.toLowerCase().includes(dailyFilters.genName.toLowerCase())) &&
      (dailyFilters.wasteType.length == 0 || (dailyFilters.wasteType.length == 1 && !dailyFilters.wasteType[0]) || dailyFilters.wasteType.some(element => order.waste_types.includes(element))) &&
      (dailyFilters.zones.length == 0 || (dailyFilters.zones.length == 1 && !dailyFilters.zones[0]) || dailyFilters.zones.includes(zone)) &&
      (dailyFilters.orderStatus.length == 0 || (dailyFilters.orderStatus.length == 1 && !dailyFilters.orderStatus[0])  || dailyFilters.orderStatus.includes(mapRequestStatusToKey[order.status])) &&
      (dailyFilters.genTypes.length == 0 || (dailyFilters.genTypes.length == 1 && !dailyFilters.genTypes[0]) || dailyFilters.genTypes.includes(order.generator_type))
    );
  });

  useEffect(() => {
    if (filteredAvailableOrders) {
      setPages(Math.ceil(filteredAvailableOrders.length / rowsPerPage)); 
    } 
  }, [availableOrders, availableFilters]);

  useEffect(() => {
    if (filteredDailyOrders) {
      setDailyPages(Math.ceil(filteredDailyOrders.length / rowsPerPage)); 
    } 
  }, [dailyOrders, dailyFilters]);

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
    if (trucks) {
      const start = (truckPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return trucks.slice(start, end);
    }
    else
      return []

  }, [trucks, truckPage]);

  const formatWasteType = (value) => {
    return value.join(", ");
  };

  const transform_order_data = async (order) => {
    order.request_date = new Date(order.request_date)
    order.pickup_date_from = new Date(order.pickup_date_from)
    order.pickup_date_to = new Date(order.pickup_date_to)
    order.pickup_date = formatDate(order.pickup_date_from)
    order.generator_type = mapGenType(order.generator.type)
    order.generator_name = order.generator.username
    order.waste_types = order.waste_quantities.map(waste => mapMaterialNameToLabel[waste.waste_type]).sort()
    order.status = mapRequestStatus[order.status]
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
    const fetchDailyOrders = async () => {
      if (userSession.userId) {
        try {
          setLoading(true);
          await getCoopOrdersById(userSession.userId, userSession.accessToken)
          .then((response) => Promise.all(response.map(order => transform_order_data(order))))
          .then((transformed_orders) => {
            const filtered_orders = filter_daily_orders(transformed_orders)
            setDailyOrders(filtered_orders)
            setPoints(filtered_orders.map(order => getPoints(order, order.address? order.address : order.generator.address)))
            setDailyPages(Math.ceil(filtered_orders.length / rowsPerPage))
            })
        } catch (error) {
          console.log("Error al obtener pedidos", error);
          ToastNotifier.error("Error al obtener pedidos del dia")
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false);
      }
    };
    fetchDailyOrders();
  }, [userSession.userId, refresh]);

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      if (userSession.userId) {
        try {
          setLoading(true);
          await getOpenOrders(userSession.accessToken)
          .then((response) => Promise.all(response.map(order => transform_order_data(order))))
          .then((transformed_orders) => {
            //const filtered_orders = filter_available_orders(transformed_orders)
            setAvailableOrders(transformed_orders)
            setPages(Math.ceil(transformed_orders.length / rowsPerPage))
            })
        } catch (error) {
          console.log("Error al obtener pedidos", error);
          ToastNotifier.error("Error al obtener pedidos disponibles")
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false);
      }
    };

    fetchAvailableOrders();
  }, [userSession.userId, refresh]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (userSession.userId) {
        try {
          setLoading(true);
          await getTrucksById(userSession.userId, userSession.accessToken)
            .then((response) => {
              const formattedTrucks = response.map(truck => FormatTruckCapacityToFront(truck))
              setTrucks(formattedTrucks)
              setTruckPages(Math.ceil(response.length / rowsPerPage))
            })
          
        } catch (error) {
          console.log("Error al obtener camiones", error);
          ToastNotifier.error("Error al obtener camiones")
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

  const acceptRequest = async () => {
    setLoading(true);
    setModalIsOpen(false);
    await acceptOrderById(acceptedOrder.id, userSession.userId, userSession.accessToken)
      .then(() => {
        ToastNotifier.success("Solicitud aceptada correctamente");
        setRefresh(!refresh);
      })
      .catch(() => {
        setModalIsOpen(false);
        setLoading(false);
        ToastNotifier.error("Error al aceptar la solicitud");
      });
  };

   const clearAvailableFilters = () => {
    setAvailableFilters({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });
  }

  const clearDailyFilters = () => {
    setDailyFilters({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });
  }

  const applyAvailableFilters = (mobileFilters) => {
    setAvailableFilters(prevFilters => ({
        ...prevFilters,
        ...mobileFilters
    }));
    setIsAvailableFiltersModalOpen(false)
  };

  const applyDailyFilters = (mobileFilters) => {
    setDailyFilters(prevFilters => ({
        ...prevFilters,
        ...mobileFilters
    }));
    setIsDailyFiltersModalOpen(false)
  };


    return (
      <div className='flex flex-col py-1 px-2 lg:p-4 h-screen'>
        <ToastContainer/>
        <AcceptConfirmationModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} onConfirm={acceptRequest} title='Deseas aceptar esta solicitud?' />
        <FiltersModal isOpen={isAvailableFiltersModalOpen} onRequestClose={() => setIsAvailableFiltersModalOpen(false)} onConfirm={applyAvailableFilters} currentFilters={availableFilters}
          showDate showZones showWasteTypes showGenTypes
        />
        <FiltersModal isOpen={isDailyFiltersModalOpen} onRequestClose={() => setIsDailyFiltersModalOpen(false)} onConfirm={applyDailyFilters} currentFilters={dailyFilters}
          showGenName showZones showWasteTypes showStatus
        />
        {loading  && <Spinner/>}
        {!loading &&
        <div className='flex flex-col gap-2 w-full home-col'>
          {availableOrders &&
          <div className='flex justify-between items-center mx-4'>
            <p className='text-start text-xl font-bold lg:ml-2'>Solicitudes de disponibles</p>
            <Button type="button" className='bg-white md:hidden flex-col' onClick={() => setIsAvailableFiltersModalOpen(true)}>
              <FilterAltIcon fontSize='small' className='cursor-pointer'/>
              Filtros
            </Button>
          </div>
          }

          {availableOrders &&
          <div className='flex flex-col my-2 gap-2'>
            <Card className='hidden md:flex rounded-md'>
            <CardBody>
            <div className="flex gap-4 items-center">
              <DateRangePicker label="Rango de fechas" className="" onChange={(e) => 
                setAvailableFilters({ ...availableFilters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })}
                value={availableFilters.date_from && availableFilters.date_to ? { start: parseDate(availableFilters.date_from.toISOString().split('T')[0]), end: parseDate(availableFilters.date_to.toISOString().split('T')[0]) } : null}
                />
              <Select
                  className='select'
                  placeholder="Zona"
                  selectedKeys={availableFilters.zones}
                  options={zones}
                  selectionMode="multiple"
                  onChange={(e) => setAvailableFilters({ ...availableFilters, zones: e.target.value.split(',')})}
                  >
                    {zones.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  className='select'
                  placeholder="Tipo de Reciclables"
                  selectedKeys={availableFilters.wasteType}
                  options={wasteTypesDefault}
                  selectionMode="multiple"
                  onChange={(e) => setAvailableFilters({ ...availableFilters, wasteType: e.target.value.split(',')})}
                >
                    {wasteTypesDefault.map((waste) => (
                      <SelectItem key={waste.value} value={waste.value}>
                        {waste.label}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  className='select'
                  placeholder="Tipo de Generador"
                  selectedKeys={availableFilters.genTypes}
                  options = {generatorTypes}
                  selectionMode="multiple"
                  onChange={(e) => {
                    setAvailableFilters({ ...availableFilters, genTypes: e.target.value.split(',') }) }}
                >
                    {generatorTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                </Select>
                <div className='flex flex-col items-center justify-center'>
                  <FilterAltOffIcon className='cursor-pointer' onClick={clearAvailableFilters}/>
                  <p className='text-center'>Limpiar filtros</p>
                </div>
              </div>
              </CardBody>
              </Card>

              <Table
                   bottomContent={
                    <div className="flex flex-col md:flex-row w-full justify-between items-center">
                    <span className='hidden md:flex md:invisible'>{get_available_orders.length} de {filteredAvailableOrders.length} solicitudes</span>
                    <Pagination
                      className='flex'
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                    <span className='flex'>{get_available_orders.length} de {filteredAvailableOrders.length} solicitudes</span>
                  </div>}
              >
                <TableHeader>
                  <TableColumn className='text-small'>Fecha de recolección</TableColumn>
                  <TableColumn className='text-small'>Zona</TableColumn>
                  <TableColumn className='text-small'>Tipo de residuo</TableColumn>
                  <TableColumn className='text-small'>Tipo de generador</TableColumn>
                  <TableColumn className='text-small'>Fecha de creación</TableColumn>
                  <TableColumn className='text-small'>Acciones</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No hay solicitudes sin aceptar">
                  {get_available_orders.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                      <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                      <TableCell>{formatWasteType(request.waste_types)}</TableCell>
                      <TableCell>{request.generator_type}</TableCell>
                      <TableCell>{formatDate(request.request_date)}</TableCell>
                      <TableCell>
                        <div className='flex gap-3'>
                          <Button className="rounded-medium" onClick={() => redirectDetailPage(request)}>Ver</Button>
                          <Button className='bg-white text-green-dark px-3 py-2 rounded-medium border-medium border-green-dark' onClick={() => {setAcceptedOrder(request); setModalIsOpen(true)}}>Aceptar</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }

          {dailyOrders &&
          <div className='flex justify-between items-center mx-4 mt-3'>
          < p className='text-start text-xl font-bold ml-2'>Recolecciónes del dia</p>
          <Button type="button" className='bg-white md:hidden flex-col' onClick={() => setIsDailyFiltersModalOpen(true)}>
            <FilterAltIcon fontSize='small' className='cursor-pointer'/>
            Filtros
          </Button>
          </div>
          }
          {dailyOrders &&
          <div className='flex flex-col my-2 gap-2'>
            <Card className='hidden md:flex rounded-md'>
            <CardBody>
            <div className="flex gap-4 items-center">
                <Input
                  className='select'
                  placeholder="Generador"
                  onChange={(e) => {
                    setDailyFilters({...dailyFilters, genName: e.target.value})
                  }}>
                </Input>
              <Select
                  className='select'
                  placeholder="Tipo de Generador"
                  selectedKeys={dailyFilters.genTypes}
                  options = {generatorTypes}
                  selectionMode="multiple"
                  onChange={(e) => {
                    setDailyFilters({ ...dailyFilters, genTypes: e.target.value.split(',') }) }}
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
                  selectedKeys={dailyFilters.zones}
                  options={zones}
                  selectionMode="multiple"
                  onChange={(e) => setDailyFilters({ ...dailyFilters, zones: e.target.value.split(',') })}
                >
                    {zones.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                </Select>

                <Select
                  className='select'
                  placeholder="Tipo de Reciclables"
                  selectedKeys={dailyFilters.wasteType}
                  options={wasteTypesDefault}
                  selectionMode="multiple"
                  onChange={(e) => setDailyFilters({ ...dailyFilters, wasteType: e.target.value.split(',')})}
                >
                    {wasteTypesDefault.map((waste) => (
                      <SelectItem key={waste.value} value={waste.value}>
                        {waste.label}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  className='select'
                  placeholder="Estado de la solicitud"
                  options={RequestStatus}
                  selectedKeys={dailyFilters.orderStatus}
                  selectionMode="multiple"
                  onChange={(e) => setDailyFilters({ ...dailyFilters, orderStatus: e.target.value.split(',') })}
                >
                    {RequestStatus.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                </Select>
                <div className='flex flex-col items-center justify-center'>
                  <FilterAltOffIcon className='cursor-pointer' onClick={clearDailyFilters}/>
                  <p className='text-center'>Limpiar filtros</p>
                </div>
                </div>
                </CardBody>
              </Card>

              <Table
              bottomContent={
                <div className="flex flex-col md:flex-row w-full justify-between items-center">
                  <span className='hidden md:flex md:invisible'>{get_daily_orders.length} de {filteredDailyOrders.length} solicitudes</span>
                  <Pagination
                    className='flex'
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={dailyPage}
                    total={dailyPages}
                    onChange={(page) => setDailyPage(page)}
                  />
                  <span className='flex'>{get_daily_orders.length} de {filteredDailyOrders.length} solicitudes</span>
                </div>}>
                <TableHeader>
                  <TableColumn className='text-small'>Fecha de creación</TableColumn>
                  <TableColumn className='text-small'>Nombre generador</TableColumn>
                  <TableColumn className='text-small'>Tipo de generador</TableColumn>
                  <TableColumn className='text-small'>Dirección</TableColumn>
                  <TableColumn className='text-small'>Zona</TableColumn>
                  <TableColumn className='text-small'>Tipo de residuo</TableColumn>
                  <TableColumn className='text-small'>Estado</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No hay recolecciones para el dia de hoy">
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
            </div>
            }

          {trucks &&
          <div className='flex justify-between items-center mx-4 mt-3'>
            < p className='text-start text-xl font-bold ml-2'>Camiones de la cooperativa</p>
          </div>
          }

          {trucks &&
          <div className='flex flex-col my-2 gap-2'>
            <Table
              bottomContent={
                <div className="flex flex-col md:flex-row w-full justify-between items-center">
                  <span className='hidden md:flex md:invisible'>{get_trucks.length} de {trucks.length} solicitudes</span>
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
                  <span className='flex'>{get_trucks.length} de {trucks.length} camiones</span>
                </div>}>
              <TableHeader>
                <TableColumn>Marca</TableColumn>
                <TableColumn>Modelo</TableColumn>
                <TableColumn>Patente</TableColumn>
                <TableColumn>Capacidad</TableColumn>
                <TableColumn>Estado</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay camiones para mostrar">
                {get_trucks.map((truck, index) => (
                  <TableRow key={index}>
                    <TableCell>{truck.brand}</TableCell>
                    <TableCell>{truck.model}</TableCell>
                    <TableCell>{truck.patent}</TableCell>
                    <TableCell>{truck.capacity} tons.</TableCell>
                    <TableCell>{mapTruckStatus[truck.status]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
        }

        
        <div className='flex justify-between items-center mx-4 mt-3'>
          < p className='text-start text-xl font-bold ml-2'>Ubicación de las recolecciónes del dia</p>
        </div>
        <div className='flex justify-center'>
          <MapView centerCoordinates={centerCoords} markers={points}/>
        </div>

        </div>
        }
      </div>
    );
  }

export default HomeCooperativa;
