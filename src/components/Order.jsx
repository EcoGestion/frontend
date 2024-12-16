import React, { useEffect, useState } from "react";
import { getUserById } from "../api/apiService";
import { useSelector } from 'react-redux';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from "next/link";

const monthNames = {
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

const Order = ({order}) => {
    console.log(order)
    const userSession = useSelector((state) => state.userSession);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
          if (order) {
            try {
              const response = await getUserById(order.generator_id, userSession.accessToken);
              console.log("Usuario: ", response);
              setUser(response); 
            } catch (error) {
              console.log("Error al obtener usuario", error);
            } 
          } else {
            console.log("User ID no disponible");
          }
        };
    
        fetchUser();
    }, [order.generator_id]);

    const date = new Date(order.pickup_date);
    const month = date.getMonth() + 1;
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return (
        <div>
        {user && (
        <Link href={`/home/cooperativa/pedidos/detalles/${order.quantity}` }>
        <div className="card m-3 w-96 rounded-lg">
            <div className="row g-0 w-full rounded-lg">
                <div className="col-md-20 rounded-lg">
                <div className="card-body flex flex-col gap-1 rounded-lg">
                <h5 className="card-title font-medium text-3xl"> {user.username}</h5>
                        {order.status == "Cancelado" ?
                        (<h2 className="card-title font-semibold text-[#ec1a09]">{order.status.toUpperCase()} </h2>) :
                        (<h2 className="card-title font-semibold text-black">{order.status.toUpperCase()} </h2>)}
                    <div className="flex flex-row gap-3">
                        <LocalShippingIcon className="ml-1"/>
                        <p className="card-text"><small className="text-body-secondary">{date.getDate()} de {monthNames[month]} - {hour}:{minutes}</small></p>
                    </div>
                    <div className="flex flex-row gap-3 justify-start">
                        <img src="/box.svg" alt="box" className="w-7"></img>
                        <p className="card-text"><small className="text-body-secondary">{order.quantity} unidades</small></p>
                    </div>
                </div>
                </div>
            </div>
        </div> </Link>)
    } </div>
    );
}

export default Order;
