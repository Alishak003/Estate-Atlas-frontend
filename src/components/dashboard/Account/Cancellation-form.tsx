// components/CancellationReasonModal.js (Example)
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';


const reasons = [
  'It is too expensive.',
  'I am not using the service enough.',
  'I found a competitor I like better.',
  "I can't find the data I need.",
  "I'm experiencing technical issues or bugs.",
  'My project/investment is finished.',
  'The platform is too difficult to use.',
  'Other',
];

interface ChildComponentProps {
    handleBack : (stepValue:string)=>void,
    handleNext : (stepValue:string)=>void

    setSelectedReason : React.Dispatch<React.SetStateAction<string>>;
    setDuration : React.Dispatch<React.SetStateAction<string>>;
    selectedReason: string;
}

export default function CancellationReasonModal({handleNext,handleBack, selectedReason, setSelectedReason, setDuration}: ChildComponentProps) {
  const router = useRouter();
  const[loading,setLoading] = useState(false);
  const token = Cookies.get('token');
  // const [otherReason, setOtherReason] = useState('');

  const onClose=()=>{
    router.push('/dashboard/Countries');
  }

  const handleSubmitReason = async(e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
      if(selectedReason === "It is too expensive."){
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/plan`,{
                method:"GET",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();

            if(!res.ok){
                console.log("error");
                // setErrors(["error fetching current plan data."]);
                // setSuccess(false);
            }else{
                const {duration} = data.data ?? "";
                setDuration(duration);
                console.log("duration:",duration);
            }
        setLoading(false);
        handleNext("CancellationOffer");
      }else{
        setLoading(false);
        handleNext("CancellationOffer");
      }
      setLoading(false);
  };


  

  // JSX for the reason selection form (radio buttons, etc.)
  return (
  <div className="bg-gray-50 md:p-4 flex items-center justify-center">
    <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
      <CardContent className="py-10 px-6 md:px-10">
        <Button onClick={()=>handleBack("AccountSettings")}
        className="px-0 shadow-none text-sky-500 py-2 bg-transparent hover:bg-transparent hover:text-sky-600"
        >
         &lt; Back
        </Button>
        <h2 className="text-2xl mb-2 font-poppins font-bold text-center">
          We&apos;re sorry to see you go!
        </h2>
        <p className="font-poppins text-center pb-3">
          Before you leave, we&apos;d love to know why. Your feedback helps us improve our service for everyone.
        </p>

        <form onSubmit={handleSubmitReason} className="space-y-6 text-left">
          <div className="space-y-3 pt-5 overflow-y-scroll md:max-h-[250px]">
            {reasons.map((reason) => (
              <label
                key={reason}
                className="flex items-start space-x-3 bg-gray-100 rounded-md px-4 py-2 hover:bg-gray-200 cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-1"
                />
                <span className="text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 px-6 py-2.5 h-auto font-medium"
            >
              Keep my subscription
            </Button>
            <Button
              type="submit"
              disabled={!selectedReason || loading}
              className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2.5 h-auto font-medium"
            >
              {loading ? 'Loading...' : 'Continue'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
);

}