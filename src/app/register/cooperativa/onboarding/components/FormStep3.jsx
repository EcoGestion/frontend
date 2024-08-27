'use client'
import { useState } from 'react';
import GreenRoundedButton from '@/components/greenRoundedButton';

const OnboardingCooperativaFormStep3 = ({prevStep, nextStep, setAvailableSchedule}) => {
  const [days, setDays] = useState([
    { id: 1, name: 'MONDAY', active: false, begin_at: 0, end_at: 0 },
    { id: 2, name: 'TUESDAY', active: false, begin_at: 0, end_at: 0 },
    { id: 3, name: 'WEDNESDAY', active: false, begin_at: 0, end_at: 0 },
    { id: 4, name: 'THURSDAY', active: false, begin_at: 0, end_at: 0},
    { id: 5, name: 'FRIDAY', active: false, begin_at: 0, end_at: 0 },
    { id: 6, name: 'SATURDAY', active: false, begin_at: 0, end_at: 0 },
    { id: 7, name: 'SUNDAY', active: false, begin_at: 0, end_at: 0 },
  ]);

  const daysToSpanish = {
    'MONDAY': "Lunes",
    'TUESDAY': "Martes",
    'WEDNESDAY': "Miercoles",
    'THURSDAY': "Jueves",
    'FRIDAY': "Viernes",
    'SATURDAY': "Sábado",
    'SUNDAY': "Domingo"
  }

  const toggleDay = (id) => {
    setDays(days.map(day => 
      day.id === id ? { ...day, active: !day.active } : day
    ));
  };

  const handleTimeChange = (id, field, value) => {
    const date = new Date();
    // Hay que reemplazar el Date.now() con el value cuando se cambie el backend
    setDays(days.map(day =>
      day.id === id ? { ...day, [field]: date.toISOString() } : day
    ));
  };

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30',
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];


  const nextForm = () => {
    setAvailableSchedule(days)
    nextStep();
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="border border-gray-900/10 rounded-lg p-6">

        <p className="text-sm leading-6 font-bold text-gray-800">Disponibilidad horaria</p>

        <ul className="space-y-4">
        {days.map(day => (
          <li key={day.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-2xl mx-auto">
            <button 
              onClick={() => toggleDay(day.id)} 
              className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${day.active ? 'bg-cyan-800' : 'bg-gray-300'}`}

            >
              <div 
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${day.active ? 'translate-x-4' : ''}`}
              ></div>
            </button>
            <span className={`text-lg mx-2 ${day.active ? 'text-cyan-800' : 'text-gray-600'}`}>
              {daysToSpanish[day.name]}
            </span>
            <div className="flex space-x-2">
              <select
                value={day.begin_at}
                onChange={(e) => handleTimeChange(day.id, 'begin_at', e.target.value)}
                disabled={!day.active}
                className={`text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 ${day.active ? 'focus:ring-cyan-800' : 'focus:ring-gray-600'} ${!day.active ? 'opacity-50 cursor-not-allowed' : ''}`}

              >
                <option value="" disabled>Desde</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <select
                value={day.end_at}
                onChange={(e) => handleTimeChange(day.id, 'end_at', e.target.value)}
                disabled={!day.active}
                className={`text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 ${!day.active ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="" disabled>Hasta</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
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

export default OnboardingCooperativaFormStep3;