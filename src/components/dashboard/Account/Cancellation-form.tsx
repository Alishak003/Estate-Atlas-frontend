// components/CancellationReasonModal.js (Example)
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CancellationOffer from './cancellation-offer';
import { Card, CardContent } from '@/components/ui/card';

const reasons = [
  'It is too expensive.',
  'I am not using the service enough.',
  'I found a competitor I like better.',
  'I am temporarily pausing and will return later.',
  'Technical issues or bugs.',
];

interface ChildComponentProps {
    handleNext: ()=>void;
}

export default function CancellationReasonModal({handleNext} : ChildComponentProps) {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showOffer, setShowOffer] = useState(false);

  const onClose=()=>{
    router.push('/dashboard/Countries');
  }

  const handleSubmitReason = (e:React.FormEvent) => {
    e.preventDefault();
    setShowOffer(true);
  };
  
  // ... (JSX for the form)
  
  if (showOffer) {
    return (
      <CancellationOffer selectedReason={selectedReason} onClose={onClose} />
    );
  }

  // JSX for the reason selection form (radio buttons, etc.)
  return (
  <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
    <Card className="w-full md:max-w-3xl bg-white shadow-lg border-t-4 border-blue-500">
      <CardContent className="py-10 px-6 md:px-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          We're sorry to see you go!
        </h2>
        <p className="text-gray-600 mb-6">
          Could you tell us why you're cancelling? This helps us improve.
        </p>

        <form onSubmit={handleSubmitReason} className="space-y-6 text-left">
          <div className="space-y-3">
            {reasons.map((reason) => (
              <label
                key={reason}
                className="flex items-start space-x-3 bg-gray-100 rounded-md px-4 py-2 hover:bg-gray-200 cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-1"
                />
                <span className="text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'Other' && (
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please tell us more..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 "
              rows={4}
            />
          )}

          <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
            <button
              type="submit"
              disabled={!selectedReason}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
            >
              Continue
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md border border-gray-300 transition"
            >
              Never mind, keep my subscription
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
);

}