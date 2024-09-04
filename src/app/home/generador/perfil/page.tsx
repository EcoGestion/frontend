'use client'
import { useState } from 'react';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { getUserById } from "@/api/apiService";

const PerfilGenerador = () => {
    const userSession = useSelector((state: RootState) => state.userSession);
    const [userInfo, setUserInfo] = useState(null);

    const handleClick = async () => {
        const response = await getUserById(userSession.userId);
        setUserInfo(response);
        console.log(response);
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Perfil</h1>
            <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mt-4">Get User Info</button>
        </div>
    );
}

export default PerfilGenerador;
