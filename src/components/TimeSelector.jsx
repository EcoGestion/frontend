import React from 'react';
import { useState } from 'react';
import { Card, CardHeader, Divider } from '@nextui-org/react';
import { timeOptions } from '@/constants/dateAndTime';

const TimeSelector = ({
  title='Horarios disponibles',
  days,
  handleTimeChange = () => {},
  editable = false,
  toggleDay= () => {},
  showEditButton=false
}) => {
  const [showEdit, setEditable] = useState(showEditButton);

  return (
    <Card className="w-full">
    <div className="max-h-96 overflow-y-auto">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {showEdit && (
          <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            Editar
          </button>
        )}
      </CardHeader>
      
      <Divider />
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
                value={day.begin_at}
                onChange={(e) => handleTimeChange(day.id, 'begin_at', e.target.value)}
                disabled={!day.active || !editable}
                className={`text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 ${day.active ? 'focus:ring-cyan-800' : 'focus:ring-gray-600'} ${!day.active || !editable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="" disabled>Desde</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <select
                value={day.end_at}
                onChange={(e) => handleTimeChange(day.id, 'end_at', e.target.value)}
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