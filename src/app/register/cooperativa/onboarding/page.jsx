'use client'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OnboardingCooperativaFormStep1 from "./components/FormStep1.jsx"
import OnboardingCooperativaFormStep2 from './components/FormStep2.jsx';
import OnboardingCooperativaFormStep3 from './components/FormStep3.jsx';
import { useRouter } from 'next/navigation';
import { createUser } from '../../../../api/apiService';
import Spinner from '../../../../components/Spinner.tsx';

export default function Onboarding() {
  const user = useSelector((state) => state.userSession);
  
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({});
  const [recyclableObjects, setRecyclableObjects] = useState(null);
  const [availableSchedule, setAvailableSchedule] = useState(null);
  const [loading, setLoading] = useState(false)

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    if (step === 4) {
      setLoading(true)
      sendForm();
    }
  }, [step]);

  // ToDO: Agregar phone
  const sendForm = async () => {
    const body = {
      username: user.name,
      email: user.email,
      type: "COOP",
      firebase_id: user.userId,
      address: address,
      phone: "123456789",
      days: availableSchedule,
      waste_type_config: recyclableObjects.filter(item => item.checked).map(item => ({ name: item.name }))
    }
    console.log(body);
    try {
      const response = await createUser(body)
      console.log("Usuario creado: ", response);
      router.replace("/home/cooperativa");
    }
    catch (error) {
      console.log("Error al crear usuario", error);
      alert("Error al crear usuario. \nPor favor, intente nuevamente.");
      setLoading(false);
      setStep(3);
    }
    finally{
      setLoading(false);
    } 
  }
  
  return (
    <div>
      {step === 1 && <OnboardingCooperativaFormStep1 nextStep={nextStep} setAddress={setAddress} address={address} />}
      {step === 2 && <OnboardingCooperativaFormStep2 nextStep={nextStep} prevStep={prevStep} setRecyclableObjects={setRecyclableObjects} recyclableObjects={recyclableObjects} />}
      {step === 3 && <OnboardingCooperativaFormStep3 nextStep={nextStep} prevStep={prevStep} setAvailableSchedule={setAvailableSchedule} availableSchedule={availableSchedule} />}
      {loading && <Spinner/>}

    </div>
  );
}
