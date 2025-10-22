'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

// components/CancellationOffer.js (Example)
interface ChildComponentProps {
    onClose: ()=>void;
    handleBack: ()=>void;
    selectedReason: string;
}
const CancellationOffer = ({ onClose, handleBack, selectedReason} : ChildComponentProps) => {
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Dynamic Offer based on reason
  const offer = selectedReason.includes('expensive') 
    ? { text: 'Get 50% off your next 3 months to stay?', action: 'Apply Discount' }
    : { text: 'Pause your account for 3 months instead of cancelling?', action: 'Pause Account' };

  // This function handles the final cancellation API call to Laravel
  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    // ⚠️ This is the final API call to your Laravel endpoint
    // const response = await fetch('/api/cancel-subscription', {
    //     method: 'POST',
    //     body: JSON.stringify({ 
    //         subscription_id: subscriptionId, 
    //         final_decision: 'cancelled',
    //         reason: selectedReason 
    //     }),
    //     // ... headers
    // });
    // ... handle success/failure and close modal
    onClose();
  };
  
  // This function handles accepting the offer
  const handleAcceptOffer = async () => {
    // ⚠️ Call a separate Laravel endpoint (e.g., /api/accept-offer) 
    // to apply the coupon or schedule the pause.
    // ... handle API call
    onClose();
  };

  return (
  <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
    <Card className="w-full md:max-w-3xl bg-white shadow-lg border-t-4 border-blue-500">
      <CardContent className="flex flex-col justify-center items-center py-10 px-6 md:px-12 text-center min-h-[500px]">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Wait! Before you go...
        </h3>

        <p className="text-gray-700 mb-6">{offer.text}</p>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center">
          <button onClick={handleBack}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
          >
            Back
          </button>
          <button
            onClick={handleAcceptOffer}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition"
          >
            {offer.action} and Keep Access
          </button>

          <button
            onClick={handleConfirmCancel}
            disabled={isCancelling}
            className={`px-6 py-2 rounded-md border border-gray-300 text-gray-700 transition ${
              isCancelling
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isCancelling ? 'Finalizing...' : 'No thanks, continue to cancel'}
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
);


}

export default CancellationOffer;