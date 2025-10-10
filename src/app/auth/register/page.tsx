"use client";
import { FAQSection } from '@/components/Auth/Signup/FAQSection';
import { FeatureComparison } from '@/components/Auth/Signup/FeatureComparison';
import { HeroSection } from '@/components/Auth/Signup/HeroSection';
import { PricingSection } from '@/components/Auth/Signup/PricingSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';


const Page = () => {
  const [isYearly, setIsYearly] = useState(false);
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const referral = params.get('code');

  console.log('referral', referral);
  if (referral) {
    localStorage.setItem('affiliate_code', referral);
  }
}, []);

  return (
   <div>
    <Navbar/>
     <div className="min-h-screen bg-white font-poppins">
      <HeroSection isYearly={isYearly} onBillingChange={setIsYearly} />
      <PricingSection isYearly={isYearly} />
      <FeatureComparison />
      <FAQSection/>
     
    </div>
    <Footer/>
   </div>
  );
};

export default Page;
