import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import { createUser } from '@/api/apiService';
import GreenRoundedButton from '@/components/greenRoundedButton';
import Spinner from '@/components/Spinner';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth } from '@firebaseConfig';
import { Tabs, Tab } from '@nextui-org/react';
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

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

const DriverModal = ({ isOpen, onRequestClose }) => {
  const userSession = useSelector((state) => state.userSession);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    firebase_id: '',
    type: 'TRUCK_DRIVER',
    address: {
      street: '',
      number: '',
      city: '',
      province: '',
      lat: '',
      lng: '',
      zip_code: ''
    },
    driver_details: {
      coop_id: 0,
    }
  });

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, phone, address } = formData;
    if (!username || !email || !password || !phone || !address.street || !address.number || !address.city || !address.province || !address.zip_code) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizo con el id de firebase y el id de la cooperativa
      setFormData({
        ...formData,
        firebase_id: user.uid,
        driver_details: {
          coop_id: userSession.userId
        }
      });
      console.log(formData);
      try {
        await createUser(formData);
        onRequestClose();
      } catch (error) {
        // Si hay error en el back elimino de Firebase
        console.log('Error al registrar el conductor:', error);
        await deleteUser(user);
        throw error;
      }
    } catch (error) {
      alert('Error al registrar el conductor. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles.modal}>
      {loading && 
      <div style={styles.loadingContainer}>
        <h2 className='text-large font-bold'>Registrando conductor...</h2>
        <Spinner />
      </div>
      }
      {!loading && 
      <div>
      <div style={{textAlign: 'center', padding: '2px'}}>
        <h2 className='text-large font-bold'>Registrar un conductor</h2>
      </div>
      <form onSubmit={handleSubmit} className='pt-2'>
        <Tabs fullWidth size='md' radius='lg' variant='solid' placement='top'>
          <Tab key="basic-info" title="Conductor">
        <div className='pb-3' >
        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Nombre:
        </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder='Ej: Juan Pérez'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />

        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Email:
        </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder='Ej: juan.perez@example.com'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />

        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Contraseña:
        </label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder='Contraseña'
            onChange={handlePasswordChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />

        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Teléfono:
        </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            placeholder='Ej: 123456789'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
          </Tab>

        <Tab key="address" title="Dirección">
        <div className='pb-3' >
        <label className=' text-sm font-medium leading-6 text-gray-900'>
          Dirección:
        </label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            placeholder='Calle'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
          <input
            type="text"
            name="address.number"
            value={formData.address.number}
            placeholder='Número'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            placeholder='Ciudad'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
          <input
            type="text"
            name="address.province"
            value={formData.address.province}
            placeholder='Provincia'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
          <input
            type="text"
            name="address.zip_code"
            value={formData.address.zip_code}
            placeholder='Código Postal'
            onChange={handleChange}
            required
            className='block w-full rounded-md py-1.5 mb-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
        </Tab>
        </Tabs>

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

export default DriverModal;