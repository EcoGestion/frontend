import React, { useState } from 'react';
import Modal from 'react-modal';
import { createTruck } from '@/api/apiService';
import GreenRoundedButton from '@/components/greenRoundedButton';
import Spinner from '@/components/Spinner';
import { useSelector } from 'react-redux';
import { TruckStatus } from '@constants/truck';
import { ToastContainer } from 'react-toastify';
import { ToastNotifier } from '@/components/ToastNotifier';

const styles = {
  modal: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '400px',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    textAlign: 'center'
  }
};


const TruckModal = ({ isOpen, onRequestClose }) => {
  const userSession = useSelector((state) => state.userSession);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patent: '',
    brand: '',
    model: '',
    capacity: '',
    status: 'ENABLED',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patent, brand, model, capacity } = formData;
    if (!patent || !brand || !model || !capacity) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    setLoading(true);

    const payload = {
      ...formData,
      coop_id: userSession.userId
    };

    try {
      await createTruck(payload);
      onRequestClose();
      ToastNotifier.success('Camión registrado correctamente');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      ToastNotifier.error('Error al registrar el camión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles.modal}>
      <ToastContainer />
      {loading && 
      <div style={styles.loadingContainer}>
        <h2 className='text-large font-bold'>Registrando camión...</h2>
        <Spinner />
      </div>
      }
      {!loading && 
      <div>
      <div style={{textAlign: 'center', padding: '2px'}}>
        <h2 className='text-large font-bold'>Registrar un camión</h2>
      </div>
      <form onSubmit={handleSubmit} >
        <div className='pb-3' >

        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Patente:
        </label>
          <input
            type="text"
            name="patent"
            value={formData.patent}
            placeholder='Ej: ABC123'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />

        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Marca:
        </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            placeholder='Ej: VolksWagen'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />

        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Modelo:
        </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            placeholder='Ej: 2020'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />

        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Capacidad (expresada en toneladas):
        </label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            placeholder='Ej: 10'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Capacidad (expresada en toneladas):
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        >
          {TruckStatus.map((status) => (
            <option key={status.key} value={status.value}>{status.label}</option>
          ))}

        </select>
        </div>

        <div style={{textAlign: 'center', padding: '2px', display:'flex', justifyContent:'center', gap: '8px'}}>
        <button
          type="button"
          className="bg-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 "
          onClick={onRequestClose}>
            Cancelar
        </button>
        <GreenRoundedButton
          buttonTitle='Registrar'
          onClick={handleSubmit}
          />
        </div>
      </form>
      </div>}
    </Modal>
  );
};

export default TruckModal;
