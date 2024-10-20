'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Divider, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn, Input, Select, SelectItem, Pagination
 } from '@nextui-org/react';
import { useUser } from '../../../../state/userProvider';
import Spinner from '../../../../components/Spinner';
import { getRoutesById, getRequestsByRouteId} from '../../../../api/apiService';
import "./style.css"

const zones = [
    { value: "Abasto", label: "Abasto" },
    { value: "Almagro", label: "Almagro" },
    { value: "Balvanera", label: "Balvanera" },
    { value: "Barracas", label: "Barracas" },
    { value: "Belgrano", label: "Belgrano" },
    { value: "Boedo", label: "Boedo" },
    { value: "Caballito", label: "Caballito" },
    { value: "Centro", label: "Centro" },
    { value: "Chacarita", label: "Chacarita" },
    { value: "Coghlan", label: "Coghlan" },
    { value: "Colegiales", label: "Colegiales" },
    { value: "Constitución", label: "Constitución" },
    { value: "Devoto", label: "Devoto" },
    { value: "Flores", label: "Flores" },
    { value: "Floresta", label: "Floresta" },
    { value: "La Boca", label: "La Boca" },
    { value: "La Paternal", label: "La Paternal" },
    { value: "Liniers", label: "Liniers" },
    { value: "Mataderos", label: "Mataderos" },
    { value: "Monte Castro", label: "Monte Castro" },
    { value: "Morón", label: "Morón" },
    { value: "Núñez", label: "Núñez" },
    { value: "Palermo", label: "Palermo" },
    { value: "Paternal", label: "Paternal" },
    { value: "Puerto Madero", label: "Puerto Madero" },
    { value: "Recoleta", label: "Recoleta" },
    { value: "Retiro", label: "Retiro" },
    { value: "Saavedra", label: "Saavedra" },
    { value: "San Cristóbal", label: "San Cristóbal" },
    { value: "San Nicolás", label: "San Nicolás" },
    { value: "San Telmo", label: "San Telmo" },
    { value: "Villa Devoto", label: "Villa Devoto" },
    { value: "Villa del Parque", label: "Villa del Parque" },
    { value: "Villa Luro", label: "Villa Luro" },
    { value: "Villa Ortúzar", label: "Villa Ortúzar" },
    { value: "Villa Real", label: "Villa Real" },
    { value: "Villa Santa Rita", label: "Villa Santa Rita" },
    { value: "Villa Urquiza", label: "Villa Urquiza" }
  ];
  
  const generatorTypes = [
  { value: "Restaurante", label: "Restaurante" },
  { value: "Edificio", label: "Edificio" },
  { value: "Empresa", label: "Empresa" },
  { value: "Oficina", label: "Oficina" },
  { value: "Hotel", label: "Hotel" },
  { value: "Fábrica", label: "Fábrica" },
  { value: "Club", label: "Club" },
  { value: "Institución Educativa", label: "Institución Educativa" },
  { value: "Hospital", label: "Hospital" },
  { value: "Mercado", label: "Mercado" },
  { value: "Otro", label: "Otro" }
  ];
  
  const wasteTypes = [
  { label: 'Papel', value: 'Papel' },
  { label: 'Metal', value: 'Metal' },
  { label: 'Vidrio', value: 'Vidrio' },
  { label: 'Plástico', value: 'Plastico' },
  { label: 'Cartón', value: 'Cartón' },
  { label: 'Tetra Brik', value: 'Tetra Brik' },
  { label: 'Telgopor', value: 'Telgopor' },
  { label: 'Pilas', value: 'Pilas' },
  { label: 'Aceite', value: 'Aceite' },
  { label: 'Electrónicos', value: 'Electrónicos' }
  ];

const HistorialRutas = () => {
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(null);
    const [orders, setOrders] = useState(null)
    const [filters, setFilters] = useState({ zone: [], status: [], wasteType: [], generatorType: [], generator: '' });
  
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const rowsPerPage = 5;
    const router = useRouter();

    const filteredOrders = orders?.filter(order => {
        const zone = order.address? order.address.zone : order.generator.address.zone
        return (
          ((!filters.date_from && !filters.date_to) ||
          (filters.date_from && filters.date_to && (order.pickup_date_to >= filters.date_from && order.pickup_date_from <= filters.date_to))) &&
          (!filters.generator || order.generator_name.toLowerCase().includes(filters.generator.toLowerCase())) &&
          (filters.status.length == 0 || (filters.status.length == 1 && !filters.status[0])  || filters.status.includes(order.status)) &&
          (filters.wasteType.length == 0 || (filters.wasteType.length == 1 && !filters.wasteType[0]) || filters.wasteType.every(element => order.waste_types.includes(element))) &&
          (filters.zone.length == 0 || (filters.zone.length == 1 && !filters.zone[0]) || filters.zone.includes(zone)) &&
          (filters.generatorType.length == 0 || (filters.generatorType.length == 1 && !filters.generatorType[0]) || filters.generatorType.includes(order.generator_type))
        );
      });

      useEffect(() => {
        if (filteredOrders) {
          setPages(Math.ceil(filteredOrders.length / rowsPerPage)); 
        } 
      }, [orders, filters]);
    
      const get_daily_orders = React.useMemo(() => {
        if (filteredOrders) {
          const start = (dailyPage - 1) * rowsPerPage;
          const end = start + rowsPerPage;
      
          return filteredOrders.slice(start, end);
        }
        else
          return []
      
      }, [page, filteredOrders]);

      const getStatus = (status) => {
        switch (status) {
            case 'REJECTED':
                return 'Cancelada';
      
            case 'COMPLETED':
                return 'Completada';
      
            case 'PENDING':
                return 'En proceso';
      
            case 'OPEN':
                return 'Ingresada';
      
            case 'ON_ROUTE':
                return 'En ruta';
        }
      }
      
      const getGeneratorType = (type) => {
        switch (type) {
          case "GEN_RESTAURANT":
              return 'Restaurante';
      
          case "GEN_BUILDING":
              return 'Edificio';
      
          case "GEN_COMPANY":
              return 'Empresa';
      
          case "GEN_OFFICE":
              return 'Oficina';
      
          case "GEN_HOTEL":
              return 'Hotel';
      
          case "GEN_FACTORY":
              return 'Fábrica';
      
          case "GEN_CLUB":
              return 'Club';
      
          case "GEN_EDUCATIONAL_INSTITUTION":
              return 'Institución Educativa';
      
          case "GEN_HOSPITAL":
              return 'Hospital';
      
          case "GEN_MARKET":
              return 'Mercado';
      
          case "GEN_OTHER":
              return 'Otro';
        }
      }
    
      const formatDate = (value) => {
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
    
      const formatWasteType = (value) => {
        return value.join(", ");
      };

      const transform_order_data = async (order) => {
        order.request_date = new Date(order.request_date)
        order.pickup_date_from = new Date(order.pickup_date_from)
        order.pickup_date_to = new Date(order.pickup_date_to)
        order.generator_type = getGeneratorType(order.generator.type)
        order.generator_name = order.generator.username
        order.waste_types = order.waste_quantities.map(waste => waste.waste_type).sort()
        order.status = getStatus(order.status)
        return order
    }

    useEffect(() => {
      const fetchOrders = async () => {
        if (user.userId) {
          try {
            await getRoutesById(user.userId)
            .then((response) => Promise.all(response.map(order => transform_order_data(order))))
            .then((transformed_orders) => {
              setOrders(transformed_orders)
              setPages(Math.ceil(transformed_orders.length / rowsPerPage))
              })
              .then(() => setLoading(false))
            
          } catch (error) {
            console.log("Error al obtener pedidos", error);
          } 
        } else {
          setLoading(false);
        }
      };
  
      fetchOrders();
  }, [user.userId]);
      
    return (
        <div style={{ width: "100vw", height: "100vh"}} className="p-4">
            <h1 className="text-xl font-bold text-center">Historial de rutas</h1>
        </div>
    )
}

export default HistorialRutas;
