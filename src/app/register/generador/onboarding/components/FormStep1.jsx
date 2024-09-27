'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GreenRoundedButton from '@/components/greenRoundedButton';
import dynamic from 'next/dynamic';
import geocodeAddress from '@/utils/geocodeAddress';
import { Card, CardHeader, CardBody, Divider, CardFooter } from '@nextui-org/react';
import {Select, SelectItem} from "@nextui-org/react";
import BlueRoundedButton from '@/components/blueRoundedButton';
import barrios from '@/constants/zones';

// Dynamic import to avoid Window not defined error
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const OnboardingGeneradorFormStep1 = ({ nextStep, address, setAddress }) => {
    const [street, setStreet] = useState(address.street);
    const [number, setNumber] = useState(address.number);
    const [zone, setZone] = useState(address.zone);
    const [city, setCity] = useState(address.city);
    const [province, setProvince] = useState(address.province);
    const [postalCode, setPostalCode] = useState(address.zip_code);
    const [coordinates, setCoordinates] = useState(null);
    const [markers, setMarkers] = useState([]);

    const updateCoordinates = async () => {
      const addressObj = {
        street: street,
        number: number,
        city: city,
        zip_code: postalCode,
        province: province,
        country: 'Argentina'
      };
      const addressCoordinates = await geocodeAddress(addressObj);
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
      const address = {
        street: street,
        number: number,
        zone: zone,
        city: city,
        province: province,
        zip_code: postalCode,
        lat: coordinates ? coordinates[0].toString() : "0",
        lng: coordinates ? coordinates[1].toString() : "0"
      }
      setAddress(address);
      nextStep();
    }

    useEffect(() => {
      // Update the MapView with the new coordinates
    }, [coordinates]);

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white overflow-auto">
        <Card className="border border-gray-900/10 rounded-lg p-6 top-4">
          <CardHeader className="text-base font-semibold leading-7 text-gray-900">
            Información de la organización
          </CardHeader>
          <CardBody className="mt-1 text-sm leading-6 text-gray-600">
            <p>A continuación te pediremos información sobre tu organización.</p>
            <p>Estos datos nos servirán para validar el perfil y para que puedas</p>
            <p>coordinar recolecciones con las cooperativas.</p>
          </CardBody>
  
          <Divider className="mt-2 border-t border-gray-900/10" />
  
          <CardBody>
            <p className="mt-2 text-sm leading-6 font-bold text-gray-800">Dirección</p>
  
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                  Calle
                </label>
                <div className="mt-2">
                  <input
                    id="calle"
                    name="street-address"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={street}
                    required
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
              </div>
  
              <div className="sm:col-span-2">
                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                  Altura
                </label>
                <div className="mt-2">
                  <input
                    id="altura"
                    name="street-address"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={number}
                    required
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
              <label htmlFor="barrio" className="block text-sm font-medium leading-6 text-gray-900">
                Barrio
              </label>
              <div className="mt-2">
                <Select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Seleccione un barrio"
                >
                  {barrios.map((barrio) => (
                    <SelectItem key={barrio} value={barrio}>
                      {barrio}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
  
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                  Ciudad
                </label>
                <div className="mt-2">
                  <input
                    id="ciudad"
                    name="ciudad"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
  
              <div className="sm:col-span-2">
                <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                  Provincia
                </label>
                <div className="mt-2">
                  <input
                    id="provincia"
                    name="provincia"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={province}
                    required
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
              </div>
  
              <div className="sm:col-span-2">
                <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                  Codigo Postal
                </label>
                <div className="mt-2">
                  <input
                    id="codigoPostal"
                    name="codigoPostal"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardBody>
          <Divider />
          <CardBody>
            <p className="mt-2 text-sm leading-6 font-bold text-gray-800">Ubicación de la organización</p>
            <MapView
              centerCoordinates={coordinates}
              markers={markers}
              zoom={coordinates ? 15 : 13}
            />
          </CardBody>
          <Divider />
          <CardFooter className='mt-2 justify-center gap-6'>
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
