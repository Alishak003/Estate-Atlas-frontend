'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

export default function PauseSuccess() {
  const params = useParams();
  const pausedUntil = params?.pausedUntil;
  const nextBilling = params?.nextBilling;
  const router = useRouter();
  return (
    <div className="bg-gray-50 md:p-4 flex justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-sky-500">
        <CardContent className="py-10 px-6 md:px-12">
          <h1 className="text-3xl font-bold font-poppins text-sky-600 mb-4">
            ⏸️ Subscription Paused Successfully!
          </h1>

          <p className="text-gray-700 mb-6 font-poppins">
            Your subscription has been successfully paused. The pause will take effect starting from the end of your current billing cycle: <strong>{pausedUntil ??""}</strong>.  
            Your next billing cycle will resume on <strong>{nextBilling ?? ""}</strong>.
          </p>

          <p className="text-gray-700 mb-6 font-poppins">
            During the paused period, you won&apos;t be charged, and access to premium features will be temporarily suspended. When your subscription resumes, you’ll automatically regain full access to your plan.
          </p>

          <p className="text-gray-700 mb-6 font-poppins">
            Need to make adjustments or resume earlier? You can manage your subscription anytime from your account settings.
          </p>

          <p className="text-gray-500 font-poppins">
            Thank you for being a valued member of our community! If you have any questions or need assistance, our support team is here to help.
          </p>
        </CardContent>

        <CardFooter className="py-5 px-6 md:px-12">
          <Button
            onClick={()=>router.push('/dashboard/Countries')}
            variant="outline"
            className="bg-sky-500 text-white py-5 px-6 border-sky-500 hover:bg-sky-600"
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}