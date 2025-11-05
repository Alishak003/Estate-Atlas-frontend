'use client';

import { useSubscription } from "@/app/context/SubscriptionContext";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChildComponentProps {
    handleBack: (stepValue:string)=>void;
}
const CancellationConfirmation = ({handleBack}:ChildComponentProps)=>{
  const token = Cookies.get('token');
  const router = useRouter();
  const {subscription} = useSubscription();
  const[isLoading,setIsLoading] =useState(false);
  const [currentEndDate,setCurrentEndDate] = useState("");

  useEffect (()=>{
    if(subscription){
      const isodate = new Date(subscription.current_period_end);
      const localedateformat = isodate.toLocaleDateString('en-US', {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      setCurrentEndDate(localedateformat);
    }
  },[subscription])

  const handleSubmit = async()=> {
    setIsLoading(true);
      try {

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/cancel`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}`}
            });

            if(!res.ok){
              console.log("error in res")
            }

            const data = await res.json();

            if(data.success){
              console.log("cancel data : ",data);
              router.push('/dashboard/Cancellation-success');
            }
      } catch (error) {
          console.log("somethins wronf i swear : ",error);
      }finally{
        setIsLoading(false);
      }
  }
    return (
        <div className="bg-gray-50 md:p-4 flex items-center justify-center">
    <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
      <CardContent className="py-10 px-6 md:px-10 min-h-[500px]">
        <Button onClick={()=>handleBack("CancellationOffer")}
        className="px-0 shadow-none text-sky-500 py-2 bg-transparent hover:bg-transparent hover:text-sky-600"
        >
         &lt; Back
        </Button>
        <h2 className="text-xl mt-3 mb-5 font-poppins font-bold">
          Are you sure you want to cancel?
        </h2>
        <p className="font-poppins pb-3">
          Your Estate Atlas subscription and all saved data will be deleted at the end of your billing cycle on <strong> {currentEndDate} </strong>. You will not be charged again.
        </p>

        

          <div className="flex flex-col md:flex-row mt-4 gap-4 pt-4">
            <Button
              onClick={()=>router.push('/dashboard/accountSettings')}
              variant="outline"
              className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 px-6 py-2.5 h-auto font-medium"
            >
              Never Mind, Keep My Subscription
            </Button>
            <Button
            onClick={handleSubmit}
            disabled={isLoading}
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 h-auto font-medium"
            >
              Confirm Cancellation
            </Button>
          </div>
      </CardContent>
    </Card>
  </div>
    )
}

export default CancellationConfirmation;