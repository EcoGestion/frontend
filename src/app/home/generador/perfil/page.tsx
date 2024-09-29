'use client'
import { useState, useEffect } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { getUserById } from "@/api/apiService";
import Spinner from '@/components/Spinner';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { Day, Item, UserInfo } from '@/types';
import { get } from 'http';

const generador_types = [
  { value: "GEN_BUILDING", label: "Consorcios de edificios" },
  { value: "GEN_OFFICE", label: "Oficinas y edificios corporativos" },
  { value: "GEN_HOTEL", label: "Hoteles" },
  { value: "GEN_RESTAURANT", label: "Restaurantes" },
  { value: "GEN_MARKET", label: "Supermercados" },
  { value: "GEN_COMPANY", label: "Empresas" },
  { value: "GEN_CLUB", label: "Clubes" },
  { value: "GEN_HOSPITAL", label: "Hospitales y clinicas" },
  { value: "GEN_EDUCATIONAL_INSTITUTION", label: "Instituciones educativas" },
  { value: "GEN_FACTORY", label: "Fabricas y plantas de producción" },
  { value: "GEN_OTHER", label: "Otros" }
];

function getLabelByValue(type: string|undefined) {
  const option = generador_types.find(option => option.value === type);
  return option ? option.label : 'Generador - Otros';
}


const PerfilGenerador = () => {
    const userSession = useSelector((state: RootState) => state.userSession);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [typeLabel, setTypeLabel] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      retrieveData();
    }, []);

    const retrieveData = async () => {
      try {
          const response = await getUserById(userSession.userId);
          setTypeLabel(getLabelByValue(response.type));
          setUserInfo(response);
      } catch (error) {
          console.error('Error retrieving user data:', error);
      } finally {
          setLoading(false);
      }
    };

    return (
      <div className="flex items-start justify-center bg-white min-h-screen">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col items-center justify-items-start p-4 w-full h-full">
            <h1 className="text-4xl font-bold mb-6 pt-4">Perfil de usuario</h1>
              <Card className="md:col-span-1 max-w-lg">
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
          </div>
        )}
      </div>
    );
}

export default PerfilGenerador;
