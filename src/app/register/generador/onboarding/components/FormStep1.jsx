'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GreenRoundedButton from '@/components/greenRoundedButton';
import dynamic from 'next/dynamic';
import geocodeAddress from '@/utils/geocodeAddress';
import { Card, CardHeader, CardBody, Divider, CardFooter } from '@nextui-org/react';
import {Select, SelectItem} from "@nextui-org/react";
import BlueRoundedButton from '@/components/blueRoundedButton';
import AddressForm from '@/components/AddressForm';

// Dynamic import to avoid Window not defined error
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const OnboardingGeneradorFormStep1 = ({
  nextStep,
  address = {street:'', number:'', zone:'', city:'', province:'', zip_code:0, lat:0, lng:0},
  setAddress
  }) => {
    const [coordinates, setCoordinates] = useState();
    const [markers, setMarkers] = useState([]);

    const updateCoordinates = async () => {
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
          content: 'Organización',
          popUp: 'Ubicación de la organización'
        }
      ]);
    };
  
    const nextForm = async () => {
      if (!coordinates) {
        await updateCoordinates();
      }
      nextStep();
    }

    useEffect(() => {
      // Update the MapView with the new coordinates
    }, [coordinates]);

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white overflow-auto">
        <Card className="border border-gray-900/10 rounded-lg p-6">
          <CardHeader className="text-base font-semibold leading-7 text-gray-900">
            Información de la organización
          </CardHeader>
          <CardBody className="mt-1 text-sm text-gray-600" style ={{width: '100%'}}>
            <p>A continuación te pediremos información sobre tu organización.</p>
            <p>Estos datos nos servirán para validar el perfil y para que puedas coordinar recolecciones con las cooperativas.</p>
          </CardBody>
  
          <Divider className="border-t border-gray-900/10" />
  
          <CardBody>
            <p className="mt-2 text-sm leading-6 font-bold text-gray-800">Dirección</p>
            <AddressForm address={address} setAddress={setAddress} />
          </CardBody>
          <Divider />
          <CardBody className="mt-1 text-sm text-gray-600">
            <p className="mt-2 text-sm leading-6 font-bold text-gray-800">Ubicación de la organización</p>
            <MapView
              centerCoordinates={coordinates}
              markers={markers}
              zoom={coordinates ? 15 : 13}
            />
          </CardBody>
          
          <Divider className="border-t border-gray-900/10" />

          <CardFooter className='justify-center gap-6'>
            <div className="mt-6 flex">
              <BlueRoundedButton onClick={updateCoordinates} buttonTitle='Verificar la direccion'/>
            </div>
            <div className="mt-6 flex">
              <GreenRoundedButton onClick={nextForm} buttonTitle='Siguiente'/>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };
  

export default OnboardingGeneradorFormStep1;
