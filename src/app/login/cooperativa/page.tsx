'use client'
import { use, useState } from 'react';
import {auth} from '../../firebaseConfig';
import {signInWithEmailAndPassword} from "firebase/auth";
import { useRouter } from 'next/navigation';

// /login/cooperativa

const LoginCooperativa = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', await userCredential.user.getIdToken());
      router.push('/home/cooperativa');

    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = () => {
    // Redirigir a la página de registro
    router.push('/register/cooperativa');
  };

  const handleBack = () => {
    // Redirigir a la página anterior
    router.back();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="bg-[rgb(146,164,190)] p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Eco Gestion</h1>
        <h2 className="text-2xl mb-6 text-center">Inicio de sesión - Cooperativa</h2>
        <div className="flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border border-gray-300 p-2 rounded text-black w-64"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border border-gray-300 p-2 rounded text-black w-64"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-4 mt-4">
            <button 
              className="bg-[rgb(57,194,99)] hover:bg-[rgb(50,175,89)] text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300" 
              onClick={handleLogin}
            >
              Iniciar sesión
            </button>
            <button 
              className="bg-[rgb(76,200,230)] hover:bg-[rgb(68,180,207)] text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300" 
              onClick={handleRegister}
            >
              Registrarse
            </button>
          </div>
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 mt-4" 
            onClick={handleBack}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginCooperativa;
