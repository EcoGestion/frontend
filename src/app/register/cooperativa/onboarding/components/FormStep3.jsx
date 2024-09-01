'use client'
import { useState } from 'react';
import { Card } from '@nextui-org/react';
import TimeSelector from '@/components/TimeSelector';
import GreenRoundedButton from '@/components/greenRoundedButton';

const OnboardingCooperativaFormStep3 = ({prevStep, nextStep, setAvailableSchedule, availableSchedule}) => {
  const [days, setDays] = useState(availableSchedule || [
    { id: 1, name: 'MONDAY', name_spanish: 'Lunes', active: false, begin_at: "00:00", end_at: "00:00" },
    { id: 2, name: 'TUESDAY', name_spanish: 'Martes', active: false, begin_at: "00:00", end_at: "00:00" },
    { id: 3, name: 'WEDNESDAY', name_spanish: 'Miercoles', active: false, begin_at: "00:00", end_at: "00:00" },
    { id: 4, name: 'THURSDAY', name_spanish: 'Jueves', active: false, begin_at: "00:00", end_at: "00:00" },
    { id: 5, name: 'FRIDAY', name_spanish: 'Viernes', active: false, begin_at: "00:00", end_at: "00:00" },
    { id: 6, name: 'SATURDAY', name_spanish: 'Sábado', active: false, begin_at: "00:00", end_at: "00:00" },
    { id: 7, name: 'SUNDAY', name_spanish: 'Domingo', active: false, begin_at: "00:00", end_at: "00:00" }
  ]);

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

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30',
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];


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
