import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { useState } from 'react';

const ReciclablesSelector = ({
  title='Materiales reciclables',
  items,
  handleCheckboxChange = ()=>{},
  editable=false,
  showEditButton=false,
  onChange=()=>{}
}) => {
  const [showEdit, setEditable] = useState(showEditButton);
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {showEdit && (
          <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            Editar
          </button>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <ul className="space-y-3">
          {items.map(item => (
            <li key={item.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`checkbox-${item.id}`}
                checked={item.checked}
                onChange={() => handleCheckboxChange(item.id)}
                className="form-checkbox rounded-md h-5 w-5 text-cyan-800 border-gray-300 focus:ring-cyan-800"
                disabled={!editable}
              />
              <label htmlFor={`checkbox-${item.id}`} className="text-gray-900">
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

export default ReciclablesSelector;