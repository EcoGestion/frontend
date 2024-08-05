'use client'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import OnboardingCooperativaFormStep1 from "./components/FormStep1.jsx"
import OnboardingCooperativaFormStep2 from './components/FormStep2.jsx';
import OnboardingCooperativaFormStep3 from './components/FormStep3.jsx';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const user = useSelector((state) => state.userSession);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({});
  const [recyclableObjects, setRecyclableObjects] = useState(null);
  const [availableSchedule, setAvailableSchedule] = useState(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const sendForm = () => {
    console.log(address)
    console.log(recyclableObjects)
    console.log(availableSchedule)
    console.log(user)
    const body = {
      username: user.name,
      email: user.email,
      type: "COOP",
      firebase_id: user.userId,
      address: address,
      days: availableSchedule,
      waste_type_config: recyclableObjects.filter(item => item.checked).map(item => ({ name: item.label }))
    }

    fetch("http://ecogestion-back.onrender.com/user",
    {
        method: "POST",
        body: body
    })
    .then(response => {
      console.log(response.json());
      router.replace("/home/cooperativa");
    })
  }
  
  return (
    <div>
      {step === 1 && <OnboardingCooperativaFormStep1 nextStep={nextStep} setAddress={setAddress} address={address} />}
      {step === 2 && <OnboardingCooperativaFormStep2 nextStep={nextStep} prevStep={prevStep} setRecyclableObjects={setRecyclableObjects} recyclableObjects={recyclableObjects} />}
      {step === 3 && <OnboardingCooperativaFormStep3 nextStep={nextStep} prevStep={prevStep} setAvailableSchedule={setAvailableSchedule} />}
      {step === 4 && sendForm()}
    </div>
  );
}
