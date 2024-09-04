'use client'
import Order from "../../../../../../components/Order";
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../state/userProvider';
import Spinner from "../../../../../../components/Spinner";
import { getUserById } from "../../../../../../api/apiService";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

interface Address {
    street: string;
    city: string;
    number: string;
    province: string;
  }
interface Generator {
    username: string;
    email: string;
    phone: string;
    address: Address;
  }

const monthNames: { [key: number]: string } = {
    1: 'Enero',    // Enero
    2: 'Febrero',  // Febrero
    3: 'Marzo',    // Marzo
    4: 'Abril',    // Abril
    5: 'Mayo',     // Mayo
    6: 'Junio',    // Junio
    7: 'Julio',    // Julio
    8: 'Agosto',   // Agosto
    9: 'Septiembre', // Septiembre
    10: 'Octubre', // Octubre
    11: 'Noviembre', // Noviembre
    12: 'Diciembre'  // Diciembre
};

const OrderDetails = (props: unknown) => {
    const order = {
        request_date: "2024-08-20T12:53:27",
        generator_id: 49,
        coop_id: 50,
        status: "Coordinado",
        waste_type: "Pilas",
        details: "Tocar timbre",
        quantity: 10,
        pickup_date: "2024-09-05T12:53:27",
        zone: "Devoto"
      }
    
    const {user} = useUser(); 
    const [loading, setLoading] = useState(true);
    const [generator, setGenerator] = useState<Generator | null>(null);
    const [isCollapsedItems, setIsCollapsedItems] = useState(false);
    const [isCollapsedObservations, setIsCollapsedObservations] = useState(false);

    const toggleCollapseItems = () => {
        setIsCollapsedItems(!isCollapsedItems);
    };

    const toggleCollapseObservations = () => {
        setIsCollapsedObservations(!isCollapsedObservations);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(order.generator_id);
                setGenerator(response);
                setLoading(false);
            } catch (error) {
                console.log("Error al obtener usuario", error);
            } 
        }
        fetchUser();
    }, [props]);

    console.log(generator)
    const date = new Date(order.pickup_date);
    console.log(date)
    const month : number = date.getMonth() + 1;
    const hour = date.getHours();
    const minutes = date.getMinutes();

    const inserted_date = new Date(order.request_date);
    const month_inserted : number = inserted_date.getMonth() + 1;
    const hour_inserted = inserted_date.getHours();
    const minutes_inserted = inserted_date.getMinutes();


    return (
        <div className="items-center flex justify-center">
            {!loading && (
                        // INICIO CARD
                        <div className="card mx-3 my-4 md:m-3 w-100 px-1 md:px-3 py-1 md:py-3 md:m-5">
                        <div className="row g-0 w-full">
                        <div className="col-md-20">
                        <div className="card-body flex flex-col gap-1">
                                {generator && <h5 className="card-title font-medium text-5xl"> {generator.username}</h5>}
                                {order.status == "Cancelado" ?
                                (<h3 className="card-title font-semibold text-[#ec1a09] text-xl">{order.status.toUpperCase()} </h3>) :
                                (<h3 className="card-title font-semibold text-black text-xl">{order.status.toUpperCase()} </h3>)}
                                <div className="flex flex-row gap-3 text-xl items-center">
                                    <LocalShippingIcon className="ml-1"/>
                                    <p className="card-text"><small className="text-body-secondary">{date.getDate()} de {monthNames[month]} - {hour}:{minutes}</small></p>
                                </div>

                        {/* INICIO PRODUCTOS */}
                        <div className="card my-3 w-88 px-3 shadow-lg rounded-full cursor-pointer" onClick={toggleCollapseItems}>
                        <div className="row g-0 w-full">
                            <div className="col-md-20 ">
                            <div className="card-body flex flex-col gap-1">
                            <div className="flex justify-between items-center md:mx-2">
                                <h3 className="card-title font-medium text-2xl"> Productos </h3>
                                {!isCollapsedItems ? <ExpandMoreIcon className="md:ml-1 text-4xl"/> : <ExpandLessIcon className="md:ml-1 text-4xl"/> }
                            </div>
                            
                            <div className={`${isCollapsedItems ? 'block' : 'hidden'}`}>
                                <div className="flex flex-row gap-3 justify-start mx-2 md:mx-5">
                                    <img src="/box.svg" alt="box" className="w-7" />
                                    <p className="card-text flex gap-3 items-center">
                                        <span className="text-body-secondary font-semibold text-md">{order.waste_type}</span>
                                        <small className="text-body-secondary text-md">{order.quantity} unidades</small>
                                    </p>
                                </div>
                            </div>
                            </div>
                            </div>
                        </div>
                        </div> 
                        {/*  FIN PRODUCTOS */}


                        {/* INICIO OBSERVACIONES */}
                        <div className="card my-3 w-88 px-1 md:px-3 shadow-lg rounded-3xl" onClick={toggleCollapseObservations}>
                        <div className="row g-0 w-full">
                            <div className="col-md-20 ">
                            <div className="card-body flex flex-col gap-1">
                            <div className="flex justify-between items-center md:mx-2 md:my-2">
                                <h3 className="card-title font-medium text-2xl"> Detalles del pedido </h3>
                            </div>
                            
                            <div className="flex flex-row gap-3 justify-start mx-2 md:mx-5">
                                <div className="card-text flex gap-3 flex-col justify-start">
                                    <div className="flex flex-row gap-3 text-xl items-center">
                                        <LocationOnIcon className="ml-1"/>
                                        {generator && <p className="card-text"><small className="text-body-secondary text-md">{generator.address.street} {generator.address.number}, {generator.address.city}, {generator.address.province}</small></p>}
                                    </div>
                                    <div className="flex flex-row gap-3 text-xl items-center">
                                        <AlternateEmailIcon className="ml-1"/>
                                        {generator && <p className="card-text"><small className="text-body-secondary text-md">{generator.email} </small></p>}
                                    </div>
                                    <div className="flex flex-row gap-3 text-xl items-center">
                                        <LocalPhoneIcon className="ml-1"/>
                                        {generator && <p className="card-text"><small className="text-body-secondary text-md">{generator.phone} </small></p>}
                                    </div>
                                    <div className="flex flex-col gap-0 text-lg justify-normal">
                                        <span className="ml-1 font-semibold">Observaciones</span>
                                        <small className="text-body-secondary text-md ml-4">{order.details}</small>
                                    </div>
                                </div>
                            </div>
                            </div>
                            </div>
                        </div>
                        </div> 
                        {/*  FIN OBSERVACIONEs */}

                        {/* FECHA INSERTADO */}
                        <div className="flex flex-row gap-3 text-xl items-center">
                            <p className="card-text"><small className="text-body-secondary text-md">Ingresado el {inserted_date.getDate()} de {monthNames[month_inserted]} - {hour_inserted}:{minutes_inserted}</small></p>
                        </div>

                        </div>
                        </div>
                    </div>
                </div> 
                // FIN CARD
            )}
            {loading && <Spinner/>}
        </div>
    );
};

export default OrderDetails;
