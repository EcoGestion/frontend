'use client'
import { useState, useEffect } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { getUserById } from "@/api/apiService";
import Spinner from '@/components/Spinner';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { UserInfo } from '@/types';
import { ToastNotifier } from '@/components/ToastNotifier';
import { ToastContainer } from 'react-toastify';

const PerfilConductor = () => {
    const userSession = useSelector((state: RootState) => state.userSession);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      retrieveData();
    }, []);

    const retrieveData = async () => {
      try {
          const response = await getUserById(userSession.userId, userSession.accessToken);
          setUserInfo(response);
      } catch (error) {
          console.error('Error retrieving user data:', error);
      } finally {
          setLoading(false);
      }
    };

    const handleEdit = () => {
        ToastNotifier.warning('Funcionalidad no disponible. Por favor solicite a la cooperativa que actualice su información.');
    }

    return (
      <div className="flex items-start justify-center bg-white min-h-screen">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col items-center justify-start p-4 pt-8 w-full h-full">
            <h1 className="text-4xl font-bold mb-6 pt-4">Perfil de usuario</h1>
              <Card className="md:col-span-1 max-w-lg min-w-80">
                <CardHeader>
                  <div className="flex flex-col items-start">
                    <p className="text-md">{userInfo?.username}</p>
                    <p className="text-small">{userInfo?.email}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 ml-auto">
                    <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                    onClick={handleEdit}>
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
        )}
        <ToastContainer />
      </div>
    );
}

export default PerfilConductor;
