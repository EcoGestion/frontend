// pages/login.tsx
'use client'
import { useState } from 'react';
import {auth} from '../firebaseConfig';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential)
      router.push("/login")
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const redirecToLogIn = () => {
    router.push('/login')
  }

  return (
    <div className ="flex flex-col items-center justify-center gap-5 h-screen" >
      <h1>Eco Gestion</h1>
      <h1>Crear Cuenta</h1>
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
      <button className="bg-white px-5 text-black" onClick={handleSignUp}>Crear Cuenta</button>
      <button className="bg-white px-5 text-black" onClick={redirecToLogIn}>Volver atrás</button>
    </div>
  );
};

export default SignUp;

