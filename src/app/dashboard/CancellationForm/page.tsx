'use client';

import CancellationReasonModal from "@/components/dashboard/Account/Cancellation-form";
import { useState } from "react";
type Step = 1|2|3;
const CancellationForm = ()=>{
    const[activeStep, setactiveStep] = useState<Step>(1);

    const handleBack = ()=>{
        setactiveStep((prev)=>(prev > 1 ? prev-1 as Step : prev));
    };

    // const handleNext = () => {
    //     setactiveStep((prev)=> (prev < 3 ? prev+1 as Step : prev));
    // };

    return(
        <>
            {activeStep === 1 && <CancellationReasonModal handleBack={handleBack} />}
        </>
    )
}

export default CancellationForm;