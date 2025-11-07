'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/app/context/SubscriptionContext";
import { useEffect, useState } from "react";


export default function DowngradeSuccess() {
  const {subscription} = useSubscription();
  const [effectDate,setEffectDate] = useState("");
  useEffect(()=>{
    if(subscription){
      const isodate = new Date(subscription.current_period_end);
      const endsAt = isodate.toLocaleDateString('en-US', {
          year: "numeric",
          month: "long",
          day: "numeric"
      });
      setEffectDate(endsAt ?? "End of Current Billing Cycle");
    }
  },[subscription])

  if(!effectDate){
    return (
      <div className="bg-gray-50 md:p-4 flex items-center justify-center">
        <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading user data...</div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="bg-gray-50 md:p-4 flex justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-green-500">
        <CardContent className="py-10 px-6 md:px-12">
          <h1 className="text-3xl font-bold font-poppins text-green-600 mb-4">
            🎉 Plan Downgrade Successful!
          </h1>

          <p className="text-gray-700 mb-6 font-poppins">
            Great news! Your subscription has been successfully downgraded to our<strong> Monthly Plan</strong>. 
            This change will take effect starting from <strong>{effectDate}</strong>. 
            You can continue enjoying all the essential features you love, now with a simpler plan that better fits your needs.
          </p>

          <p className="text-gray-700 mb-6 font-poppins">
            We understand that sometimes plans need to change,  and we&apos;re happy to accommodate your new plans. Even on the Monthly Plan, you&apos;ll still have access to key tools and resources to help you stay productive and get the most out of your subscription.
          </p>

          <p className="text-gray-700 mb-6 font-poppins">
            Remember, you can always upgrade again in the future if your needs grow or if you want to explore premium features. Our team is always here to support you along the way.
          </p>

          <p className="text-gray-500 font-poppins">
            Thank you for being a valued member of our community! If you have any questions, concerns, or just want to chat about your plan, our support team is just a click away.
          </p>
        </CardContent>
        <CardFooter className="py-5 px-6 md:px-12">
          <Button
            variant="outline"
            className="bg-green-500 text-white py-5 px-6 border-green-500 hover:bg-green-600"
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

