import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { DateRangePicker, Select, SelectItem } from '@nextui-org/react';
import { wasteTypesDefault } from '@/constants/recyclables';
import { RequestStatus } from '@/constants/request';
import { parseDate } from "@internationalized/date";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const styles = {
  modal: {
    content: {
      width: '80%',
      height: '70%',
      margin: 'auto',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start'
    }
  }
};


const FiltersModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  currentFilters
}) => {
  const [filters, setFilters] = useState({ wasteType: [], date_from: null, date_to: null, status: []});
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  useEffect(() => {
    if (!filters.date_from || !filters.date_to) {
      return;
    }
    const startCalendarDate = parseDate(filters.date_from.toISOString().split('T')[0]);
    const endCalendarDate = parseDate(filters.date_to.toISOString().split('T')[0]);
    setDateRange({ start: startCalendarDate, end: endCalendarDate });
    setFilters(currentFilters);
  }, [filters]);

  const handleConfirm = () => {
    onConfirm(filters);
  };

  const clearFilters = () => {
    setFilters({ wasteType: [], date_from: null, date_to: null, status: [] });
    setDateRange({ start: null, end: null });
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles.modal}>
      <div className='mb-2'>
        <h1 className='text-2xl font-bold'>Filtros</h1>
        <div onClick={clearFilters}>
          <FilterAltOffIcon fontSize='small' className='cursor-pointer'/>
          <span className='text-sm text-gray-500 cursor-pointer'>Limpiar filtros</span>
        </div>
      </div>

      <div className='w-full h-full'>
        <div>
        <label htmlFor='filterDate'>Fecha de recolección</label>
        <DateRangePicker label="Fecha" className="max-w-[284px]" onChange={(e) => 
          setFilters({ ...filters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })
        }
        value={dateRange?.start && dateRange?.end ? dateRange : null}
        />
        </div>

        <div className='mt-3'>
        <label htmlFor='filterWasteTypes'>Tipo de Reciclables</label>
        <Select
          className='select'
          placeholder="Tipo de Reciclables"
          options={wasteTypesDefault}
          selectedKeys={filters.wasteType}
          selectionMode="multiple"
          onChange={(e) =>setFilters({ ...filters, wasteType: e.target.value.split(',')})}>
              {wasteTypesDefault.map((waste) => (
              <SelectItem key={waste.value} value={waste.value}>
                  {waste.label}
              </SelectItem>
              ))}
      </Select>
      </div>
      
      <div className='mt-3'>
      <label htmlFor='filterStatus'>Estado de la solicitud</label>
      <Select
        className='select'
        placeholder="Estado de la solicitud"
        options={RequestStatus}
        selectedKeys={filters.status}
        selectionMode="multiple"
        onChange={(e) => setFilters({ ...filters, status: e.target.value.split(',') })}>

          {RequestStatus.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
      </Select>
      </div>

      </div>


      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          type='button'
          className="bg-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 mt-4" 
          onClick={onRequestClose}
          style={{ flex: 1, marginRight: '10px' }}
        >
          Cancelar
        </button>
        <button
          type='button'
          className="bg-green-dark hover:bg-green-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 mt-4"
          onClick={handleConfirm}
          style={{ flex: 1, marginLeft: '10px' }}
        >
          Aplicar filtros
        </button>
      </div>
    </Modal>
  );
};

export default FiltersModal;