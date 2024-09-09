'use client'
import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardBody, Divider, Button, Textarea,
  DatePicker, TimeInput, Checkbox, CheckboxGroup, Accordion, AccordionItem,
  CardFooter, DateValue
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from '@/state/store';
import {now, getLocalTimeZone, parseDate, Time} from "@internationalized/date";
import dynamic from 'next/dynamic'
import GreenRoundedButton from "@/components/greenRoundedButton";
import { getUserById, createRequest } from "@/api/apiService";
import { UserInfo } from '@/types';
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

// Dynamic import to avoid Window not defined error
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const CreacionPedido = () => {
  const router = useRouter();
  const current_date = new Date();
  const userSession = useSelector((state: RootState) => state.userSession);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [request_from, setRequestFrom] = useState(now("America/Argentina/Buenos_Aires"));
  const [request_to, setRequestTo] = useState(now("America/Argentina/Buenos_Aires"));
  const [selectedRecyclables, setSelectedRecyclables] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState("");

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
        const response = await getUserById(userSession.userId);
        setUserInfo(response);
    } catch (error) {
        console.error('Error retrieving user data:', error);
    } finally {
        setLoading(false);
    }
  };

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

  const handleRequestDateChange = (date: DateValue) => {
    const { year, month, day } = date;
    const updated_from = request_from.set({ year, month, day });
    const updated_to = request_to.set({ year, month, day });
    setRequestFrom(updated_from);
    setRequestTo(updated_to);
  };

  const handleRequestTimeChangeFrom = (time : Time) => {
      const {hour, minute, second, millisecond} = time;
      const updated_from = request_from.set({hour, minute, second, millisecond});
      setRequestFrom(updated_from);
  }

  const handleRequestTimeChangeTo = (time : Time) => {
    const {hour, minute, second, millisecond} = time;
    const updated_to = request_to.set({hour, minute, second, millisecond});
    setRequestTo(updated_to);
  }

  const handleQuantityChange = (name: string, quantity: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [name]: quantity
    }));
    setItems(prevItems => prevItems.map(item => {
      if (item.name === name) {
        return {
          ...item,
          quantity
        };
      }
      return item;
    }));
  };

  // TODO: Cambiar fecha a request_from, reqeuqest_to, y la de hoy
  // TODO: Cambiar a multiples materiales
  // TODO: No se debe mandar id de cooperativa
  const handleConfirm = () => {
    const body = {
      request_date: request_from.toDate(),
      generator_id: userSession.userId,
      waste_type: selectedRecyclables[0],
      details: comments,
      quantity: quantities[selectedRecyclables[0]],
      pickup_date: request_to.toDate(),
      zone: "",
      status: "OPEN",
      coop_id: 41
    };
    console.log(body);
    setLoading(true);
    try {
      const response = createRequest(body);
      router.push('/home/generador/pedidos');
    } catch (error) {
      console.error('Error creating request', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-2xl font-semibold pb-3">Solicita la recolección de tus reciclables</h1>
      {loading ? (
        <Spinner />
      ) : (
    <Card className="max-w-lg w-full mx-auto p-4">
      <Accordion variant="bordered" className="">
        <AccordionItem title="Fecha de recolección">
          <Card className="md:col-span-1">
            <CardHeader>
              <DatePicker
                label="Fecha de recolección"
                variant="bordered"
                description="Seleccione la fecha de solicitud de recolección"
                value={parseDate(request_from.toString().substring(0, 10))}
                showMonthAndYearPickers
                onChange={(date) => handleRequestDateChange(date)}
              />
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <TimeInput
                label="Desde"
                variant="bordered"
                placeholderValue={new Time(10,0)}
                value={(new Time(request_from.hour, request_from.minute))}
                onChange={(time) => handleRequestTimeChangeFrom(time)}
              />
              <TimeInput
                label="Hasta"
                variant="bordered"
                placeholderValue={new Time(12,0)}
                value={new Time(request_to.hour, request_to.minute)}
                onChange={(time) => handleRequestTimeChangeTo(time)}
              />
              </div>
            </CardBody>
          </Card>
        </AccordionItem>

        <AccordionItem title="Detalles del pedido">
          <Card className="md:col-span-1">
            <CardHeader>
              <Divider />
            </CardHeader>
            <CardBody>
              <CheckboxGroup label="Selecciona materiales" defaultValue={selectedRecyclables} onValueChange={setSelectedRecyclables}>
                <p>Las unidades que se detallan a continuacion son expresadas en kilogramos</p>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Checkbox value={item.name}>
                      {item.label}
                    </Checkbox>
                    <input 
                      type="number" 
                      min="0" 
                      defaultValue={item.quantity}
                      style={{ 
                        marginLeft: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc', 
                        padding: '5px', 
                        width: '60px' 
                      }} 
                      aria-label={`Cantidad de ${item.label}`} 
                      onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value))}
                    />
                  </div>
                ))}
              </CheckboxGroup>
            </CardBody>
          </Card>
        </AccordionItem>

        <AccordionItem title="Ubicación">
          <Card className="md:col-span-1">
            <CardHeader className="flex-col">
              <h2 className="text-lg font-semibold">Por favor confirma si esta es tu dirección</h2>
              <p> En caso de error dirigete a tu perfil para indicar la dirección correcta</p>
            </CardHeader>
            <Divider />
            <CardBody>
              {/* TODO: Cambiar a la direccion del usuario */}
              <MapView centerCoordinates={[-34.5814551, -58.4211107]}/>
            </CardBody>
          </Card>
        </AccordionItem>

        <AccordionItem title="Comentarios">
          <Card className="md:col-span-1">
            <CardHeader>
              <h2 className="text-lg font-semibold">Agregue indicaciones adicionales</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <Textarea
                placeholder="Escribe aquí cualquier comentario adicional que desee indicar a la cooperativa"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </CardBody>
          </Card>
        </AccordionItem>
        
      </Accordion>
      <Divider />

      <CardFooter className="flex justify-center">
        <GreenRoundedButton
          onClick={handleConfirm}
          buttonTitle="Confirmar"
        />
      </CardFooter>
    </Card>
    )}
  </div>
  );
};

export default CreacionPedido;