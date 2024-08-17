'use client'
import { useState } from 'react';
import GreenRoundedButton from '@/components/greenRoundedButton';

const OnboardingCooperativaFormStep2 = ({prevStep, nextStep, setRecyclableObjects, recyclableObjects}) => {

  const [items, setItems] = useState(recyclableObjects || [
    { id: 1, label: 'Papel', checked: false },
    { id: 2, label: 'Metal', checked: false },
    { id: 3, label: 'Vidrio', checked: false},
    { id: 4, label: 'Plástico', checked: false },
    { id: 5, label: 'Cartón', checked: false },
    { id: 6, label: 'Tetra Brik', checked: false },
    { id: 7, label: 'Telgopor', checked: false },
    { id: 8, label: 'Pilas', checked: false },
    { id: 9, label: 'Aceite', checked: false },
    { id: 10, label: 'Electrónicos', checked: false },
  ]);

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
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="border border-gray-900/10 rounded-lg p-6">

        <p className="text-sm leading-6 font-bold text-gray-800">Reciclables que reciben</p>

        <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`checkbox-${item.id}`}
              checked={item.checked}
              onChange={() => handleCheckboxChange(item.id)}
              className="form-checkbox rounded-md h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor={`checkbox-${item.id}`} className="text-gray-900">
              {item.label}
            </label>
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 "
            onClick={prevStep}
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
