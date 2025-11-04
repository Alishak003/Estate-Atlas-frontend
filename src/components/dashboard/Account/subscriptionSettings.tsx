"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { useUser } from "@/app/context/UserContext"
import Cookies from 'js-cookie';
import { Circle } from 'lucide-react';
import { useRouter } from "next/navigation"
import { useSubscription } from "@/app/context/SubscriptionContext"


const SubscriptionSettings=()=>{
    const router = useRouter();
    // const {user} = useUser();
    const {subscription} = useSubscription();
    const [price,setPrice] = useState(0);
    const [accountStatus,setAccountStatus] = useState("");
    const [resumeDate,setResumeDate] = useState("");
    const [endsAt,setEndsAt] = useState("");


    // const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true);
    // const [success, setSuccess] = useState(false)

    useEffect(()=>{
        if(subscription){
            console.log(subscription);
            const originalPrice = Number(subscription.price);
            let discountedPrice = originalPrice;
            if (subscription?.discount) {
                const { value_off, type } = subscription.discount;
                if (type === "amount" && value_off) {
                    discountedPrice = Math.max(originalPrice - value_off, 0);
                } else if (type === "percentage" && value_off) {
                    discountedPrice = originalPrice - (originalPrice * value_off) / 100;
                }
                console.log(discountedPrice);
                console.log(value_off);
                console.log(type);
            }
            

            let resumeDate = "";
            let current_period_end = "";

            if (subscription.is_paused && subscription.is_paused.paused_at) {
                const isodate = new Date(subscription.is_paused.paused_at);
                isodate.setMonth(isodate.getMonth() + 3);
                resumeDate = isodate.toLocaleDateString('en-US', {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
            }
            const isodate = new Date(subscription.current_period_end);
            current_period_end = isodate.toLocaleDateString('en-US', {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            const currStatus = subscription.is_paused ? "paused" : subscription.stripe_status ?? "unknown";

            setAccountStatus(currStatus);
            setResumeDate(resumeDate);
            setEndsAt(current_period_end);
            setPrice(discountedPrice);
            setIsLoading(false);
        }
    },[subscription])


    const handleChangeSubscription= ()=>{
        router.push('/auth/register');
    }

    const handleResumeSubscription = async () => {
    setIsLoading(true);
    try {
        const token = Cookies.get('token');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });

        const data = await res.json();

        if (res.ok) {
            console.log('Subscription resumed:', data.subscription);
            alert('Subscription resumed successfully!');
            try {
                const userData = {
                    'user_data':"",
                    'user_data.email':data?.email || "",
                    'user_data.first_name':data?.first_name || "",
                    'user_data.stripe_id':data?.stripe_id || "",
                    'user_data.id':data?.user_id || "",
                }
                const price_slug = `${subscription?.tier ?? ""}${subscription?.duration ?? ""}`;
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,{
                    method: 'POST',
                    headers:{
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    },
                    body: JSON.stringify({
                    price_slug:price_slug,
                    user_data : userData
                    })
                }); 

                const checkoutData = await response.json();
                if (response.ok && checkoutData.url) {
                    window.location.href = checkoutData.url;
                }
                else{
                    console.log(checkoutData .message || "Checkout session creation failed. Kindly login to try again");
                } 
                } catch (error) {
                    console.error('Checkout error:', error);
                    router.push('/auth/login');
                }
        } else {
            console.error('Failed to resume:', data.message);
            alert('Error: ' + data.message);
        }
        } catch (error) {
            console.error('Network or server error:', error);
            alert('Something went wrong while resuming the subscription.');
        }finally{
            setIsLoading(false);
        }
    };


    const handleOpenFunnel= ()=>{
        router.push('/dashboard/CancellationForm')
    }
    if (isLoading) {
    return (
      <div className="bg-gray-50 md:py-4 flex items-center justify-center">
        <Card className="w-full md:max-w-5xl bg-white shadow-lg border-0 border-t-4 border-blue-400">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading Subscription data...</div>
          </CardContent>
        </Card>
      </div>
    )
    }
    return (
        <div className="bg-gray-50 flex items-center justify-center md:py-4 ">
          <Card className="w-full md:max-w-5xl bg-white shadow-lg border-0 border-t-4 border-blue-400">
            <CardHeader className="text-center">
              <CardTitle className="flex gap-2 text-2xl font-semibold text-gray-700">
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 text-gray-700">
                        <span className="font-medium font-semibold">Current Plan</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                        <div className="border rounded-lg py-5 px-4 border-gray-400">
                            <div className="space-y-2">
                                <div className="md:flex justify-between items-center">
                                <p className="text-gray-500 text-sm capitalize">
                                {subscription?.tier} {subscription?.duration} Subscription
                                </p>
                                <button className={`text-xs px-3 flex items-center py-1 rounded-full border font-semibold ${(accountStatus === 'active') ? ('bg-green-200 text-green-800 border-green-500') : (accountStatus === "paused") ? ('bg-yellow-200 text-yellow-800 border-yellow-500'):('bg-red-200 text-red-800 border-red-500')}`}> 
                                {(accountStatus === 'active') ? (
                                <Circle size={8} color="green" fill="green" />
                                ) : (accountStatus === "paused") ? (
                                <Circle size={8} color="orange" fill="orange" />
                                ) : (
                                <Circle size={8} color="red" fill="red" />
                                )}

                                    <span className="ps-1">{accountStatus}</span>
                                </button>
                                </div>

                                <h2 className="text-gray-700 font-semibold text-xl">
                                    ${price}/{subscription?.duration == "monthly" ? 'Month' : 'Year'}
                                </h2>
                            </div>
                           
                        </div>
                        <div className="border rounded-lg py-5 px-4 border-gray-400">
                            <div className="space-y-2">
                                <p className="text-gray-500 text-sm">
                                {accountStatus === "active" ? ("Renewal date") : accountStatus === "paused" ? ('Current cycle Ends at'): "Ended at"}
                                </p>
                                <h1 className="text-gray-700 font-semibold text-xl">
                                    {endsAt}
                                </h1>
                                
                            </div>
                            
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-500 text-xs">
                            {accountStatus === "paused" ? (`Note : Account will automatically Resume from ${resumeDate}`) : ("")}
                        </p>        
                    </div>

                    {/* {errors.length > 0 && (
                        <Alert variant="destructive">
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1">
                            {errors.map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                            ))}
                            </ul>
                        </AlertDescription>
                        </Alert>
                    )} */}
            
                    {/* {success && (
                        <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">
                            Subscription updated successfully!
                        </AlertDescription>
                        </Alert>
                    )} */}
                    {accountStatus !== "paused" && <>
                    <Button
                            type="button"
                            variant="outline"
                            onClick={handleChangeSubscription}
                            disabled={isLoading}
                            className="bg-sky-500 hover:bg-sky-400 text-white border-sky-500 hover:border-sky-400 px-6 py-2.5 h-auto font-medium md:mr-2"
                        >
                            Change subscription
                        </Button>
                    
                        <Button
                        type="button"
                        variant="outline"
                        onClick={handleOpenFunnel}
                        disabled={isLoading}
                        className="hover:bg-gray-400 hover:text-white border-gray-400 hover:border-gray-400 px-6 py-2.5 h-auto font-medium mx-2"
                        >
                        Cancel Subscription
                    </Button>
                    </>}
                    {accountStatus === "paused" &&
                    <Button
                            type="button"
                            variant="outline"
                            onClick={handleResumeSubscription}
                            disabled={isLoading}
                            className="bg-green-500 hover:bg-green-400 text-white border-green-500 hover:border-green-400 px-6 py-2.5 h-auto font-medium md:mr-2"
                    >
                            Resume Subscripiton
                    </Button>
                    }
                    
                </div>
            </CardContent>
          </Card>
        </div>
      )
}

export default SubscriptionSettings;