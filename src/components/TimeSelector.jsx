import React from 'react';
import { Card } from '@nextui-org/react';

const TimeSelector = ({ days, handleTimeChange, editable, toggleDay }) => {
  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30',
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  return (
    <Card>
    <div className="max-h-96 overflow-y-auto">
      <ul className="space-y-4">
        {days.map(day => (
          <li key={day.id} className="flex flex-wrap items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-2xl mx-auto">
            <button 
              onClick={() => toggleDay(day.id)} 
              className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${day.active ? 'bg-cyan-800' : 'bg-gray-light'}`}
            >
              <div 
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${day.active ? 'translate-x-4' : ''}`}
              ></div>
            </button>
            <span className={`text-lg mx-2 ${day.active ? 'text-cyan-800' : 'text-gray-600'}`}>
              {day.name_spanish}
            </span>
            <div className="flex space-x-2">
              <select
                value={day.from}
                onChange={(e) => handleTimeChange(day.id, 'from', e.target.value)}
                disabled={!day.active || !editable}
                className={`text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 ${day.active ? 'focus:ring-cyan-800' : 'focus:ring-gray-600'} ${!day.active || !editable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="" disabled>Desde</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <select
                value={day.to}
                onChange={(e) => handleTimeChange(day.id, 'to', e.target.value)}
                disabled={!day.active || !editable}
                className={`text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 ${!day.active || !editable ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    </div>
    </Card>
  );
};

export default TimeSelector;