'use client'
import { FormEvent, use, useState } from 'react';
import {auth} from '../../firebaseConfig';
import {signInWithEmailAndPassword} from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import GreenRoundedButton from '../../../components/greenRoundedButton';
import BlueRoundedButton from '../../../components/blueRoundedButton';
import { loginUser } from '../../../api/apiService';
import { useUser } from '../../../state/userProvider';
import Spinner  from '../../../components/Spinner';
import { setUserSession } from '../../../state/userSessionSlice';
import React from 'react';

// /login/{cooperativa/generador}

const Login = ({ params }: { params: { userType: string } }) => {
  const userType = params.userType;
  const { setUser } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.uid;
      const userData = {
        "email": userCredential.user.email,
        "firebase_id": firebaseToken
      }
      const userInfo = await loginUser(userData)
      setUser({
        name: userInfo.username,
        email: userInfo.email,
        userId: userInfo.id
      })
      dispatch(setUserSession({
        email: userInfo.email,
        userId: userInfo.id,
        name: userInfo.username,
      }));
      router.replace('/home/' + userType);
    }
    catch (error) {
        console.log("Error al loguear usuario", error);
        alert('Error al iniciar sesión');
        setLoading(false);
    }
  }

  const handleRegister = () => {
    // Redirigir a la página de registro
    router.push('/register/' + userType);
  };

  const handleBack = () => {
    // Redirigir a la página anterior
    router.back();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {loading ? (
        <Spinner />
      ) : (
      <div className="bg-[rgb(146,164,190)] p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Eco Gestion</h1>
        <h2 className="text-2xl mb-6 text-center">Inicio de sesión - {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
        <form onSubmit={handleLogin} className="flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border border-gray-300 p-2 rounded text-black w-64"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border border-gray-300 p-2 rounded text-black w-64"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex gap-4 mt-4">
            <GreenRoundedButton buttonTitle="Iniciar sesión" type='submit' />
            <BlueRoundedButton onClick={handleRegister} buttonTitle="Registrarse" />
          </div>
          <button 
            type='button'
            className="bg-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 mt-4" 
            onClick={handleBack}
          >
            Volver
          </button>
        </form>
      </div>
      )}
    </div>
  );
};

export default Login;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

