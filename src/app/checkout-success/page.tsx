'use client';

import { useRouter} from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { useSubscription } from "../context/SubscriptionContext";

export default function CheckoutSuccess() {
  const router = useRouter();
  const {setSubscription} = useSubscription();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const fetchData = async () => {
      try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/getSubscriptionContextDetails`, {
                  method: 'GET', // Or POST if you prefer
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
            });

            if(!response.ok){
              console.log("error");
            }

            const data  = await response.json();

            if(data){
              const subscriptionData = data.data.subscription;
              const subscriptionObj = {
                id: subscriptionData.id ?? "",
                price: subscriptionData.price ?? "",
                price_id: subscriptionData.price_id ?? "",
                duration: subscriptionData.duration ?? "monthly",
                tier: subscriptionData.tier ?? "none",
                current_period_end: subscriptionData.current_period_end ?? "",
                stripe_status: subscriptionData.stripe_status ?? "",
                discount: subscriptionData.discount
                  ? {
                      value_off: subscriptionData.discount.discount_value ?? 0,
                      type: subscriptionData.discount.discount_type ?? "",
                      ends_at: subscriptionData.discount.discount_ends_at ?? "",
                    }
                  : null,
                is_paused: subscriptionData.is_paused
                  ? {
                      paused_at: subscriptionData.is_paused.paused_at ?? "",
                    }
                  : null,
              };
              setSubscription(subscriptionObj); 
              Cookies.set('subscription', JSON.stringify(subscriptionObj), { expires: 7, path: '/' });
            }

          } catch (error) {
            console.log(error);
          }finally{
          router.replace('/dashboard/Countries');
          }
    };

    fetchData();
  }, [router,setSubscription]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center transition-all duration-300">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          👋 Welcome aboard!
        </h1>
        <p className="text-gray-700 mb-2">
          We&apos;re setting up your account and subscription details.
        </p>
        <p className="text-gray-500 mb-6">
          This will only take a few seconds...
        </p>
      </div>
    </div>
  );
}
