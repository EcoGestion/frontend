'use client'
import { useState } from 'react';
import GreenRoundedButton from '@/components/greenRoundedButton';

const OnboardingGeneradorFormStep2 = ({prevStep, nextStep, organizationType, setOrganizationType}) => {

  const [orgType, setOrgType] = useState(organizationType);

  const options = [
    { value: "1", label: "Consorcios de edificios" },
    { value: "2", label: "Oficinas y edificios corporativos" },
    { value: "3", label: "Hoteles" },
    { value: "4", label: "Restaurantes" },
    { value: "5", label: "Supermercados" },
    { value: "6", label: "Empresas" },
    { value: "7", label: "Clubes" },
    { value: "8", label: "Hospitales y clinicas" },
    { value: "9", label: "Instituciones educativas" },
    { value: "10", label: "Fabricas y plantas de producción" },
    { value: "11", label: "Otros" }
  ];

  const nextForm = () => {
    setOrganizationType(orgType);
    nextStep();
  };

  const prevForm = () => {
    setOrganizationType(orgType);
    prevStep();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="border border-gray-900/10 rounded-lg p-6">

        <p className="text-sm leading-6 font-bold text-gray-800">Tipo de organización</p>

        <select
          className="w-full mt-2 p-2 pr-8 rounded-lg border border-gray-300 appearance-none"
          value={orgType}
          onChange={(e) => setOrgType(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 "
            onClick={prevForm}
          >
            Volver
          </button>
          <GreenRoundedButton
            buttonTitle='Siguiente'
            onClick={nextForm}
            />
        </div>
      </div>
    </div>
  );
};

export default OnboardingGeneradorFormStep2;
