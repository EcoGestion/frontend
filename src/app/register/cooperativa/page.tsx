'use client'
import { useState } from 'react';
import {auth} from '../../firebaseConfig';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpCooperativa = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential)
      router.replace("/login/cooperativa")
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const handle_back = () => {
    router.back();
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="bg-[rgb(146,164,190)] p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Eco Gestion</h1>
        <h2 className="text-2xl mb-6 text-center">Registro de usuario - Cooperativa</h2>
        <div className="flex flex-col items-center gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className = "text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className = "text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-4 mt-4">
        <button
          className="bg-[rgb(57,194,99)] hover:bg-[rgb(50,175,89)] text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300"
          onClick={handleSignUp}
        >
            Crear Cuenta
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 " 
          onClick={handle_back}
        >
          Volver atrás
        </button>
        </div>
        
        </div>
      </div>
    </div>
  );
};

export default SignUpCooperativa;

// className="bg-[rgb(57,194,99)] hover:bg-[rgb(50,175,89)] text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300"