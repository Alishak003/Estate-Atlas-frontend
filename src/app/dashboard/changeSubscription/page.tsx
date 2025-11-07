'use client'
import { useSubscription } from "@/app/context/SubscriptionContext";
import { BillingToggle } from "@/components/Auth/Signup/BillingToggle";
import { PricingCard } from "@/components/Auth/Signup/PricingCard";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function ChangeSubscription(){
    const {subscription} = useSubscription();
    const [flagTier,setFlagTier] = useState("");
    const [isLoading,setIsLoading] = useState(true);
    const [isYearly,setIsYearly] = useState(false);
    const [flagIsYearly,setFlagIsYearly] = useState(false);
    const professionalFeatures = [
    'Global Market Analysis',
    'Rental Yield Data',
    'Average Price per Square Meter',
    'Property Tax Information',
    'Downloadable Country-Level Datasets',
    'Quarterly Market Updates'
  ];

  const enterpriseFeatures = [
    'Everything in Professional, plus:',
    'Advanced API Access',
    'Full Historical Data Downloads',
    'Market Trend Heat Maps',
    'Priority Support',
    'Team Access (Up to 5 seats)'
  ];

  useEffect(()=>{
    if(subscription){
        setFlagTier(`${subscription.tier}`);
        if(subscription.duration === "yearly"){
            setFlagIsYearly(true);
        }
        setIsLoading(false);
    }
  },[subscription])

  if(isLoading) {
    return (
      <div className="bg-gray-50 md:py-4 flex items-center justify-center">
        <Card className="w-full md:max-w-5xl bg-white shadow-lg border-0 border-t-4 border-blue-400">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading plans...</div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return(
    <>
    <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
    <section className="pt-15 pb-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
            referral={""}
            title="Professional"
            subtitle="Individual investors, analysts, and digital nomads"
            monthlyPrice={29}
            yearlyPrice={24}
            isYearly={isYearly}
            features={professionalFeatures}
            ctaText="Choose Professional"
            isPopular={true}
            plan={'basic'}
            flag_isYearly={flagIsYearly}
            flag_plan={flagTier}
            />
            <PricingCard
            referral={""}
            title="Enterprise"
            subtitle="Institutional buyers, private equity firms, and real estate agencies"
            monthlyPrice={49}
            yearlyPrice={44}
            isYearly={isYearly}
            features={enterpriseFeatures}
            ctaText="Choose Enterprise"
            isPopular={false}
            plan={'premium'}
            flag_isYearly={flagIsYearly}
            flag_plan={flagTier}
            />
        </div>
        </div>
    </section>
    </>
  )
  
}