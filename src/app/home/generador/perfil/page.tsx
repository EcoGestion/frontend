'use client'
import { useState, useEffect } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { getUserById } from "@/api/apiService";
import Spinner from '@/components/Spinner';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { UserInfo } from '@/types';
import { mapGenType } from '@/constants/userTypes';
import MapView from '@/components/MapView';


const PerfilGenerador = () => {
    const userSession = useSelector((state: RootState) => state.userSession);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [typeLabel, setTypeLabel] = useState<string | undefined>(undefined);
    const [coords, setCoords] = useState<[number, number] | undefined>();
    
    interface Marker {
      position: number[];
      content: string;
      popUp: string;
    }
    
    const [markers, setMarkers] = useState<Marker[] | null>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      retrieveData();
    }, []);

    const retrieveData = async () => {
      try {
          const response = await getUserById(userSession.userId);
          setTypeLabel(mapGenType(response.type));
          setCoords([response.address.lat, response.address.lng]);
          setUserInfo(response);
      } catch (error) {
          console.error('Error retrieving user data:', error);
      } finally {
          setLoading(false);
      }
    };

    useEffect(() => {
      if (userInfo) {
        setMarker(Number(userInfo.address.lat), Number(userInfo.address.lng));
      }
    }, [userInfo]);

    const setMarker = (lat: number, lng: number) => {
      setMarkers([{
        position: [lat, lng],
        content: userInfo ? userInfo.username : 'Generador',
        popUp: 'Tu ubicacion',
      }]);
    }

    return (
      <div className="flex items-start justify-center bg-white">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col items-center justify-items-start p-3 w-full h-full">
            <h1 className='text-2xl font-bold text-center my-3'>Perfil de usuario</h1>

            <div className="flex flex-col md:flex-row flex-wrap w-full px-10 justify-center gap-10">
              <Card className="flex-1">
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
                <Divider />
                <CardBody>
                  <h2 className="font-semibold">Tipo de generador</h2>
                  <p>{typeLabel}</p>
                </CardBody>
              </Card>

              <div className="flex-1">
                <MapView centerCoordinates={coords} markers={markers} zoom={15} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default PerfilGenerador;
