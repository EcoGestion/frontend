'use client'
import React, { useEffect, useState } from 'react';
import Spinner from "@components/Spinner";
import { getOrderById, updateOrderById, getUserById, release_waste_request } from "@api/apiService";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import dynamic from 'next/dynamic'
import "./style.css"
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { Address, UserInfo, WasteQuantities, WasteCollectionRequest } from '@/types';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { mapRequestStatus } from '@/constants/request';
import { formatDate, formatDateRange, formatTime } from '@/utils/dateStringFormat';
import { ToastNotifier } from '@/components/ToastNotifier';
import { ToastContainer } from 'react-toastify';
import AcceptConfirmationModal from '@/components/AcceptConfirmationModal';
import { mapMaterialNameToLabel } from '@/constants/recyclables';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const OrderDetails = (props: {params?: { id?: string } }) => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const orderId = props.params?.id
  
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [generator, setGenerator] = useState<UserInfo | null>(null);
  const [order, setOrder] = useState<WasteCollectionRequest | null>(null);
  const [isCollapsedItems, setIsCollapsedItems] = useState(false);
  const [isCollapsedObservations, setIsCollapsedObservations] = useState(false);
  const router = useRouter();
  const [centerCoords, setCenterCoords] = useState<[number, number]>([-34.5814551, -58.4211107]);

  const [isModalReleaseOpen, setIsModalReleaseOpen] = useState(false);

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

              setDateTimeRange(formatDateRange(responseOrder.pickup_date_from, responseOrder.pickup_date_to));
              setInserted_date(responseOrder.request_date);
              setStatus(mapRequestStatus[responseOrder.status as keyof typeof mapRequestStatus]);
              setProducts(responseOrder.waste_quantities);
              setAddress(responseOrder.address);
              setPoint([{position: [parseFloat(responseOrder.address.lat), parseFloat(responseOrder.address.lng)], content: responseOrder.generator.username, popUp: `${responseOrder.address.street} ${responseOrder.address.number}`}])
              setCenterCoords([parseFloat(responseOrder.address.lat), parseFloat(responseOrder.address.lng)]);

              setLoading(false);
              setUserId(userSession? userSession.userId : null)
          } catch (error) {
              console.log("Error al obtener usuario", error);
          } 
      }
      fetchUser();
  }, [props, update]);

  const [dateTimeRange, setDateTimeRange] = useState<string | null>(null);
  const [inserted_date, setInserted_date] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null | undefined>(null);
  const [products, setProducts] = useState<WasteQuantities | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [point, setPoint] = useState<any | null>(null);
  
  const acceptRequest = async (rowData: any) => {
      setLoading(true);
      updateOrderById(rowData.id, userId, "PENDING")
      .then(() => getOrderById(orderId))
      .then((response) => {
          setOrder(response);
          setLoading(false);
      })
    };
    


  const confirmReleaseOrder = () => {
      setIsModalReleaseOpen(true);
  }
      

  const releaseOrder = async () => {
    if (order) {
      setLoading(true);
      setIsModalReleaseOpen(false);
      try {
        await release_waste_request(orderId, order.coop_id)
        .then((r) => {
          router.replace("/home/cooperativa/pedidos")
        })
      } catch (error) {
        console.log("Error al liberar solicitud", error)
        ToastNotifier.error("Error al liberar solicitud\nPor favor, intente nuevamente")
        setLoading(false);
      } 
    } else {
      ToastNotifier.error("No hay solicitud para liberar");
    }
  }


    return (
        <div className="items-center flex justify-center">
          <ToastContainer />
          <AcceptConfirmationModal isOpen={isModalReleaseOpen} onRequestClose={() => setIsModalReleaseOpen(false)} onConfirm={releaseOrder} title='Desea liberar la solicitud?' message="Una vez liberada, la solicitud estará nuevamente disponible para todas las cooperativas." />
            {!loading && (
                        // INICIO CARD
                        <div className="card mx-3 my-4 md:m-3 w-100 px-1 md:px-3 py-1 md:py-3">
                        <div className="row g-0 w-full">
                        <div className="col-md-20">
                        <div className="card-body flex flex-col gap-1">
                                {generator && <h5 className="card-title font-medium text-5xl"> {generator.username}</h5>}
                                {status == "Cancelado" ?
                                (<h3 className="card-title font-semibold text-[#ec1a09] text-xl">{status.toUpperCase()} </h3>) :
                                (<h3 className="card-title font-semibold text-black text-xl">{status ? status.toUpperCase() : ""} </h3>)}
                                <div className="flex flex-row gap-3 text-xl items-center">
                                    <LocalShippingIcon className="ml-1"/>
                                    <div className="flex flex-col">
                                    <p className="card-text"><small className="text-body-secondary">{dateTimeRange}</small></p>
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
                                {products &&
                                products.map(product => 
                                    (
                                        <div className="flex flex-row gap-3 justify-start mx-2 md:mx-5">
                                        <img src="/box.svg" alt="box" className="w-7" />
                                        <p className="card-text flex gap-3 items-center">
                                            <span className="text-body-secondary font-semibold text-md">{mapMaterialNameToLabel[product.waste_type as keyof typeof mapMaterialNameToLabel]}</span>
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
                                        {order && <p className="card-text"><small className="text-body-secondary text-md">{order.address?.street} {order.address?.number}, {order.address?.zone}, {order.address?.city}, {order.address?.province}</small></p>}
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
                                        <small className="text-body-secondary text-md ml-4">{order ? order.details : ""}</small>
                                    </div>
                                </div>
                            </div>
                            </div>
                            </div>
                        </div>
                        </div> 
                        {/*  FIN OBSERVACIONEs */}

                        {point && 
                        <div className="lg:mx-9 my-4 h-80">
                        <MapView centerCoordinates={centerCoords} markers={point} zoom={15}/>
                        </div>
                        }

                        {/* FECHA INSERTADO */}
                        <div className="flex flex-row gap-3 text-xl items-center mt-52 justify-between">
                            <p className="card-text"><small className="text-body-secondary text-md">Ingresado el {formatDate(inserted_date)} {formatTime(inserted_date)}</small></p>
                            {order && order.status == "OPEN" && <Button className="bg-green-dark text-white w-32" onClick={() => acceptRequest(order)}>Aceptar</Button>}
                            {status =="Pendiente" &&
                                <div>
                                    <Button className='bg-white text-red-dark px-3 py-2 rounded-medium border-medium border-red-dark' onClick={confirmReleaseOrder}>Liberar</Button>
                              </div>}
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
