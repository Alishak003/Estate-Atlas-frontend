"use client";
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';


interface PricingCardProps {
  title: string;
  subtitle: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isYearly: string | boolean;
  features: string[];
  ctaText: string;
  isPopular: boolean;
  plan: 'basic' | 'premium';
  referral: string;
  flag_plan: string;
  flag_isYearly:string | boolean;
}

export const PricingCard = ({
  title,
  subtitle,
  monthlyPrice,
  yearlyPrice,
  isYearly,
  features,
  ctaText,
  isPopular,
  plan,
  referral,
  flag_isYearly,
  flag_plan,
}: PricingCardProps) => {
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const billedAmount = isYearly ? yearlyPrice * 12 : monthlyPrice;
  
 const router = useRouter();
 const handleClick = () => {
  // const referral = localStorage.getItem("affiliate_code");
  const isLoggedIn = !!flag_plan; // if flag_plan exists, user has a subscription
  const basePath = isLoggedIn ? "/subscription/update" : "/auth/subscribe";
  
  let url = `${basePath}?plan=${plan}&isYearly=${isYearly}`;
  
  if (referral) url += `&ref=${referral}`;
  
  router.push(url);
  };

  const isCurrentPlan = flag_plan === plan && flag_isYearly === isYearly;


  return (
    <div className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-[#3BA1DF] shadow-lg scale-105' : 'border-slate-200 hover:border-slate-300'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#3BA1DF] text-white px-4 py-2 rounded-full text-sm font-poppins font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="font-poppins font-bold text-2xl text-slate-900 mb-2"> {isCurrentPlan ? "Current Plan" : title}</h3>
        <p className="font-poppins text-slate-600 text-sm mb-6">{subtitle}</p>
        
        <div className="mb-4">
          <span className="font-poppins font-bold text-4xl text-slate-900">${currentPrice}</span>
          <span className="font-poppins text-slate-600 ml-2">/ month</span>
        </div>
        
        {isYearly && (
          <p className="font-poppins text-sm text-slate-500">
            Billed as ${billedAmount} annually
          </p>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="font-poppins text-slate-700 text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
      disabled = {isCurrentPlan}
      onClick={handleClick}
        className={`w-full font-poppins font-medium py-3 rounded-lg transition-all duration-200 ${
          isPopular 
            ? 'bg-primary hover:bg-primary/80t text-white' 
            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border cursor-pointer border-slate-300'
        }`}
      >
        {ctaText}
      </Button>
    </div>
  );
};