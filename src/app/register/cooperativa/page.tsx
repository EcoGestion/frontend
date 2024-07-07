'use client'
import { FormEvent, useState } from 'react';
import {auth} from '../../firebaseConfig';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import GreenRoundedButton from '@/components/greenRoundedButton';

const SignUpCooperativa = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e:FormEvent) => {
    e.preventDefault();
    console.log(name, email, password)
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
        <form onSubmit={handleSignUp} className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Nombre de la cooperativa"
            className="border border-gray-300 p-2 rounded text-black w-64"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            <GreenRoundedButton buttonTitle="Crear Cuenta" type='submit' />
          <button
            type='button'
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 " 
            onClick={handle_back}
          >
            Volver atrás
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpCooperativa;
