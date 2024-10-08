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
import {materialsDefault} from '@constants/recyclables';

const nameSpanishMap: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miercoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo'
};

const transformDays = (backendDays: Day[]): Day[] => {
  return backendDays.map(day => ({
    id: day.id,
    name: day.name,
    name_spanish: nameSpanishMap[day.name],
    active: day.active,
    begin_at: day.begin_at,
    end_at: day.end_at
  }));
};

const Perfil = () => {
    const userSession = useSelector((state: RootState) => state.userSession);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [loading, setLoading] = useState(true);

    const [items, setItems] = useState(materialsDefault);

    const nameSpanishMap = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miercoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo'
    };
      

    useEffect(() => {
    if (userInfo) {
      const wasteTypeMap = new Map(userInfo.waste_type_config.map(item => [item.name, true]));
      const updatedItems = items.map(item => ({
        ...item,
        checked: wasteTypeMap.has(item.name),
      }));
      setItems(updatedItems);
    }
  }, [userInfo]);

    useEffect(() => {
        if (userInfo) {
        const transformedDays = transformDays(userInfo.days);
        console.log("transformedDays", transformedDays);
        setDays(transformedDays);
        }
    }, [userInfo]);

    useEffect(() => {
        retrieveData();
    }, []);

    const retrieveData = async () => {
      try {
          const response = await getUserById(userSession.userId);
          console.log(response);
          setUserInfo(response);
      } catch (error) {
          console.error('Error retrieving user data:', error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="flex items-start justify-center bg-white">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold mb-6">Perfil de usuario</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <Card className="md:col-span-1">
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
  
            <div className="md:col-span-1">
              <ReciclablesSelector
                items={items}
                editable={false}
                showEditButton={true}
              />
            </div>
  
            <div className="md:col-span-1">
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
