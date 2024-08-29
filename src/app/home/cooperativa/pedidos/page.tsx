import React from "react";
import Order from "../../../../components/Order";

const OrderList = () => {
    const orders = [
        {title:"Empanadas"}
        ,
    ]
    return (
        <div className="flex flex-col items-center justify-start  h-screen">
            <h1 className="text-4xl font-bold py-4">Mis pedidos</h1>
            {orders.map((order) => (
                <Order props = {order} />
            ) )}
        </div>
    );
};

export default OrderList;
