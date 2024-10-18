'use client'
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, Divider, CardFooter,
    Table, TableHeader, TableBody, TableRow, TableCell, Button,
    TableColumn, Pagination, Select, SelectItem, Input, DateRangePicker
} from '@nextui-org/react';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import React, { useState, useEffect } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { getGeneratorOrdersById, getUserById } from "@api/apiService"
import { useRouter } from 'next/navigation';
import Spinner from "@components/Spinner"
import { mapMaterialNameToLabel } from '@/constants/recyclables';
import { formatDate, formatDateRange } from '@/utils/dateStringFormat';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import "./style.css"

export default function BasicFilterDemo() {
    const router = useRouter();
    const userSession = useSelector((state) => state.userSession);

    const [orders, setOrders] = useState(null)
    const [filters, setFilters] = useState({ zone: [], wasteType: [], generatorType: [], date_from: '', date_to: '', status: []});
    
    const [waste_types, setWasteTypes] = useState([])
    const [zones, setZones] = useState([])
    const [loading, setLoading] = useState(true);

    const rowsPerPage = 5;
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(null); 
    
    const statuses = [
        { value: 'Ingresada', label: 'Ingresada' },
        { value: 'Completada', label: 'Completada' },
        { value: 'Cancelada', label: 'Cancelada' },
        { value: 'En ruta', label: 'En ruta' },
        { value: 'En proceso', label: 'En proceso' }
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

    const get_orders = React.useMemo(() => {
        if (filteredOrders) {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
      
          return filteredOrders.slice(start, end);
        }
        else
          return []
      
      }, [page, filteredOrders]);

    useEffect(() => {
        const fetchOrders = async () => {
          if (userSession) {
            try {
              await getGeneratorOrdersById(userSession.userId)
              .then((response) => Promise.all(response.map(order => transform_order_data(order))))
              .then((transformed_orders) => {
                setOrders(transformed_orders)
                setWasteTypes([...new Set(transformed_orders.map(order => order.waste_types).flat())].sort())
                setZones([...new Set(transformed_orders.map(order => order.zone))].sort())
                })
                .then(() => setLoading(false))
            } catch (error) {
              console.log("Error al obtener pedidos", error);
            } 
          } else {
            console.log("User ID no disponible");
            setLoading(false);
          }
        };
    
        fetchOrders();
    }, []);

    const getSeverity = (status) => {
        switch (status) {
            case 'Cancelada':
                return 'danger';

            case 'Completada':
                return 'success';

            case 'Ingresada':
                return 'info';

            case 'Coordinada':
                return 'warning';
            
            case 'En camino':
                return 'warning';
        }
    }

    const getStatus = (status) => {
        switch (status) {
            case 'REJECTED':
                return 'Cancelada';

            case 'COMPLETED':
                return 'Completada';

            case 'OPEN':
                return 'Ingresada';

            case 'PENDING':
                return 'Coordinada';
            
            case 'ON_ROUTE':
                return 'En camino';
        }
    }

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


    const transform_order_data = async (order) => {
        const response = await getUserById(order.generator_id);
        order.request_date = new Date(order.request_date)
        order.pickup_date_from = new Date(order.pickup_date_from)
        order.pickup_date_to = new Date(order.pickup_date_to)
        order.pickup_date = formatDateRange(order.pickup_date_from, order.pickup_date_to)
        order.generator = response.username
        order.waste_types = order.waste_quantities.map(waste => waste.waste_type).sort()
        order.waste_quantities = getCombinations(order.waste_quantities.map(waste => waste.waste_type))
        order.size = 50
        order.status = getStatus(order.status)
        console.log(order)
        return order
    }
    
    const getCombinations = (arr) => {
        const result = [];
    
        const permute = (currentArr, remainingArr) => {
            if (remainingArr.length === 0) {
                result.push(currentArr); // Agrega la combinación cuando no quedan elementos
            } else {
                for (let i = 0; i < remainingArr.length; i++) {
                    const newCurrent = [...currentArr, remainingArr[i]];
                    const newRemaining = remainingArr.filter((_, index) => index !== i);
                    permute(newCurrent, newRemaining); // Llama recursivamente
                }
            }
        };
    
        permute([], arr); // Comienza con un array vacío y el array original
        return result;
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                </IconField>
            </div>
        );
    };

    const formatWasteType = (value) => {
        return value.map((waste) => mapMaterialNameToLabel[waste]).join(', ');
    };

    const redirectDetailPage = (rowData) => {
        router.replace(`/home/generador/pedidos/detalles/${rowData.value.id}`)
    };

    const clearFilters = () => {
        setFilters({ zone: [], wasteType: [], generatorType: [], date_from: '', date_to: '', status: [] });
    }

    return (
        <div className="overflow-x-auto max-w-full w-full text-2xs md:text-sm min-h-full flex flex-col">
            {loading && <Spinner/>}
            {!loading && orders &&
            <div className='flex justify-between items-center mt-4 mx-4'>
                <p className='text-start text-xl font-bold ml-2'>Solicitudes de recolección</p>
                <Button type="button" className='bg-white' onClick={exportExcel} data-pr-tooltip="XLS">
                    <img src="/excel.svg" alt="box" className="w-7 md:w-10" />
                </Button> 
                {/*<Button type="button" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF">
                <img src="/pdf.svg" alt="box" className="w-7 md:w-10" />
            </Button>  */}
            </div>
            }
            
            {!loading && orders &&
            <div className='flex flex-col mx-4 my-4 gap-2'>
                <Card className='rounded-md'>
                <CardBody>
                <div className="flex gap-4 items-center">
                <DateRangePicker label="Fecha" className="max-w-[284px]" onChange={(e) => 
                    setFilters({ ...filters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })}
                />

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
                  placeholder="Estado de la solicitud"
                  value={filters.status}
                  options={statuses}
                  selectionMode="multiple"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value.split(',') })}>

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
                </CardBody>
                </Card>

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
                    <TableColumn className='text-small'>Zona</TableColumn>
                    <TableColumn className='text-small'>Tipo de residuo</TableColumn>
                    <TableColumn className='text-small'>Fecha de creación</TableColumn>
                    <TableColumn className='text-small'>Estado</TableColumn>
                    <TableColumn className='text-small'>Acciones</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay solicitudes para mostrar">
                    {get_orders.map((request, index) => (
                        <TableRow key={index} className='cursor-pointer hover:bg-green-dark hover:text-white'>
                        <TableCell>{formatDateRange(request.pickup_date_from, request.pickup_date_to)}</TableCell>
                        <TableCell>{request.address? request.address.zone : request.generator.address.zone}</TableCell>
                        <TableCell>{formatWasteType(request.waste_types)}</TableCell>
                        <TableCell>{formatDate(request.request_date)}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>
                            <Button className="rounded-medium" onClick={() => redirectDetailPage(request)}>Ver</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
            }

        </div>
    );
}
