'use client'
import { useState } from 'react';
import GreenRoundedButton from '@/components/greenRoundedButton';

const OnboardingGeneradorFormStep2 = ({prevStep, nextStep, organizationType, setOrganizationType}) => {

  const [orgType, setOrgType] = useState(organizationType);

  const options = [
    { value: "GEN_BUILDING", label: "Consorcios de edificios" },
    { value: "GEN_OFFICE", label: "Oficinas y edificios corporativos" },
    { value: "GEN_HOTEL", label: "Hoteles" },
    { value: "GEN_RESTAURANT", label: "Restaurantes" },
    { value: "GEN_MARKET", label: "Supermercados" },
    { value: "GEN_COMPANY", label: "Empresas" },
    { value: "GEN_CLUB", label: "Clubes" },
    { value: "GEN_HOSPITAL", label: "Hospitales y clinicas" },
    { value: "GEN_EDUCATIONAL_INSTITUTION", label: "Instituciones educativas" },
    { value: "GEN_FACTORY", label: "Fabricas y plantas de producción" },
    { value: "GEN_OTHER", label: "Otros" }
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
