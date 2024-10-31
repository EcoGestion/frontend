import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React, { useEffect, useState } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {Button} from '@nextui-org/react';
import { formatDate, formatTime } from '@/utils/dateStringFormat';

const Route = ({route, startRoute, cancelRoute}) => {
    const [isCollapsedItems, setIsCollapsedItems] = useState(false);

    const toggleCollapseItems = () => {
        setIsCollapsedItems(!isCollapsedItems);
    };
    
    return (
    <div className="card my-3 w-88 px-3 shadow-lg rounded-3xl cursor-pointer" onClick={toggleCollapseItems}>
    <div className="row g-0 w-full ml-3">
        <div className="col-md-20 ">
        <div className="card-body flex flex-col gap-1">
        <div className="flex justify-between items-center md:mx-2 mt-2 ml-2">
            <h3 className="card-title font-medium text-2xl mt-3"> Ruta {route.id} - {route.status} </h3>
            {!isCollapsedItems ? <ExpandMoreIcon className="md:ml-1 text-4xl"/> : <ExpandLessIcon className="md:ml-1 text-4xl"/> }
        </div>
        
        <div className={`${isCollapsedItems ? 'block' : 'hidden'}`}>
            <div className="flex flex-col gap-3 justify-start mx-2 md:mx-5">
            <p className="card-text flex gap-3 items-center">
                <CalendarMonthIcon></CalendarMonthIcon> Fecha:
                <span className="text-body-secondary font-semibold text-md">{formatDate(route.created_at)} {formatTime(route.created_at)}</span>
            </p>
            <p className="card-text flex gap-3 items-center">
                <FitnessCenterIcon></FitnessCenterIcon> Peso:
                <span className="text-body-secondary font-semibold text-md">{route.total_weight}</span>
            </p>

            <div className='flex flex-row gap-3'>
                <div className='flex gap-3'>
                    <LocalShippingIcon></LocalShippingIcon> 
                    <span>Camión:</span>
                </div>
                <div className='grid grid-cols-2 gap-y-3 gap-x-20'>
                    <span className="text-body-secondary font-semibold text-md">Marca: {route.truck.brand}</span>
                    <span className="text-body-secondary font-semibold text-md">Modelo: {route.truck.model}</span>
                    <span className="text-body-secondary font-semibold text-md">Patente: {route.truck.patent}</span>
                    <span className="text-body-secondary font-semibold text-md">Capacidad: {route.truck.capacity}</span>
                </div>
            </div>
            <div className='flex gap-2 justify-end mr-8 mt-3 pr-2'>
                {route.status == "Creada" &&
                    <Button className='bg-white text-green-dark px-3 py-2 rounded-medium border-medium border-green-dark' onClick={() => startRoute(route.id)}>Comenzar ruta</Button>
                }
                {route.status != "Creada" &&
                    <Button className='cursor-not-allowed opacity-60' disabled onClick={startRoute}>Comenzar ruta</Button>
                }
                {route.status != "Completada" && route.status != "Cancelada" && route.status != "Completada parcialmente" &&
                    <Button className='bg-white text-red-dark px-3 py-2 rounded-medium border-medium border-red-dark' onClick={() => cancelRoute(route.id)}>Cancelar ruta</Button>
                }
            </div>
            </div>
        </div>
        </div>
        </div>
    </div>
    </div>
    )
} 

export default Route;
