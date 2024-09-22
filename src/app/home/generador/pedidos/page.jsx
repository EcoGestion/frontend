'use client'
import { users } from '../../../../data';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { useUser } from '../../../../state/userProvider';
import { getCoopOrdersById, getGeneratorOrdersById, getUserById } from "../../../../api/apiService";
import { useRouter } from 'next/navigation';
import Spinner from "../../../../components/Spinner"
import "./style.css"

export default function BasicFilterDemo() {
    const router = useRouter();
    const {user} = useUser(); 
    const [orders, setOrders] = useState(null)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        generator: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.IN },
        waste_quantities: { value: null, matchMode: FilterMatchMode.CONTAINS },
        zone: { value: null, matchMode: FilterMatchMode.IN },
        creation_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        pickup_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] } ,
    });
    const [waste_types, setWasteTypes] = useState([])
    const [zones, setZones] = useState([])
    const [loading, setLoading] = useState(true);
    const statuses = ['Completada', 'Coordinada', 'Cancelada', 'Ingresada'];

    const cols = [
        { field: 'generator', header: 'Generador' },
        { field: 'request_date', header: 'Fecha creación' },
        { field: 'pickup_date', header: 'Fecha Recolección' },
        { field: 'waste_quantities', header: 'Tipo' },
        { field: 'size', header: 'Cantidad' },
        { field: 'zone', header: 'Barrio' },
        { field: 'status', header: 'Estado' },
    ];

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
          if (user.userId) {
            try {
              // Hay que cambiarlo por el Get Orders de generador.
              // No esta funcionando
              await getCoopOrdersById(user.userId)
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
            setLoading(false);
          }
        };
    
        fetchOrders();
    }, [user.userId]);

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
        }
    }

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
    const transform_order_data = async (order) => {
        const response = await getUserById(order.generator_id);
        order.request_date = new Date(order.request_date)
        order.pickup_date_from = new Date(order.pickup_date_from)
        order.pickup_date_to = new Date(order.pickup_date_to)
        order.pickup_date = formatDate(order.pickup_date_from) + " - " + formatDate(order.pickup_date_to)
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

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag className="p-1 small-font" value={option} severity={getSeverity(option)} />;
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={statuses}
                itemTemplate={statusItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel=""
                placeholder="Estado"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '6rem' }}
            />
        );
    };

    const wasteTypeBodyTemplate = (rowData) => {
        console.log(rowData.waste_quantities)
        return formatWasteType(rowData.waste_types);
    };

    const wasteTypeItemTemplate = (option) => {
        return option;
    };

    const wasteTypeRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value? options.value.sort() : options.value}
                options={waste_types}
                itemTemplate={wasteTypeItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel=""
                placeholder="Tipo"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '4rem' }}
            />
        );
    };

    const zoneBodyTemplate = (rowData) => {
        return rowData.zone;
    };

    const zoneItemTemplate = (option) => {
        return option;
    };

    const zoneRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={zones}
                itemTemplate={zoneItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Barrio"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '6rem' }}
            />
        );
    };

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

    const creationDateBodyTemplate = (rowData) => {
        return formatDate(rowData.request_date);
    };

    const recolectionDateBodyTemplate = (rowData) => {
        return rowData.pickup_date;
    };

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" />;
    };

    const redirectDetailPage = (rowData) => {
        router.replace(`/home/cooperativa/pedidos/detalles/${rowData.value.id}`)
    };

    const header = renderHeader();

    return (
        <div className="overflow-x-auto max-w-full w-full text-2xs md:text-sm min-h-full flex  flex-col">
            {loading && <Spinner/>}
            {!loading && orders &&
            <div className='flex gap-3 justify-end mt-3 mr-3 md:mr-12 md:mt-7'>
                <Button type="button" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS">
                <img src="/excel.svg" alt="box" className="w-7 md:w-10" />
                </Button> 
                {/*<Button type="button" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF">
                <img src="/pdf.svg" alt="box" className="w-7 md:w-10" />
            </Button>  */}
            </div>
            }
            {!loading && orders && (document.documentElement.clientWidth > 750) &&
            <DataTable value={orders} removableSort selectionMode="single" onSelectionChange={(e) => redirectDetailPage(e)} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['generator', 'waste_quantities', 'zone', 'status', 'request_date']} header={header} emptyMessage="No se han encontrado solicitudes." rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} solicitudes">
                <Column filterMatchMode='contains' field="generator" header="GENERADOR" filter filterPlaceholder="Buscar" showFilterMenu={false} style={{ minWidth: '8rem' }} />
                <Column field="request_date" header="FECHA CREACIÓN" dataType="date"   style={{ minWidth: '4rem' }} body={creationDateBodyTemplate} filterElement={dateFilterTemplate} sortable />
                <Column field="pickup_date" header="FECHA RECOLECCIÓN" dataType="date"  style={{ minWidth: '4rem' }} body={recolectionDateBodyTemplate} filterElement={dateFilterTemplate} sortable/>
                <Column header="TIPO" filterField="waste_quantities" showFilterMenu={false} filterMenuStyle={{ width: '4rem' }} style={{ minWidth: '4rem' }}
                    body={wasteTypeBodyTemplate} filter filterElement={wasteTypeRowFilterTemplate} />
                <Column header="BARRIO" filterField="zone" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={zoneBodyTemplate} filter filterElement={zoneRowFilterTemplate} />
                <Column header="ESTADO" filterField="status" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
            </DataTable>
            }
            {!loading && orders && (document.documentElement.clientWidth <= 750) &&
            <DataTable value={orders} removableSort selectionMode="single" onSelectionChange={(e) => redirectDetailPage(e)} paginator rows={20} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['generator', 'zone', 'status']} header={header} emptyMessage="No se han encontrado solicitudes." rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} solicitudes">
                <Column field="generator" header="GENERADOR" filter filterPlaceholder="Buscar"  showFilterMenu={false} style={{ minWidth: '6.5rem' }} />
                <Column field="pickup_date" header="FECHA RECOLECCIÓN" dataType="date"  style={{ minWidth: '4rem' }} body={recolectionDateBodyTemplate} filterElement={dateFilterTemplate} sortable/>
                <Column header="BARRIO" filterField="zone" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={zoneBodyTemplate} filter filterElement={zoneRowFilterTemplate} />
                <Column header="ESTADO" filterField="status" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
            </DataTable>
            }
        </div>
    );
}
