"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useUser } from "@/app/context/UserContext"
import Cookies from 'js-cookie';
import { Circle, Route } from 'lucide-react';
import { useRouter } from "next/navigation"

interface PlanData {
    id:string;
    name:string;
    price:string;
    status:string;
    renewalDate:string;
    duration:string
}

const SubscriptionSettings=()=>{
    const router = useRouter();
    const {user} = useUser();
    const [plan,setPlan] = useState<Omit<PlanData, 'id'>>({
        name:"",
        price:"",
        status:"",
        renewalDate:"",
        duration:""
    })

    const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    useEffect(()=>{
        console.log("in");
        if(!user || !user.id){
            return;
        }
        console.log("pass");

        const fetchPlan = async ()=>{
            setIsLoading(true);
            console.log(user);
            const token = Cookies.get('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/plan`,{
                method:"GET",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();

            if(!res.ok){
                console.log("error");
                setErrors(["error fetching current plan data."]);
                setSuccess(false);
            }else{
                console.log(data.data);
                const {name,price,renewalDate,status,duration} = data.data;
                setPlan({
                    name:name ?? "",
                    status:status ?? "",
                    price: String(price) ?? "",
                    renewalDate: renewalDate?? "",
                    duration:duration??""
                });
            }
            setIsLoading(false);
        }
        fetchPlan();

    },[user])

    useEffect(()=>{
        console.log(plan);
    },[plan])


    const handleChangeSubscription= ()=>{

    }

    const handleOpenFunnel= ()=>{

        router.push('/dashboard/CancellationForm')
    }
    if (isLoading) {
    return (
      <div className="bg-gray-50 md:p-4 flex items-center justify-center">
        <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading Subscription data...</div>
          </CardContent>
        </Card>
      </div>
    )
    }
    return (
        <div className="bg-gray-50 flex items-center justify-center md:p-4 ">
          <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
            <CardHeader className="text-center">
              <CardTitle className="flex gap-2 text-2xl font-semibold text-gray-700">
                Manage Subscription
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
                                <p className="text-gray-500 text-sm">
                                {plan.name}
                                </p>
                                <button className={`text-xs px-3 flex items-center py-1 rounded-full border font-semibold ${plan.status === 'active' ? 'bg-green-200 text-green-800 border-green-500':'bg-red-200 text-red-800 border-red-500'}`}> 
                                    {plan.status === 'active'?<Circle size={8} color="green" fill="green" /> : <Circle size={8} color="red" fill="red" />}
                                    <span className="ps-1">{plan.status}</span>
                                </button>
                                </div>

                                <h2 className="text-gray-700 font-semibold text-xl">
                                    ${plan.price}/{plan.duration == "monthly" ? 'Month' : 'Year'}
                                </h2>
                            </div>
                           
                        </div>
                        <div className="border rounded-lg py-5 px-4 border-gray-400">
                            <div className="space-y-2">
                                <p className="text-gray-500 text-sm">
                                Renewal date
                                </p>
                                <h1 className="text-gray-700 font-semibold text-xl">
                                    {plan.renewalDate}
                                </h1>
                                
                            </div>
                        </div>
                    </div>


                    {errors.length > 0 && (
                        <Alert variant="destructive">
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1">
                            {errors.map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                            ))}
                            </ul>
                        </AlertDescription>
                        </Alert>
                    )}
            
                    {success && (
                        <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">
                            Subscription updated successfully!
                        </AlertDescription>
                        </Alert>
                    )}
                    <Button
                            type="button"
                            variant="outline"
                            onClick={handleChangeSubscription}
                            disabled={isLoading}
                            className="bg-green-500 hover:bg-green-400 text-white border-green-500 hover:border-green-400 px-6 py-2.5 h-auto font-medium mx-2"
                        >
                            Change plan
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
                </div>
            </CardContent>
          </Card>
        </div>
      )
}

export default SubscriptionSettings;