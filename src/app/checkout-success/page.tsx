'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [count, setCount] = useState(5);
  const session_id = searchParams.get('session_id');

  useEffect(() => {
    if (!session_id) {
      router.replace('/');
      return;
    }

    if (count === 1) {
      router.replace('/dashboard/Countries');
      return;
    }

    const timer = setTimeout(() => {
      setCount((prevCount) => prevCount - 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [count, router, session_id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. Your account is now active.
        </p>
        <p>
          Redirecting in {count}...
        </p>
      </div>
    </div>
  );
}
