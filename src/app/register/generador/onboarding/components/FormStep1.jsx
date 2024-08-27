'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GreenRoundedButton from '@/components/greenRoundedButton';

const OnboardingGeneradorFormStep1 = ({ nextStep, address, setAddress }) => {
    const [street, setStreet] = useState(address.street);
    const [number, setNumber] = useState(address.number);
    const [city, setCity] = useState(address.city);
    const [province, setProvince] = useState(address.province);
    const [postalCode, setPostalCode] = useState(address.postalCode);
  
    const nextForm = () => {
      const address = {
        street: street,
        number: number,
        city: city,
        province: province,
        postalCode: postalCode
      }
      setAddress(address)
      nextStep();
    }
  
    const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="border border-gray-900/10 rounded-lg p-6">
      <h2 className="text-base font-semibold leading-7 text-gray-900">Información de la organización</h2>
        <div className="mt-1 text-sm leading-6 text-gray-600">
          <p>A continuación te pediremos información sobre tu organización.</p>
          <p>Estos datos nos servirán para validar el perfil y para que puedas</p>
          <p>coordinar recolecciones con las cooperativas.</p>
        </div>

        <hr className="mt-6 border-t border-gray-900/10" />

        <p className="mt-6 text-sm leading-6 font-bold text-gray-800">Dirección</p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
            <div className="mt-6 flex justify-end">
            <GreenRoundedButton onClick={nextForm} buttonTitle='Siguiente'/>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default OnboardingGeneradorFormStep1;
