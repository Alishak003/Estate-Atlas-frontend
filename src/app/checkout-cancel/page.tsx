'use client';

import { useRouter} from "next/navigation";
import { useEffect, useState } from "react";


export default function CheckoutCancel() {
    const [count,setCount] = useState(5);
    const router = useRouter();

     useEffect(()=>{

    count===0 &&   router.replace('/')

    const timer = setTimeout(()=>{
        setCount((prevCount)=>prevCount-1);

    },1000)
    
     return ()=>{
          clearInterval(timer);
    }

  },[count,router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">
          Your payment was not completed. You can try again later or contact support.
        </p>
        
        <a
          href="/"
          className="inline-block px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
