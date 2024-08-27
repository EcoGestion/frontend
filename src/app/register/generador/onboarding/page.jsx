'use client'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OnboardingGeneradorFormStep1 from './components/FormStep1.jsx';
import OnboardingGeneradorFormStep2 from './components/FormStep2.jsx';
import { useRouter } from 'next/navigation';
import { createUser } from '../../../../api/apiService.js';
import Spinner from '../../../../components/Spinner.tsx';

export default function onboarding() {
  const user = useSelector((state) => state.userSession);
  
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({});
  const [organizationType, setOrganizationType] = useState("");
  const [loading, setLoading] = useState(false)

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    if (step === 3) {
      setLoading(true)
      sendForm();
    }
  }, [step]);

  const sendForm = async () => {
    const body = {
      username: user.name,
      email: user.email,
      type: "GEN",
      firebase_id: user.userId,
      address: address,
      organization_type: organizationType
    }
    console.log(body);
    try {
      const response = await createUser(body)
      console.log("Usuario creado: ", response);
      router.replace("/home/cooperativa");
    }
    catch (error) {
      console.log("Error al crear usuario", error);
    }
    finally{
      setLoading(false)
    }   
  }
  
  return (
    <div>
      {step === 1 && <OnboardingGeneradorFormStep1 nextStep={nextStep} setAddress={setAddress} address={address} />}
      {step === 2 && <OnboardingGeneradorFormStep2 nextStep={nextStep} prevStep={prevStep} organizationType={organizationType} setOrganizationType={setOrganizationType}/>}
      {loading && <Spinner/>}
    </div>
  );
}