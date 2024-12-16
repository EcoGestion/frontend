'use client'
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, Divider, CardFooter,
    Table, TableHeader, TableBody, TableRow, TableCell, Button,
    TableColumn, Pagination, Select, SelectItem, Input, DateRangePicker
} from '@nextui-org/react';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import React, { useState, useEffect } from 'react';
import { getGeneratorOrdersById, getUserById } from "@api/apiService"
import { useRouter } from 'next/navigation';
import Spinner from "@components/Spinner"
import { mapMaterialNameToLabel } from '@/constants/recyclables';
import { formatDate, formatDateRange } from '@/utils/dateStringFormat';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FiltersModal from '@components/FiltersModal';
import "./style.css"
import { mapRequestStatus, mapRequestStatusToKey } from '@/constants/request';
import { wasteTypesDefault } from '@/constants/recyclables';
import { RequestStatus } from '@/constants/request';
import { parseDate } from "@internationalized/date";

export default function BasicFilterDemo() {
    const router = useRouter();
    const userSession = useSelector((state) => state.userSession);

    const [orders, setOrders] = useState(null)
    const [filters, setFilters] = useState({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });
    
    const [loading, setLoading] = useState(true);

    const rowsPerPage = 10;
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(null); 

    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
    
    
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
          (filters.orderStatus.length == 0 || (filters.orderStatus.length == 1 && !filters.orderStatus[0])  || filters.orderStatus.includes(mapRequestStatusToKey[order.status])) &&
          (filters.wasteType.length == 0 || (filters.wasteType.length == 1 && !filters.wasteType[0]) || filters.wasteType.every(element => order.waste_types.includes(element)))
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
              await getGeneratorOrdersById(userSession.userId, userSession.accessToken)
              .then((response) => Promise.all(response.map(order => transform_order_data(order))))
              .then((transformed_orders) => {
                setOrders(transformed_orders)
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


    const transform_order_data = async (order) => {
        const response = await getUserById(order.generator_id, userSession.accessToken);
        order.request_date = new Date(order.request_date)
        order.pickup_date_from = new Date(order.pickup_date_from)
        order.pickup_date_to = new Date(order.pickup_date_to)
        order.pickup_date = formatDateRange(order.pickup_date_from, order.pickup_date_to)
        order.generator = response.username
        order.waste_types = order.waste_quantities.map(waste => mapMaterialNameToLabel[waste.waste_type]).sort()
        order.waste_quantities = getCombinations(order.waste_quantities.map(waste => waste.waste_type))
        order.size = 50
        order.status = mapRequestStatus[order.status]
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

    const formatWasteType = (value) => {
        return value.map((waste) =>waste).join(', ');
    };

    const redirectDetailPage = (rowData) => {
        router.replace(`/home/generador/pedidos/detalles/${rowData.id}`)
    };

    const clearFilters = () => {
        setFilters({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });
    }

    const applyMobileFilters = (mobileFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...mobileFilters
        }));
        setIsFiltersModalOpen(false)
    }

    return (
        <div className="overflow-x-auto max-w-full w-full text-2xs md:text-sm min-h-full flex flex-col">
            <FiltersModal isOpen={isFiltersModalOpen} onRequestClose={() => setIsFiltersModalOpen(false)} onConfirm={applyMobileFilters} currentFilters={filters}
                showDate showWasteTypes showStatus
            />
            {loading && <Spinner/>}
            {!loading && orders &&
            <div className='flex justify-between items-center mt-4 mx-4'>
                <p className='text-start text-xl font-bold ml-2'>Solicitudes de recolección</p>
                <Button type="button" className='bg-white md:hidden flex-col' onClick={() => setIsFiltersModalOpen(true)}>
                    <FilterAltIcon fontSize='small' className='cursor-pointer'/>
                    Filtros
                </Button>
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
                <Card className='hidden md:flex rounded-md'>
                    <CardBody>
                    <div className="flex gap-4 items-center">
                    <DateRangePicker label="Fecha" className="max-w-[284px]" onChange={(e) => 
                        setFilters({ ...filters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })}
                        value={filters.date_from && filters.date_to ? { start: parseDate(filters.date_from.toISOString().split('T')[0]), end: parseDate(filters.date_to.toISOString().split('T')[0]) } : null}
                    />

                    <Select
                        className='select'
                        placeholder="Tipo de Reciclables"
                        selectedKeys={filters.wasteType}
                        options={wasteTypesDefault}
                        selectionMode="multiple"
                        onChange={(e) => setFilters({ ...filters, wasteType: e.target.value.split(',')})}
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
                    selectedKeys={filters.orderStatus}
                    options={RequestStatus}
                    selectionMode="multiple"
                    onChange={(e) => setFilters({ ...filters, orderStatus: e.target.value.split(',') })}>

                        {RequestStatus.map((status) => (
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
                        <div className="flex flex-col md:flex-row w-full justify-between items-center">
                            <span className='hidden md:flex md:invisible'>{get_orders.length} de {filteredOrders.length} solicitudes</span>
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
                            <span className='flex'>{get_orders.length} de {filteredOrders.length} solicitudes</span>
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
