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
import { getOrdersById } from "../../../../api/apiService";
import { useRouter } from 'next/navigation';
import "./style.css"

export default function BasicFilterDemo() {
    const router = useRouter();
    const {user} = useUser(); 
    const [customers, setCustomers] = useState(null);
    const [orders, setOrders] = useState(null)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        generator: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.IN },
        waste_type: { value: null, matchMode: FilterMatchMode.IN },
        zone: { value: null, matchMode: FilterMatchMode.IN },
        creation_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        recolection_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] } ,
    });
    const [waste_types, setWasteTypes] = useState([])
    const [zones, setZones] = useState([])
    const [loading, setLoading] = useState(true);
    const statuses = ['Completada', 'Coordinada', 'Cancelada', 'Ingresada'];

    const cols = [
        { field: 'generator', header: 'Generador' },
        { field: 'creation_date', header: 'Fecha creación' },
        { field: 'recolection_date', header: 'Fecha Recolección' },
        { field: 'waste_type', header: 'Tipo' },
        { field: 'size', header: 'Cantidad' },
        { field: 'zone', header: 'Barrio' },
        { field: 'status', header: 'Estado' },
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, customers);
                doc.save('solicitudes.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(customers);
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
              const response = await getOrdersById(user.userId);
              setOrders(response); 
            } catch (error) {
              console.log("Error al obtener pedidos", error);
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        };
    
        fetchOrders();
        console.log(orders)
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
    const transform_date_user = (user) => {
        user.recolection_date = new Date(user.recolection_date)
        user.creation_date = new Date(user.creation_date)

        return user
    }

    useEffect(() => {
            setWasteTypes([...new Set(users.map(user => user.waste_type))].sort())
            setZones([...new Set(users.map(user => user.zone))].sort())
            setCustomers(users.map(user => transform_date_user(user)));
            setLoading(false);
    }, []); 

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
        return rowData.waste_type;
    };

    const wasteTypeItemTemplate = (option) => {
        return option;
    };

    const wasteTypeRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
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
        return value.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const creationDateBodyTemplate = (rowData) => {
        return formatDate(rowData.creation_date);
    };

    const recolectionDateBodyTemplate = (rowData) => {
        return formatDate(rowData.recolection_date);
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
            <div className='flex gap-3 justify-end mt-3 mr-3 md:mr-12 md:mt-7'>
                <Button type="button" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS">
                <img src="/excel.svg" alt="box" className="w-7 md:w-10" />
                </Button> 
                <Button type="button" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF">
                <img src="/pdf.svg" alt="box" className="w-7 md:w-10" />
                </Button> 
            </div>
            {!loading && (document.documentElement.clientWidth > 750) &&
            <DataTable value={customers} removableSort selectionMode="single" onSelectionChange={(e) => redirectDetailPage(e)} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['generator', 'waste_type', 'zone', 'status', 'creation_date']} header={header} emptyMessage="No se han encontrado solicitudes." rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} solicitudes">
                <Column field="generator" header="GENERADOR" filter filterPlaceholder="Buscar"  showFilterMenu={false} style={{ minWidth: '8rem' }} />
                <Column field="creation_date" header="FECHA CREACIÓN" dataType="date"   style={{ minWidth: '4rem' }} body={creationDateBodyTemplate} filterElement={dateFilterTemplate} sortable />
                <Column field="recolection_date" header="FECHA RECOLECCIÓN" dataType="date"  style={{ minWidth: '4rem' }} body={recolectionDateBodyTemplate} filterElement={dateFilterTemplate} sortable/>
                <Column header="TIPO" filterField="waste_type" showFilterMenu={false} filterMenuStyle={{ width: '4rem' }} style={{ minWidth: '4rem' }}
                    body={wasteTypeBodyTemplate} filter filterElement={wasteTypeRowFilterTemplate} />
                <Column header="BARRIO" filterField="zone" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={zoneBodyTemplate} filter filterElement={zoneRowFilterTemplate} />
                <Column header="ESTADO" filterField="status" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
            </DataTable>
            }
            {!loading && (document.documentElement.clientWidth <= 750) &&
            <DataTable value={customers} removableSort selectionMode="single" onSelectionChange={(e) => redirectDetailPage(e)} paginator rows={20} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['generator', 'waste_type', 'zone', 'status', 'creation_date']} header={header} emptyMessage="No se han encontrado solicitudes." rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} solicitudes">
                <Column field="generator" header="GENERADOR" filter filterPlaceholder="Buscar"  showFilterMenu={false} style={{ minWidth: '6.5rem' }} />
                <Column field="recolection_date" header="FECHA RECOLECCIÓN" dataType="date"  style={{ minWidth: '4rem' }} body={recolectionDateBodyTemplate} filterElement={dateFilterTemplate} sortable/>
                <Column header="BARRIO" filterField="zone" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={zoneBodyTemplate} filter filterElement={zoneRowFilterTemplate} />
                <Column header="ESTADO" filterField="status" showFilterMenu={false} filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }}
                    body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
            </DataTable>
            }
        </div>
    );
}
        