// pages/login.tsx
'use client'
import { useState } from 'react';
import {auth} from '../firebaseConfig';
import {signInWithEmailAndPassword} from "firebase/auth";
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', await userCredential.user.getIdToken());
      router.push('/');

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className ="flex flex-col items-center justify-center gap-5 h-screen" >
      <h1>Eco Gestion</h1>
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
      <button className="bg-white px-5 text-black" onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
};

export default Login;

