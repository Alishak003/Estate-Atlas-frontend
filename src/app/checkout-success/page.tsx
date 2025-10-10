'use client';

import { useRouter,useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default async function CheckoutSuccess() {
  const router=useRouter();
  const searchParam = useSearchParams();
  const[count,setCount] = useState(5);
  const session_id  = searchParam.get('session_id');

  if (!session_id) {
    router.replace('/');
  }

  try {


    return (
      <div>
        <h1>Thank you for your order!</h1>
        {/* Display order details */}
      </div>
    );
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    router.replace('/');
  }

  useEffect(()=>{
    if (!session_id) {
      router.replace('/'); // or show a 404 page
      return;
    }
    
    count===1 && router.replace('/dashboard/Countries');

    const timer = setTimeout(()=>{
        setCount((prevCount)=>prevCount-1);

    },500)
    
     return ()=>{
          clearTimeout(timer);
    }

  },[count,router,session_id])


  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. Your account is now active.
        </p>
        <p>
          redirecting in {count}...
        </p>
      </div>
    </div>
  );
}
