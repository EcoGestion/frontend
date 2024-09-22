'use client'
import Order from "../../../../../../components/Order";
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../state/userProvider';
import Spinner from "../../../../../../components/Spinner";
import { getOrderById, getUserById } from "../../../../../../api/apiService";
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
    zone: string;
  }

interface WasteQuantities {
waste_type: string;
quantity: string;
}

interface Order {
    request_date: string;
    generator_id: string;
    status: string;
    pickup_date_from: string;
    zone: string;
    id: number;
    coop_id: number;
    details: string;
    pickup_date_to: string;
    generator: Generator;
    coop: Generator;
    waste_quantities: [WasteQuantities];
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

const getStatus = (status : any) => {
    switch (status) {
        case 'CANCELED':
            return 'Cancelada';

        case 'COMPLETED':
            return 'Completada';

        case 'OPEN':
            return 'Ingresada';

        case 'Coordinada':
            return 'Coordinada';
    }
}

const formatDate = (value : any) => {
    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
    };

    const dateString = value.toLocaleDateString('en-GB', dateOptions);
    const timeString = value.toLocaleTimeString('en-GB', timeOptions);

    return `${dateString} ${timeString}`;
};

const OrderDetails = (props: {params?: { id?: string } }) => {
    const {user} = useUser();
    const orderId = props.params?.id
    
    const [loading, setLoading] = useState(true);
    const [generator, setGenerator] = useState<Generator | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
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
                const responseOrder = await getOrderById(orderId);
                const responseGenerator = await getUserById(responseOrder.generator_id);
                setOrder(responseOrder);
                setGenerator(responseGenerator);
                setLoading(false);
            } catch (error) {
                console.log("Error al obtener usuario", error);
            } 
        }
        fetchUser();
    }, [props]);

    const date_from =  order? formatDate(new Date(order.pickup_date_from)): null;

    const date_to =  order? formatDate(new Date(order.pickup_date_to)): null;

    const inserted_date =  order? formatDate(new Date(order.request_date)): null;

    const status : any = order? getStatus(order.status): null;

    const products = order && order.waste_quantities ? order.waste_quantities : [
        {
            waste_type: "Pilas",
            quantity: 50
        },
        {
            waste_type: "Plástico",
            quantity: 50
        }
    ]


    return (
        <div className="items-center flex justify-center">
            {!loading && order && date_from && date_to && inserted_date && status && (
                        // INICIO CARD
                        <div className="card mx-3 my-4 md:m-3 w-100 px-1 md:px-3 py-1 md:py-3 md:m-5">
                        <div className="row g-0 w-full">
                        <div className="col-md-20">
                        <div className="card-body flex flex-col gap-1">
                                {generator && <h5 className="card-title font-medium text-5xl"> {generator.username}</h5>}
                                {status == "Cancelado" ?
                                (<h3 className="card-title font-semibold text-[#ec1a09] text-xl">{status.toUpperCase()} </h3>) :
                                (<h3 className="card-title font-semibold text-black text-xl">{status.toUpperCase()} </h3>)}
                                <div className="flex flex-row gap-3 text-xl items-center">
                                    <LocalShippingIcon className="ml-1"/>
                                    <div className="flex flex-col">
                                    <p className="card-text"><small className="text-body-secondary">{date_from} - {date_to}</small></p>
                                    </div>
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
                                {
                                products.map(product => 
                                    (
                                        <div className="flex flex-row gap-3 justify-start mx-2 md:mx-5">
                                        <img src="/box.svg" alt="box" className="w-7" />
                                        <p className="card-text flex gap-3 items-center">
                                            <span className="text-body-secondary font-semibold text-md">{product.waste_type}</span>
                                            <small className="text-body-secondary text-md">{product.quantity} unidades</small>
                                        </p>
                                        </div>

                                    )
                                )}
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
                                        {generator && <p className="card-text"><small className="text-body-secondary text-md">{generator.address.street} {generator.address.number}, {order.zone}, {generator.address.city}, {generator.address.province}</small></p>}
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
                            <p className="card-text"><small className="text-body-secondary text-md">Ingresado el {inserted_date}</small></p>
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
