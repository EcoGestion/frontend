import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { DateRangePicker, Input, Select, SelectItem } from '@nextui-org/react';
import { wasteTypesDefault } from '@/constants/recyclables';
import { RequestStatus } from '@/constants/request';
import { parseDate } from "@internationalized/date";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { generatorTypes } from '@/constants/userTypes';
import zones from '@/constants/zones';
import GreenRoundedButton from './greenRoundedButton';

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
  currentFilters,
  showWasteTypes = false,
  showDate = false,
  showStatus = false,
  showGenName = false,
  showGenTypes = false,
  showZones = false
}) => {
  const [filters, setFilters] = useState({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });
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
    setFilters({ wasteType: [], date_from: null, date_to: null, orderStatus: [], genName: '', genTypes: [], zones: [] });
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
        {showGenName &&
          <div>
          <label htmlFor='filterGenName'>Nombre del generador</label>
          <Input
            className='select'
            placeholder="Generador"
            value={filters.genName}
            onChange={(e) => {
              setFilters({...filters, genName: e.target.value})
            }}>
          </Input>
        </div>}

        {showDate &&
          <div className='mt-3'>
          <label htmlFor='filterDate'>Fecha de recolección</label>
          <DateRangePicker label="Fecha" className="max-w-[284px]" onChange={(e) => 
            setFilters({ ...filters, date_from: new Date(e.start.year, e.start.month - 1, e.start.day, 0,0,0,0), date_to: new Date(e.end.year, e.end.month - 1, e.end.day,23,59,59,999) })
          }
          value={dateRange?.start && dateRange?.end ? dateRange : null}
          />
        </div>}

        {showWasteTypes &&
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
        </div>}
      
        {showStatus &&
          <div className='mt-3'>
          <label htmlFor='filterStatus'>Estado de la solicitud</label>
          <Select
            className='select'
            placeholder="Estado de la solicitud"
            options={RequestStatus}
            selectedKeys={filters.orderStatus}
            selectionMode="multiple"
            onChange={(e) => setFilters({ ...filters, orderStatus: e.target.value.split(',') })}>

              {RequestStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
          </Select>
        </div>}

        {showGenTypes &&
          <div className='mt-3'>
          <label htmlFor='filterGenTypes'>Tipo de generador</label>
          <Select
            className='select'
            placeholder="Tipo de Generador"
            selectedKeys={filters.genTypes}
            options = {generatorTypes}
            selectionMode="multiple"
            onChange={(e) => {
              setFilters({ ...filters, genTypes: e.target.value.split(',') }) }}
          >
              {generatorTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
          </Select>
        </div>}
                        
        {showZones &&
          <div className='mt-3'>
          <label htmlFor='filterZones'>Zonas</label>
          <Select
            className='select'
            placeholder="Zona"
            selectedKeys={filters.zone}
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
        </div>}

      </div>


      <div className='w-full h-full mt-3'>
        <button 
          type='button'
          className="bg-white text-gray-dark hover:text-gray-light border-gray-dark hover:border-gray-light py-2 px-3 rounded-medium border-medium shadow-md transition duration-300 mr-2" 
          onClick={onRequestClose}
        >
          Cancelar
        </button>
        <GreenRoundedButton
          onClick={handleConfirm}
          buttonTitle='Aplicar filtros'
        />
      </div>
    </Modal>
  );
};

export default FiltersModal;