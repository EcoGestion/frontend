'use client'
import Order from "../../../../components/Order";
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../state/userProvider';
import { getOrdersById } from "../../../../api/apiService";
import Spinner from "../../../../components/Spinner";

const OrderList = () => {
    const {user} = useUser(); 
    const [orders, setOrders] = useState([{title:"Empanadas"}])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
          if (user.userId) {
            try {
              const response = await getOrdersById(user.userId);
              console.log("Ordenes: ", response);
              setOrders(response); 
            } catch (error) {
              console.log("Error al obtener pedidos", error);
            } finally {
              setLoading(false);
            }
          } else {
            console.log("User ID no disponible");
            setLoading(false);
          }
        };
    
        fetchOrders();
    }, [user.userId]);

    return (
        <div className="items-center h-screen">
            {!loading && orders.length > 0 ? (
                <div className="flex flex-col items-center justify-start  h-screen">
                <h1 className="text-4xl font-bold py-4 my-5">Mis pedidos</h1>

                {orders.map((order) => (
                <Order order = {order} />
                ) )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-start  h-screen">
                <p className="text-2xl py-4 my-5" >No hay órdenes disponibles.</p>
                </div>
            )}
            
            {loading && <Spinner/>}
        </div>
    );
};

export default OrderList;
