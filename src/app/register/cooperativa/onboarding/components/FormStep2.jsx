'use client'
import { useState } from 'react';
import GreenRoundedButton from '@/components/greenRoundedButton';
import ReciclablesSelector from '@/components/ReciclablesSelector';
import materialsDefault from '@/constants/recyclables';

const OnboardingCooperativaFormStep2 = ({prevStep, nextStep, setRecyclableObjects, recyclableObjects}) => {

  const [items, setItems] = useState(recyclableObjects || materialsDefault);

  const handleCheckboxChange = (id) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const nextForm = () => {
    setRecyclableObjects(items)
    nextStep();
  };

  const prevForm = () => {
    setRecyclableObjects(items)
    prevStep();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="border border-gray-900/10 rounded-lg p-6">

        <p className="text-sm leading-6 font-bold text-gray-800">Reciclables que reciben</p>

        <ReciclablesSelector
          items={items}
          handleCheckboxChange={handleCheckboxChange}
          editable={true}
        />

      <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="bg-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 "
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

export default OnboardingCooperativaFormStep2;
