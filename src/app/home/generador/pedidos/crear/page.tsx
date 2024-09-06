'use client'
import React, { useState } from "react";
import {
  Card, CardHeader, CardBody, Divider, Input, Button, Textarea,
  DatePicker, Select, SelectItem, TimeInput, Checkbox, CheckboxGroup, Accordion, AccordionItem
} from "@nextui-org/react";
import {now, getLocalTimeZone, ZonedDateTime, Time} from "@internationalized/date";


const CreacionPedido = () => {
  const [requestDate, setRequestDate] = useState(new Date());
  const [selectedRecyclables, setSelectedRecyclables] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [address, setAddress] = useState("");
  const [comments, setComments] = useState("");

  const [items, setItems] = useState([
    { id: 1, label: 'Papel', name:'PAPER', checked: false, quantity: 0 },
    { id: 2, label: 'Metal', name:'METAL', checked: false, quantity: 0 },
    { id: 3, label: 'Vidrio', name:'GLASS', checked: false, quantity: 0 },
    { id: 4, label: 'Plástico', name:'PLASTIC', checked: false, quantity: 0 },
    { id: 5, label: 'Cartón', name:'CARDBOARD', checked: false, quantity: 0 },
    { id: 6, label: 'Tetra Brik', name:'TETRA_BRIK', checked: false, quantity: 0 },
    { id: 7, label: 'Telgopor', name:'STYROFOAM', checked: false, quantity: 0 },
    { id: 8, label: 'Pilas', name:'BATTERIES', checked: false, quantity: 0 },
    { id: 9, label: 'Aceite', name:'OIL', checked: false, quantity: 0 },
    { id: 10, label: 'Electrónicos', name:'ELECTRONICS', checked: false, quantity: 0 },
  ]);

  const handleRequestDateChange = (date : ZonedDateTime ) => {
      console.log(date.toDate());
  };

  return (
    <Card className="max-w-lg w-full mx-auto p-4">
      <Accordion variant="bordered" className="">
        <AccordionItem title="Fecha de recolección">
          <Card className="md:col-span-1">
            <CardHeader>
              <DatePicker
                label="Fecha de recolección"
                variant="bordered"
                description="Seleccione la fecha de solicitud de recolección"
                hideTimeZone
                showMonthAndYearPickers
                defaultValue={now(getLocalTimeZone())}
                onChange={handleRequestDateChange}
              />
            </CardHeader>
          </Card>
        </AccordionItem>

        <AccordionItem title="Detalles del pedido">
          <Card className="md:col-span-1">
            <CardHeader>
              <Divider />
            </CardHeader>
            <CardBody>
              <CheckboxGroup label="Selecciona materiales">
                <p>Las unidades que se detallan a continuacion son expresadas en kilogramos</p>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Checkbox value={item.name}>
                      {item.label}
                    </Checkbox>
                    <input 
                      type="number" 
                      min="0" 
                      defaultValue="0" 
                      style={{ 
                        marginLeft: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc', 
                        padding: '5px', 
                        width: '60px' 
                      }} 
                      aria-label={`Cantidad de ${item.label}`} 
                    />
                  </div>
                ))}
              </CheckboxGroup>
            </CardBody>
          </Card>
        </AccordionItem>

        
      </Accordion>
    </Card>
  );
};

export default CreacionPedido;