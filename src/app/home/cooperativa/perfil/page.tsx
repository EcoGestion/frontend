'use client'
import { useState, useEffect } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { getUserById } from "@/api/apiService";
import ReciclablesSelector from '@/components/ReciclablesSelector';
import TimeSelector from '@/components/TimeSelector';
import Spinner from '@/components/Spinner';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { Day, Item, UserInfo } from '@/types';
import {wasteTypesDefault} from '@constants/recyclables';
import { daysOptions } from '@constants/dateAndTime';
import { ToastNotifier } from '@/components/ToastNotifier';
import { ToastContainer } from 'react-toastify';

const transformDays = (backendDays: Day[]): Day[] => {
  return daysOptions.map(dayOption => {
    const backendDay = backendDays.find(day => day.name === dayOption.name);
    return backendDay ? {
      ...dayOption,
      active: backendDay.active,
      begin_at: backendDay.begin_at,
      end_at: backendDay.end_at
    } : dayOption;
  });
};

const Perfil = () => {
    const userSession = useSelector((state: RootState) => state.userSession);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [loading, setLoading] = useState(true);

    const [items, setItems] = useState(wasteTypesDefault);
    
    const updateItems = (newItems: Item[]) => {
      const wasteTypeMap = new Map(newItems.map(item => [item.name, true]));
      const updatedItems = items.map(item => ({
        ...item,
        checked: wasteTypeMap.has(item.name),
      }));
      setItems(updatedItems);
    }

    const updateDays = (newDays: Day[]) => {
      const transformedDays = transformDays(newDays);
      setDays(transformedDays);
    }

    useEffect(() => {
        retrieveData();
    }, []);

    const retrieveData = async () => {
      try {
          const response = await getUserById(userSession.userId);
          updateItems(response.waste_type_config);
          updateDays(response.days);
          setUserInfo(response);
      } catch (error) {
          console.error('Error retrieving user data:', error);
          ToastNotifier.error('Error al obtener los datos del usuario.\nPor favor, intente nuevamente.');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="flex items-start justify-center bg-white">
      <ToastContainer />
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col h-screen w-11/12 md:w-4/5 p-2 gap-3'>
          <h1 className='text-2xl font-bold text-center my-3'>Perfil de usuario</h1>
          <div className="flex flex-row flex-wrap gap-6 w-full">

          <div className="flex-1">
            <Card >
              <CardHeader>
                <div className="flex flex-col items-start">
                  <p className="text-md">{userInfo?.username}</p>
                  <p className="text-small">{userInfo?.email}</p>
                </div>
                <div className="flex justify-between items-center mt-4 ml-auto">
                  <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
                    Editar
                  </button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <h2 className="font-semibold">Dirección</h2>
                <p>{userInfo?.address.street} {userInfo?.address.number}</p>
                <p>{userInfo?.address.city}, {userInfo?.address.province}</p>
                <p>Teléfono: {userInfo?.phone}</p>
              </CardBody>
            </Card>
          </div>
  
            <div className="flex-1">
              <ReciclablesSelector
                items={items}
                editable={false}
                showEditButton={true}
              />
            </div>
  
            <div className="flex-2">
              <TimeSelector
                days={days}
                editable={false}
                showEditButton={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}

export default Perfil;
