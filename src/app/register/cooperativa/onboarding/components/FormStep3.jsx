'use client'
import { useState } from 'react';
import { Card } from '@nextui-org/react';
import TimeSelector from '@/components/TimeSelector';
import GreenRoundedButton from '@/components/greenRoundedButton';
import { timeOptions, daysOptions } from '@constants/dateAndTime';

const OnboardingCooperativaFormStep3 = ({prevStep, nextStep, setAvailableSchedule, availableSchedule}) => {
  const [days, setDays] = useState(availableSchedule || daysOptions);

  const toggleDay = (id) => {
    setDays(days.map(day => 
      day.id === id ? { ...day, active: !day.active } : day
    ));
  };

  const handleTimeChange = (id, field, value) => {
    setDays(days.map(day =>
      day.id === id ? { ...day, [field]: value } : day
    ));
  };

  const nextForm = () => {
    setAvailableSchedule(days);
    nextStep();
  };

  const prevForm = () => {
    setAvailableSchedule(days);
    prevStep();
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white w-full">
      <div className="border border-gray-900/10 rounded-lg p-6 shadow-md w-full max-w-2xl ">
        <p className="text-sm leading-6 font-bold text-gray-800">Disponibilidad horaria</p>

        <TimeSelector
          days={days}
          handleTimeChange={handleTimeChange}
          editable
          toggleDay={toggleDay}
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

export default OnboardingCooperativaFormStep3;
