'use client'
import { useEffect, useState } from 'react';
import GreenRoundedButton from '@/components/greenRoundedButton';
import geocodeAddress from '@/utils/geocodeAddress';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardBody, Divider, CardFooter } from '@nextui-org/react';
import BlueRoundedButton from '@/components/blueRoundedButton';
import AddressForm from '@/components/AddressForm';
import { ToastNotifier } from '@/components/ToastNotifier';
import { ToastContainer } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';

// Dynamic import to avoid Window not defined error
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const OnboardingCooperativaFormStep1 = ({
  nextStep,
  address = {street:'', number:'', zone:'', city:'', province:'', zip_code:0, lat:0, lng:0},
  setAddress
  }) => {
  
  const [coordinates, setCoordinates] = useState([-34.5814551, -58.4211107]);
  const [markers, setMarkers] = useState([]);
  const [verified, setVerified] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    if (address.street != '' && address.number != '' && address.city != '' && address.zip_code != 0 && address.province != '') {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [address]);

  const updateCoordinates = async () => {
    if (!isFormValid) {
      ToastNotifier.error('Por favor complete todos los campos para continuar');
      return;
    }
    const addressObj = {
      street: address.street,
      number: address.number,
      city: address.city,
      zip_code: address.zip_code,
      province: address.province,
      country: 'Argentina'
    };
    const addressCoordinates = await geocodeAddress(addressObj);
    setAddress({...address, lat: addressCoordinates.latitud.toString(), lng: addressCoordinates.longitud.toString()});
    setCoordinates([addressCoordinates.latitud, addressCoordinates.longitud]);
    setMarkers([
      {
        position: [addressCoordinates.latitud, addressCoordinates.longitud],
        content: 'Cooperativa',
        popUp: 'Ubicación de la cooperativa'
      }
    ]);
    setVerified(true);
  };

  const nextForm = async () => {
    if (!verified) {
      ToastNotifier.error('Por favor verifique la dirección antes de continuar');
      return;
    }
    nextStep();
  }

    return (
    <div className="flex flex-col items-center justify-center bg-white overflow-auto p-3 md:px-1">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-800">
        Información de la cooperativa
      </h1>
      <div className="text-sm text-gray-600 my-4">
        <p>A continuación te pediremos información sobre la cooperativa a la que representas.</p>
        <p>Estos datos nos servirán para validar el perfil y para que los usuarios Generadores</p>
        <p>puedan conectar con tu Cooperativa en el momento de solicitar recolecciones.</p>
      </div>
      
      <div className="flex flex-col md:flex-row w-full">
        <Card className="border border-gray-900/10 rounded-lg w-full md:w-1/2">
          <div className="p-2">
            <CardBody>
              <p className="mt-2 text-sm font-bold text-gray-800">Dirección de la cooperativa</p>
              <AddressForm address={address} setAddress={setAddress} />
            </CardBody>
            <Divider />
            <CardFooter className='flex flex-col mt-2 justify-center'>
              <div className="flex flex-row gap-6">
                <div className="mt-2 flex">
                  <BlueRoundedButton onClick={updateCoordinates} buttonTitle='Verificar la direccion'/>
                </div>
                <div className="mt-2 flex">
                  <GreenRoundedButton onClick={nextForm} buttonTitle='Siguiente'/>
                </div>
              </div>
            </CardFooter>
          </div>
        </Card>

        <div className="w-full md:w-1/2">
          <div className="p-2">
            <p className="mt-2 text-sm leading-6 font-bold text-gray-800">Ubicación de la cooperativa</p>
            <MapView
              centerCoordinates={coordinates}
              markers={markers}
              zoom={verified ? 15 : 13}
            />
            <div className="flex justify-center mt-4">
              {!verified &&
                <div className="flex justify-center">
                  <ClearIcon fontSize='small' color='error'/>
                  <p className="text-sm text-red-500">Dirección no verificada</p>
                </div>
              }
              {verified &&
                <div className="flex justify-center">
                  <DoneIcon fontSize='small' color='success'/>
                  <p className="text-sm text-green-500">Dirección verificada</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCooperativaFormStep1;