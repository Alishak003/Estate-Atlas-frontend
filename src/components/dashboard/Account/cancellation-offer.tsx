'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import Cookies from 'js-cookie';

// components/CancellationOffer.js (Example)
interface ChildComponentProps {
    // onClose: ()=>void;
    handleBack: ()=>void;
    handleNext: ()=>void;
    selectedReason: string;
    otherReason: string;
    setOtherReason : React.Dispatch<React.SetStateAction<string>>;
    duration: string;

}
const CancellationOffer = ({ handleBack, selectedReason, handleNext, otherReason, setOtherReason, duration} : ChildComponentProps) => {

  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cancellationRemedies = [
    {
      "reason": "It is too expensive.monthly",
      "remedy_title": "Get 30% Discount: We Want to Keep You as a Valued Professional",
      "remedy_content": "We understand budget concerns! We understand. As a valued professional, We'd like to offer you an <strong>exclusive 30% discount</strong> on your current subscription for the next <strong>3 months</strong>. This is our best retention offer, designed to give you a financial break while you continue to access all the features you rely on.  <br/><br/> <ul class='mt-3 ml-5 list-disc'> <li><strong>Keep everything you have.</strong> No need to downgrade or lose premium features. </li><li><strong>Seamless transition.</strong> The discount applies instantly—no action needed on your part after claiming.</li></ul>",
      "action_button_text": "Keep Discount and Stay",
      "action_link_type": "discount"
    },
    {
      "reason": "It is too expensive.yearly",
      "remedy_title": "Switch to Our Basic Plan and Save Instantly",
      "remedy_content": "We understand that yearly costs can add up! Instead of canceling, you can <strong>downgrade to our Basic Plan</strong> and still enjoy essential features at a lower cost. This option helps you stay connected to what matters most—without stretching your budget. <br/><br/> <ul class='mt-3 ml-5 list-disc'> <li><strong>Lower monthly cost.</strong> Keep using our core features while saving money.</li><li><strong>No interruption.</strong> Your account and data remain intact during the switch.</li></ul>",
      "action_button_text": "Downgrade to Basic",
      "action_link_type": "downgrade"
    },

    {
      "reason": "I am not using the service enough.",
      "remedy_title": "Pause Your Account, Don't Lose It",
      "remedy_content": "No problem. Instead of canceling, you can <strong>pause your subscription for up to 3 months</strong>. Your data and portfolios will be waiting for you when you return.",
      "action_button_text": "Pause My Subscription",
      "action_link_type": "pause"
    },
    {
      "reason": "I found a competitor I like better.",
      "remedy_title": "Help Us Improve!",
      "remedy_content": "We're sorry to hear that. To help us improve, could you tell us what the competitor offers that we don't? <strong>[Link to a short 3-question feedback survey]</strong> We may have a feature coming soon that meets your needs.",
      "action_button_text": "Submit FeedBack & Cancel",
      "action_link_type": "survey" 
    },
    {
      "reason": "I'm experiencing technical issues or bugs.",
      "remedy_title": "Let Us Fix It For You",
      "remedy_content": "We sincerely apologize. Our commitment is to provide accurate, reliable data. Please let our <strong>priority support team</strong> resolve this for you immediately.",
      "action_button_text": "Contact Priority Support",
      "action_link_type": "tech_support"
    },
    {
      "reason": "I can't find the data I need.",
      "remedy_title": "Our Data is Our Mission. Let Us Help.",
      "remedy_content": "We're sorry you couldn't find what you needed. Our data is our mission. Let our <strong>analysts know what you're looking for</strong>. We're constantly adding new markets.",
      "action_button_text": "Request a Market/Data Point",
      "action_link_type": "request_data"
    },
    {
      "reason": "Other",
      "remedy_title": "Just One More Question Before You Go.",
      "remedy_content": "We respect your decision. Your honest feedback helps us improve more than anything else. Please share any final thoughts or a specific reason for leaving below.",
      "action_button_text": "Submit Feedback & Cancel",
      "action_link_type": "other_feedback"
    },
    {
      "reason": "My project/investment is finished.",
      "remedy_title": "Success! Pause Your Account Until the Next Project",
      "remedy_content": "Congratulations on finishing your project — that's a great milestone! 🎉<br/><br/>You don’t need to cancel your subscription completely. You can <strong>pause your account for up to 3 months</strong> and easily resume when your next project begins. <br/><br/> <ul class='mt-3 ml-5 list-disc'> <li><strong>Keep all your data and settings.</strong> Nothing will be lost — everything will be waiting for you when you return.</li><li><strong>No extra setup later.</strong> Pick up right where you left off, seamlessly.</li></ul>",
      "action_button_text": "Pause My Subscription",
      "action_link_type": "pause"
    },
    {
      "reason": "The platform is too difficult to use.",
      "remedy_title": "Let Us Walk You Through It — 1-on-1 Help Available",
      "remedy_content": "We’re really sorry to hear that you’ve had a hard time getting comfortable with the platform. You’re not alone — many professionals find that a quick <strong>1-on-1 walkthrough</strong> makes all the difference.<br/><br/>We’d love to personally show you how to get the most out of your subscription. <br/><br/><ul class='mt-3 ml-5 list-disc'><li><strong>Book a free 15-minute demo.</strong> A real human will guide you through your setup and workflows.</li><li><strong>Access quick tutorials.</strong> Learn step-by-step at your own pace with short videos and guides.</li></ul>",
      "action_button_text": "Watch our Demo Tutorial",
      "action_link_type": "support"
    }


  ];

  const offer = cancellationRemedies.find(
    (item) => item.reason === `${selectedReason}${duration}`
  )

  const isSingleButtonFlow = ['survey','other_feedback'].includes(offer?.action_link_type ?? "");
  
  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    handleNext();
    setIsCancelling(false);
  };
  
  // This function handles accepting the offer
  const handleAcceptOffer = async () => {
    if(offer){
      if(offer.action_link_type == "discount"){
        setIsLoading(true);
        try {
          const token = Cookies.get('token');

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/apply-discount`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({ promo_code: 'RETENTION_30_OFF_3MO' }),
          });

          if(!res.ok){
            console.log("error in res")
          }

          const data = await res.json();
          console.log("data : ",data);
        } catch (error) {
          console.log("eror went wrong : ",error);
        }
        setIsLoading(false);
      }
    }
  };

  return (
  <div className="bg-gray-50 md:p-4 flex items-center justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
      
      <CardContent className=" py-10 px-6 md:px-12 min-h-[500px]">
        <Button onClick={handleBack}
        className="px-0 shadow-none text-sky-500 py-2 bg-transparent hover:bg-transparent hover:text-sky-600"
        >
         &lt; Back
        </Button>
        <h2 className="text-xl mt-3 mb-5 font-poppins font-semibold">{offer?.remedy_title}</h2>
        {/* <p className="text-slate-700 font-semibold font-poppins pt-3 pb-1">{offer?.remedy_title}</p> */}
        <p className="text-slate-700 mb-6" dangerouslySetInnerHTML={{ __html: offer?.remedy_content ?? ""}}></p>
        {offer?.reason === "Other" && 
        <textarea
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      placeholder="Please tell us more..."
                      className="w-full border border-gray-300 rounded-md px-4 py-2 "
                      rows={4}
                    />
        }
          {!isSingleButtonFlow &&

        <div className="flex-col md:flex-row gap-4 w-full md:w-auto pt-5">
          <Button
            onClick={handleAcceptOffer}
            disabled={isLoading}
            className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 px-6 py-2.5 h-auto font-medium"
          >
            {offer?.action_button_text}
          </Button>
            <Button
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className={`px-6 py-2.5 h-auto font-medium rounded-md md:ml-4 
              ${isCancelling
                ? 'bg-slate-500 text-white cursor-not-allowed border-slate-500'
                : 'bg-slate-500 hover:bg-slate-600 text-white border-slate-500 hover:border-slate-600'
              }`}
            >
              {isCancelling ? 'Finalizing...' : 'No Thanks, Continue to Cancel.'}
            </Button>
        </div>
            }
          {isSingleButtonFlow && 
          <Button
              onClick={handleConfirmCancel}
              disabled={isCancelling || (offer?.action_link_type === "other_feedback" && !otherReason)}
              className={`mt-3 px-6 py-2.5 h-auto font-medium rounded-md
              ${isCancelling
                ? 'bg-sky-500 text-white cursor-not-allowed border-sky-500'
                : 'bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600'
              }`}
            >
              {isCancelling ? 'Finalizing...' : offer?.action_button_text}
            </Button>
          }

      </CardContent>
      <CardFooter>
        
      </CardFooter>
    </Card>
  </div>
);


}

export default CancellationOffer;