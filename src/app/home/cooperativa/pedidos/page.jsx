'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../state/userProvider';
import { Card, CardHeader, CardBody, Divider, CardFooter,
    Table, TableHeader, TableBody, TableRow, TableCell, Button,
    TableColumn, Pagination, Select, SelectItem, Input, DateRangePicker
   } from '@nextui-org/react';
import { getCoopOrdersById } from "../../../../api/apiService";
import { useRouter } from 'next/navigation';
import Spinner from "../../../../components/Spinner"
import { useSelector } from 'react-redux';
import zones from '@/constants/zones';
import { mapGenType } from '@/constants/userTypes';
import { formatDate, formatDateRange } from '@/utils/dateStringFormat';
import { mapMaterialNameToLabel } from '@/constants/recyclables';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import "./style.css"

export default function Orders() {
    const router = useRouter();
    const userSession = useSelector((state) => state.userSession);
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(null); 
    const [orders, setOrders] = useState(null)
    const [filters, setFilters] = useState({ zone: [], wasteType: [], generatorType: [], date_from: '', date_to: '', status: []});
    const rowsPerPage = 5;
    const [loading, setLoading] = useState(true);

    const statuses = [
        { value: 'Ingresada', label: 'Ingresada' },
        { value: 'Completada', label: 'Completada' },
        { value: 'Cancelada', label: 'Cancelada' },
        { value: 'En ruta', label: 'En ruta' },
        { value: 'En proceso', label: 'En proceso' }
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

    const cols = [
        { field: 'generator', header: 'Generador' },
        { field: 'request_date', header: 'Fecha creación' },
        { field: 'pickup_date', header: 'Fecha Recolección' },
        { field: 'waste_quantities', header: 'Tipo' },
        { field: 'size', header: 'Cantidad' },
        { field: 'zone', header: 'Barrio' },
        { field: 'status', header: 'Estado' },
    ];

    const filteredOrders = orders?.filter(order => {
        const zone = order.address? order.address.zone : order.generator.address.zone
        return (
          ((!filters.date_from && !filters.date_to) ||
          (filters.date_from && filters.date_to && (order.pickup_date_to >= filters.date_from && order.pickup_date_from <= filters.date_to))) &&
          (!filters.generator || order.generator_name.toLowerCase().includes(filters.generator.toLowerCase())) &&
          (filters.status.length == 0 || (filters.status.length == 1 && !filters.status[0])  || filters.status.includes(order.status)) &&
          (filters.wasteType.length == 0 || (filters.wasteType.length == 1 && !filters.wasteType[0]) || filters.wasteType.every(element => order.waste_types.includes(element))) &&
          (filters.zone.length == 0 || (filters.zone.length == 1 && !filters.zone[0]) || filters.zone.includes(zone)) &&
          (filters.generatorType.length == 0 || (filters.generatorType.length == 1 && !filters.generatorType[0]) || filters.generatorType.includes(order.generator_type))
        );
    });

    useEffect(() => {
      if (filteredOrders) {
        setPages(Math.ceil(filteredOrders.length / rowsPerPage)); 
      } 
    }, [orders, filters]);

    const get_orders = React.useMemo(() => {
      if (filteredOrders) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
    
        return filteredOrders.slice(start, end);
      }
      else
        return []
    
    }, [page, filteredOrders]);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, orders);
                doc.save('solicitudes.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(orders);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'solicitudes');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    useEffect(() => {
        const fetchOrders = async () => {
          if (userSession.userId) {
            try {
              await getCoopOrdersById(userSession.userId)
              .then((response) => Promise.all(response.map(order => transform_order_data(order))))
              .then((transformed_orders) => {
                setOrders(transformed_orders)
                setPages(Math.ceil(transformed_orders.length / rowsPerPage))
                })
                .then(() => setLoading(false))
              
            } catch (error) {
              console.log("Error al obtener pedidos", error);
            } 
          } else {
            setLoading(false);
          }
        };
    
        fetchOrders();
    }, []);

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
        order.status = getStatus(order.status)
        return order
    }

    const redirectDetailPage = (rowData) => {
        console.log(rowData)
        router.replace(`/home/cooperativa/pedidos/detalles/${rowData.id}`)
    };

    const clearFilters = () => {
        setFilters({ zone: [], wasteType: [], generatorType: [], date_from: '', date_to: '', status: [] });
    }

    return (
        <div className="overflow-x-auto max-w-full w-full text-2xs md:text-sm min-h-full flex  flex-col">
            {(loading || !orders) && <Spinner/>}
            {!loading && orders &&
            <div className='flex gap-3 justify-end mt-3 mr-3 md:mr-12 md:mt-7'>
                <Button type="button" className="bg-white" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS">
                <img src="/excel.svg" alt="box" className="w-7 md:w-10 bg-white" />
                </Button> 
            </div>
            }
            {!loading && orders && (document.documentElement.clientWidth > 750) &&
                <Card className='lg:mx-9 my-4 mx-4'>
                <CardHeader className='bg-green-dark text-white pl-4 text-lg font-semibold py-3'>SOLICITUDES</CardHeader>
                <Divider />
                <CardBody className='p-0'>
                <div className="flex gap-4 m-4">
                <DateRangePicker label="Fecha" className="max-w-[284px]" onChange={(e) => 
                    setFilters({ ...filters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })} />

                <Input
                  className='select'
                  placeholder="Nombre del Generador"
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
                    placeholder="Tipo de Reciclables"
                    value={filters.wasteType}
                    options={wasteTypes}
                    selectionMode="multiple"
                    onChange={(e) => setFilters({ ...filters, wasteType: e.target.value.split(',')})}
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
                    value={filters.generatorType}
                    options = {generatorTypes}
                    selectionMode="multiple"
                    onChange={(e) => {
                        setFilters({ ...filters, generatorType: e.target.value.split(',') }) }}
                    >
                        {generatorTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                            {type.label}
                        </SelectItem>
                        ))}
                    </Select>
                    <Select
                  className='select'
                  placeholder="Estado de la solicitud"
                  value={filters.status}
                  options={statuses}
                  selectionMode="multiple"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value.split(',') })}
                >
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                </Select>
                <div className='flex flex-col items-center justify-center'>
                  <FilterAltOffIcon className='cursor-pointer' onClick={clearFilters}/>
                  <p className='text-center'>Limpiar filtros</p>
                </div>
                </div>
                <Table
                        bottomContent={
                        <div className="flex w-full justify-between items-center">
                        <span className='flex 1 invisible'>{get_orders.length} de {filteredOrders.length} solicitudes</span>
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
                        <span className='flex 1'>{get_orders.length} de {filteredOrders.length} solicitudes</span>
                    </div>}
                >
                    <TableHeader>
                    <TableColumn className='text-small'>Fecha de recolección</TableColumn>
                    <TableColumn className='text-small'>Nombre generador</TableColumn>
                    <TableColumn className='text-small'>Zona</TableColumn>
                    <TableColumn className='text-small'>Tipo de residuo</TableColumn>
                    <TableColumn className='text-small'>Tipo de generador</TableColumn>
                    <TableColumn className='text-small'>Fecha de creación</TableColumn>
                    <TableColumn className='text-small'>Estado</TableColumn>
                    <TableColumn className='text-small'>Acciones</TableColumn>
                    </TableHeader>
                    <TableBody>
                    {get_orders.map((request, index) => (
                        <TableRow key={index} className='cursor-pointer hover:bg-green-dark hover:text-white'>
                        <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                        <TableCell>{request.generator_name}</TableCell>
                        <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                        <TableCell>{formatWasteType(request.waste_types)}</TableCell>
                        <TableCell>{request.generator_type}</TableCell>
                        <TableCell>{formatDate(request.request_date)}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>
                            <Button className="rounded-full" onClick={() => redirectDetailPage(request)}>Ver</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardBody>
                </Card>
            }

                {!loading && orders && (document.documentElement.clientWidth <= 750) &&
                <Card className='lg:mx-9 my-4 mx-4'>
                <CardHeader className='bg-green-dark text-white pl-4 text-xl font-bold py-3'>SOLICITUDES</CardHeader>
                <Divider />
                <CardBody className='p-0'>
                <div className="flex gap-4 m-4">
                <DateRangePicker label="Fecha" className="max-w-[284px]" placeholder="" onChange={(e) => 
                    setFilters({ ...filters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })} />

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
                  options={statuses}
                  selectionMode="multiple"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value.split(',') })}
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
                        <span className='flex 1 invisible'>{get_orders.length} de {filteredOrders.length} solicitudes</span>
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
                        <span className='flex 1'>{get_orders.length} de {filteredOrders.length} solicitudes</span>
                    </div>}
                >
                    <TableHeader>
                    <TableColumn>Fecha de recolección</TableColumn>
                    <TableColumn>Nombre generador</TableColumn>
                    <TableColumn>Zona</TableColumn>
                    <TableColumn>Estado</TableColumn>
                    <TableColumn></TableColumn>
                    </TableHeader>
                    <TableBody>
                    {get_orders.map((request, index) => (
                        <TableRow key={index} className='cursor-pointer hover:bg-green-dark hover:text-white'>
                        <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                        <TableCell>{request.generator_name}</TableCell>
                        <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell><Button onClick={() => redirectDetailPage(request)}>Ver</Button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardBody>
            </Card>
            }
        </div>
    );
}
        