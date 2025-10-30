'use client';

import CancellationConfirmation from "@/components/dashboard/Account/cancellation-confirmation";
import CancellationReasonModal from "@/components/dashboard/Account/Cancellation-form";
import CancellationOffer from "@/components/dashboard/Account/cancellation-offer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CompetitionFeedback from "../CompetitionFeedback/page";
import { TutorialVideo } from "@/components/dashboard/Account/TutorialVideo";

const CancellationForm = ()=>{
    const router = useRouter();
    const [activeStep, setActiveStep] = useState("");
    const [selectedReason, setSelectedReason] = useState('');
    const [duration, setDuration] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const handleBack = (stepValue:string)=>{
        const nextStep = stepValue;
        window.history.pushState(null, '', `?step=${nextStep}`);
        setActiveStep(nextStep);
    };

    const handleNext = (stepValue:string) => {
        const encodedReason = encodeURIComponent(selectedReason || '');
        const encodedDuration = encodeURIComponent(duration || '');
        const encodedOther = encodeURIComponent(otherReason || '');
        const encodedStep = encodeURIComponent(stepValue || '');
        window.history.pushState(null, '', `?step=${encodedStep}&reason=${encodedReason}&duration=${encodedDuration}&other=${encodedOther}`);
        setActiveStep(stepValue);
    };

    const handleSubmit = ()=> {

    }
    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlStep = params.get('step') ?? "default";
    const urlReason = params.get('reason') ?? "";
    const urlOther = params.get('other') ?? "";
    
    if (urlStep) {
        if(urlStep === "accountSettings"){
            router.push('accountSettings');
        }
        switch (urlStep) {
            case "CancellationOffer":
                console.log(true);
                setActiveStep("CancellationOffer");
                break;
            case "CancellationConfirmation":
                setActiveStep("CancellationConfirmation");
                break;
            case "CompetitionFeedback":
                setActiveStep("CompetitionFeedback");
                break;
            case "TutorialVideo":
                setActiveStep("TutorialVideo");
                break;
            default:
                setActiveStep("default");
                break;
        }
        setSelectedReason(urlReason);
        setOtherReason(urlOther);
        // if(duration){
        // setDuration(duration);
        // }
    }
    console.log(urlStep,urlReason,urlOther);
    },[activeStep,router]);

    // useEffect(()=>{
    //     
    // },[activeStep,router]);    

    return(
        <>
            {activeStep === "default" && <CancellationReasonModal selectedReason={selectedReason} setSelectedReason={setSelectedReason} handleBack={handleBack} handleNext={handleNext} setDuration={setDuration}/>}
            {activeStep === "CancellationOffer" && <CancellationOffer setOtherReason={setOtherReason} selectedReason={selectedReason} otherReason={otherReason} handleBack={handleBack} handleNext={handleNext} duration = {duration}/>}
            {activeStep === "CancellationConfirmation" && <CancellationConfirmation handleSubmit = {handleSubmit} handleBack = {handleBack}/>}
            {activeStep === "CompetitionFeedback" && <CompetitionFeedback handleBack = {handleBack} handleNext={handleNext}/>}
            {activeStep === "TutorialVideo" && <TutorialVideo url="https://www.youtube.com/embed/watch?v=1OAjeECW90E&list=RD1OAjeECW90E&start_radio=1" handleBack={handleBack}/>}
        </>
    )
}

export default CancellationForm;