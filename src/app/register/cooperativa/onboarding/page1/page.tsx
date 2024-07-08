'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setUserAddress } from '@/state/userAddressSlice';
import GreenRoundedButton from '@/components/greenRoundedButton';

const onboardingCooperativa = () => {
  const userAddress = useSelector((state: RootState) => state.userAddress);
  const dispatch = useDispatch();

  const [calle, setCalle] = useState(userAddress.calle);
  const [altura, setAltura] = useState(userAddress.altura);
  const [ciudad, setCiudad] = useState(userAddress.ciudad);
  const [provincia, setProvincia] = useState(userAddress.provincia);
  const [codigoPostal, setCodigoPostal] = useState(userAddress.codigoPostal);

  const router = useRouter();

  const nextPage = () => {
    dispatch(setUserAddress({ calle, altura, ciudad, provincia, codigoPostal }));
    router.push('/register/cooperativa/onboarding/page2');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="border border-gray-900/10 rounded-lg p-6">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Información de la cooperativa</h2>
        <div className="mt-1 text-sm leading-6 text-gray-600">
          <p>A continuación te pediremos información sobre la cooperativa a la que representas.</p>
          <p>Estos datos nos servirán para validar el perfil y para que los usuarios Generadores</p>
          <p>puedan conectar con tu Cooperativa en el momento de solicitar recolecciones.</p>
        </div>

        <hr className="mt-6 border-t border-gray-900/10" />

        <p className="mt-6 text-sm leading-6 font-bold text-gray-800">Dirección de la cooperativa</p>

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
                value={calle}
                onChange={(e) => setCalle(e.target.value)}
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
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
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
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
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
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
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
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end">
            <GreenRoundedButton onClick={nextPage} buttonTitle='Siguiente'/>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default onboardingCooperativa;
