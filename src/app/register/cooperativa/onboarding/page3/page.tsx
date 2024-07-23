'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setHorariosCooperativa } from '@/state/horariosCooperativaSlice';
import GreenRoundedButton from '@/components/greenRoundedButton';

const onboardingCooperativa = () => {
  // ToDo: Enviar datos al backend
  const horariosCooperativa = useSelector((state: RootState) => state.horariosCooperativa);
  const dispatch = useDispatch();

  const router = useRouter();

  const [days, setDays] = useState([
    { id: 1, name: 'Lunes', active: horariosCooperativa.lunes.active, from: horariosCooperativa.lunes.from, to: horariosCooperativa.lunes.to },
    { id: 2, name: 'Martes', active: horariosCooperativa.martes.active, from: horariosCooperativa.martes.from, to: horariosCooperativa.martes.to },
    { id: 3, name: 'Miércoles', active: horariosCooperativa.miercoles.active, from: horariosCooperativa.miercoles.from, to: horariosCooperativa.miercoles.to },
    { id: 4, name: 'Jueves', active: horariosCooperativa.jueves.active, from: horariosCooperativa.jueves.from, to: horariosCooperativa.jueves.to },
    { id: 5, name: 'Viernes', active: horariosCooperativa.viernes.active, from: horariosCooperativa.viernes.from, to: horariosCooperativa.viernes.to },
    { id: 6, name: 'Sábado', active: horariosCooperativa.sabado.active, from: horariosCooperativa.sabado.from, to: horariosCooperativa.sabado.to },
    { id: 7, name: 'Domingo', active: horariosCooperativa.domingo.active, from: horariosCooperativa.domingo.from, to: horariosCooperativa.domingo.to },
  ]);

  const toggleDay = (id : number) => {
    setDays(days.map(day => 
      day.id === id ? { ...day, active: !day.active } : day
    ));
  };

  const handleTimeChange = (id:number, field: 'from'|'to', value:string) => {
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


  const handle_next = () => {
    dispatch(setHorariosCooperativa({
      lunes: { active: days[0].active, from: days[0].from, to: days[0].to },
      martes: { active: days[1].active, from: days[1].from, to: days[1].to },
      miercoles: { active: days[2].active, from: days[2].from, to: days[2].to },
      jueves: { active: days[3].active, from: days[3].from, to: days[3].to },
      viernes: { active: days[4].active, from: days[4].from, to: days[4].to },
      sabado: { active: days[5].active, from: days[5].from, to: days[5].to },
      domingo: { active: days[6].active, from: days[6].from, to: days[6].to },
    }));
    // Enviar a home page
  }

  const handle_back = () => {
    dispatch(setHorariosCooperativa({
      lunes: { active: days[0].active, from: days[0].from, to: days[0].to },
      martes: { active: days[1].active, from: days[1].from, to: days[1].to },
      miercoles: { active: days[2].active, from: days[2].from, to: days[2].to },
      jueves: { active: days[3].active, from: days[3].from, to: days[3].to },
      viernes: { active: days[4].active, from: days[4].from, to: days[4].to },
      sabado: { active: days[5].active, from: days[5].from, to: days[5].to },
      domingo: { active: days[6].active, from: days[6].from, to: days[6].to },
    }));
    router.back();
  };

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
              {day.name}
            </span>
            <div className="flex space-x-2">
              <select
                value={day.from}
                onChange={(e) => handleTimeChange(day.id, 'from', e.target.value)}
                disabled={!day.active}
                className={`text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 ${day.active ? 'focus:ring-cyan-800' : 'focus:ring-gray-600'} ${!day.active ? 'opacity-50 cursor-not-allowed' : ''}`}

              >
                <option value="" disabled>Desde</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <select
                value={day.to}
                onChange={(e) => handleTimeChange(day.id, 'to', e.target.value)}
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
            onClick={handle_back}
          >
            Volver
          </button>
          <GreenRoundedButton
            buttonTitle='Siguiente'
            onClick={handle_next}
            />
        </div>
      </div>
    </div>
  );
};

export default onboardingCooperativa;
