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
import materialsDefault from "@/constants/recyclables";

// Dynamic import to avoid Window not defined error
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface Marker {
  position: number[];
  content: string;
  popUp: string;
}

const CreacionPedido = () => {
  const router = useRouter();
  const current_date = new Date();
  const userSession = useSelector((state: RootState) => state.userSession);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [request_from, setRequestFrom] = useState(now("America/Argentina/Buenos_Aires"));
  const [request_to, setRequestTo] = useState(now("America/Argentina/Buenos_Aires"));
  const [selectedRecyclables, setSelectedRecyclables] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ waste_type: string, quantity: number }[]>([]);
  const [comments, setComments] = useState("");

  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(undefined);
  const [markers, setMarkers] = useState<Marker[]>([]);

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

  useEffect(() => {
    retrieveData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const { lat, lng } = userInfo.address;
      setCoordinates([parseFloat(lat), parseFloat(lng)]);
      
      setMarkers([
        {
          position: [parseFloat(lat), parseFloat(lng)],
          content: 'Tu ubicación',
          popUp: 'Aquí se realizará la recolección de tus reciclables'
        }
      ]);

    }
  }, [userInfo]);

  const [items, setItems] = useState(materialsDefault);

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

  const handleQuantityChange = (waste_type: string, quantity: number) => {
    setQuantities((prevQuantities) => {
      const existingIndex = prevQuantities.findIndex(item => item.waste_type === waste_type);
  
      if (existingIndex !== -1) {
        const updatedQuantities = [...prevQuantities];
        updatedQuantities[existingIndex].quantity = quantity;
        return updatedQuantities;
      } else {
        return [...prevQuantities, { waste_type, quantity }];
      }
    });
  };

  const handleConfirm = () => {
    const body = {
      request_date: now(getLocalTimeZone()).toDate(),
      generator_id: userSession.userId,
      details: comments,
      waste_quantities:quantities,
      pickup_date_from: request_from.toDate(),
      pickup_date_to: request_to.toDate(),
      zone: "",
      status: "OPEN",
    };
    console.log(body);
    setLoading(true);
    try {
      const response = createRequest(body);
      router.push('/home/generador/pedidos');
    } catch (error) {
      console.error('Error creating request', error);
      alert('Error al crear el pedido. Por favor intente nuevamente.');
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
      <Accordion key='datetime' variant="bordered" className="">
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

        <AccordionItem key='details' title="Detalles del pedido">
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

        <AccordionItem key='location' title="Ubicación">
          <Card className="md:col-span-1">
            <CardHeader className="flex-col">
              <h2 className="text-lg font-semibold">Por favor confirma si esta es tu dirección</h2>
              <p> En caso de error dirigete a tu perfil para indicar la dirección correcta</p>
            </CardHeader>
            <Divider />
            <CardBody>
              {/* TODO: Cambiar a la direccion del usuario */}
              <MapView centerCoordinates={coordinates} zoom={15} markers={markers} />
            </CardBody>
          </Card>
        </AccordionItem>

        <AccordionItem key='comments' title="Comentarios">
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