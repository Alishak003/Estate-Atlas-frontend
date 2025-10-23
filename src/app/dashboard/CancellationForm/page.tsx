'use client';

import CancellationConfirmation from "@/components/dashboard/Account/cancellation-confirmation";
import CancellationReasonModal from "@/components/dashboard/Account/Cancellation-form";
import CancellationOffer from "@/components/dashboard/Account/cancellation-offer";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Step = 0|1|2|3;
const CancellationForm = ()=>{
    const router = useRouter();
    const {step} = useParams();
    const stepNumber = Number(step);
    const initialStep: Step = [0,1,2,3].includes(stepNumber) ? (stepNumber as Step) : 1;

    const [activeStep, setActiveStep] = useState<Step>(initialStep);
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const handleBack = ()=>{
        const nextStep = activeStep > 0 ? activeStep-1 as Step : activeStep;
        window.history.pushState(null, '', `?step=${nextStep}`);
        setActiveStep(nextStep);
    };

    const handleNext = () => {
        const nextStep = activeStep < 3 ? activeStep+1 as Step : activeStep;
        window.history.pushState(null, '', `?step=${nextStep}&reason=${selectedReason}&other=${otherReason}`);
        setActiveStep(nextStep);
    };

    const handleSubmit = ()=> {

    }

    useEffect(()=>{
        if(activeStep<=0){
            router.push('dashboard/accountSettings');
        }
    },[activeStep,router]);

    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlStep = parseInt(params.get('step') ?? "1",10);
    const urlReason = params.get('reason') ?? "";
    const urlOther = params.get('other') ?? "";
    
    if (urlStep < 4) {
        setActiveStep(urlStep as Step); 
        setSelectedReason(urlReason);
        setOtherReason(urlOther);
    }
    },[router]);

    return(
        <>
            {activeStep === 1 && <CancellationReasonModal selectedReason={selectedReason} setSelectedReason={setSelectedReason} handleBack={handleBack} handleNext={handleNext} />}
            {activeStep === 2 && <CancellationOffer setOtherReason={setOtherReason} selectedReason={selectedReason} otherReason={otherReason} handleBack={handleBack} handleNext={handleNext} />}
            {activeStep === 3 && <CancellationConfirmation handleSubmit = {handleSubmit} handleBack = {handleBack} />}
        </>
    )
}

export default CancellationForm;