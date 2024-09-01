import { Card, CardBody } from '@nextui-org/react';

const ReciclablesSelector = ({ items, handleCheckboxChange, editable }) => {
  return (
    <Card>
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