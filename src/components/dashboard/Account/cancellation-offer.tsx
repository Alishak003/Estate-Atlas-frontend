'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useSubscription } from "@/app/context/SubscriptionContext";

// components/CancellationOffer.js (Example)
interface ChildComponentProps {
    // onClose: ()=>void;
    handleBack: (stepValue:string)=>void;
    handleNext: (stepValue:string)=>void;
    selectedReason: string;
    otherReason: string;
    setOtherReason : React.Dispatch<React.SetStateAction<string>>;
    // duration: string;

}

interface Offer  {
  reason?: string;
  remedy_title?: string;
  remedy_content?: string;
  action_button_text?: string;
  action_link_type?: string;
};




const CancellationOffer = ({ handleBack, selectedReason, handleNext, otherReason, setOtherReason} : ChildComponentProps) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState("");
  const {updateSubscription,subscription} = useSubscription();
  const [offer,setOffer] = useState<Offer | null>(null);
  const token = Cookies.get('token');
  const router = useRouter();
  const [duration,setDuration] = useState("");
    const cancellationRemedies = [{
      "reason": "It is too expensive.monthly",
          "remedy_title": "Get a 30% Discount: We Want to Keep You as a Valued Client",
          "remedy_content": "We understand budget concerns! As a valued professional, We'd like to offer you an exclusive<strong> 30% discount</strong> on your current subscription for the <strong>next 3 months</strong>. This is designed to give you a financial break while you continue to access all the features you rely on.  <br/><br/> <ul class='mt-3 ml-5 list-disc'> <li><strong>Keep everything you have.</strong> No need to downgrade or lose premium features. </li><li><strong>Seamless transition.</strong> The discount applies instantly—no action needed on your part after claiming.</li></ul>",
          "action_button_text": "Keep Discount and Stay",
          "action_link_type": "discount"
        },
        {
       "reason": "It is too expensive.yearly",
          "remedy_title": "Switch To Our Monthly Plan And Save Instantly",
          "remedy_content": "We understand that yearly costs can add up! Instead of canceling, you can <strong>downgrade to our Monthly Plan at the end of your yearly billing cycle</strong> and still enjoy essential features. This option helps you stay connected to what matters most—without stretching your budget. <br/><br/> <ul class='mt-3 ml-5 list-disc'> <li><strong>No interruption.</strong> Your account and data remain intact during the switch.</li></ul>",
          "action_button_text": "Downgrade to Monthly Plan",
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
      "action_button_text": "Submit FeedBack & Continue",
      "action_link_type": "survey" 
    },
    {
      "reason": "I'm experiencing technical issues or bugs.",
      "remedy_title": "Let Us Fix It For You",
      "remedy_content": "We sincerely apologize. Our commitment is to provide accurate and reliable data. Please let our <strong>priority support team</strong> resolve this for you immediately.",
      "action_button_text": "Contact Priority Support",
      "action_link_type": "tech_support"
    },
    {
      "reason": "I can't find the data I need.",
      "remedy_title": "Our Data is Our Mission. Let Us Help.",
      "remedy_content": "We're sorry you couldn't find what you needed. Our data is our mission. Let our <strong>analysts know what you're looking for</strong>. We're constantly adding new features and markets.",
      "action_button_text": "Request a Market/Data Point",
      "action_link_type": "request_data"
    },
    {
      "reason": "Other",
      "remedy_title": "Just One More Question Before You Go.",
      "remedy_content": "We respect your decision. Your honest feedback helps us improve more than anything else. Please share any final thoughts or a specific reason for leaving below.",
      "action_button_text": "Submit Feedback & Continue",
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
      "remedy_content": "We’re really sorry to hear that you’ve had a hard time getting comfortable with the platform. You’re not alone — many professionals find that a quick <strong>1-on-1 walkthrough</strong> makes all the difference.<br/><br/>We’d love to personally show you how to get the most out of your subscription. <br/><br/><ul class='mt-3 ml-5 list-disc'><li><strong>Access quick tutorials.</strong> Learn step-by-step at your own pace with short videos and guides.</li></ul>",
      "action_button_text": "Watch our Demo Tutorial",
      "action_link_type": "support"
    }


  ];
  

  useEffect(()=>{
    console.log("entered effect");
    if(selectedReason === 'It is too expensive.'){
      console.log("reason found");
      if(subscription){
      console.log("subscription found : ",subscription);
        setDuration(subscription.duration);
        console.log(`${selectedReason}.${subscription.duration}`);
        const found = cancellationRemedies.find(
          (item) => item.reason === `${selectedReason}${subscription.duration}`
        );
        console.log("found : ",found);
        setOffer(found || null);
      }
    }else {
      const found = cancellationRemedies.find(
        (item) => item.reason === selectedReason
      );
      setOffer(found || null);
    }
  },[subscription,duration,selectedReason])
  
  const isSingleButtonFlow = ['survey','other_feedback'].includes(offer?.action_link_type ?? "");
  
  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    handleNext("CancellationConfirmation");
    setIsCancelling(false);
  };
  
  // This function handles accepting the offer
  const handleAcceptOffer = async () => {
    setError("");
    if(offer){
      setIsLoading(true);
      switch (offer.action_link_type) {
        case "discount":
          try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/apply-discount`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}`},
              body: JSON.stringify({ promo_code: 'RETENTION_30_OFF_3MO' }),
            });

            if(!res.ok){
              console.log("error in res")
            }

            const data = await res.json();
            console.log("discount data : ",data);
            if(data.success){ 
              window.location.href = "/dashboard/discount-success";
              updateSubscription({
                ...subscription,
                discount:{
                  value_off:30,
                  type:"percentage",
                  ends_at:""
                }
              })
            }else{
            console.log("data : ",data);
              window.location.href = "/dashboard/discount-failed";
            }

          } catch (error) {
            console.log("eror went wrong : ",error);
          }
          setIsLoading(false);
          break;
        
        case "downgrade":
          try {
            
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/subscription/update`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ price_slug: "monthly" }),
              }
            );

            const data = await res.json();
            console.log('api data',data);
            if (!res.ok) {
            setError("Failed to update subscription: " + data?.message);
            } else {
              router.push('/dashboard/downgrade-success');
            }
          } catch (err) {
            console.error("Error updating subscription:", err);
            setError("Error updating subscription: " + err);
          } 
          break;
        
        case "pause":
          try {
            const res = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/subscription/pause`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              }

            });
            const data = await res.json();

            if(!res.ok){
              console.log(data.message);
            }

            if (data.success) {
              const url = `/dashboard/pause-success`;
              router.push(url);
            }
          } catch (error) {
            console.log('cathc error : ', error)
          }
          setIsLoading(false);
          break;

        case "survey":
          handleNext("CompetitionFeedback");
          break;

        case "tech_support":
          router.push('/dashboard/support');
          break;
        
        case "request_data":
          router.push('/Contact');
          break;
        
        case "other_feedback":
          setIsCancelling(true);
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-competition-feedback-form`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
                body: JSON.stringify({
                  'reason':'other',
                  'desired_features':null,
                  'other_feedback':otherReason,
                }),
            })

            const data = await res.json();

            if(!res.ok){
                setError(data.message || 'unable to submit form. Redirecting to confirmation page');
                setTimeout(()=>setError(""),5000)
            }
            if(data.success){
                handleNext("CancellationConfirmation");
            }else{
                console.log(data);
                setError(data.message || 'unable to submit form. Redirecting to confirmation page');
            }
          } catch (error) {
            console.log(error);
            setError("something went wrong");
          }finally{
            setIsCancelling(false);
          }
          break;

        case "support":
          handleNext("TutorialVideo");
          break;
          
        default:
          break;
      }
    setIsLoading(false);
  }
}
  if (!offer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading subscription details...</p>
      </div>
    );
  }

  return (
  <div className="bg-gray-50 md:p-4 flex items-center justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
      
      <CardContent className=" py-10 px-6 md:px-12 min-h-[500px]">

        <Button onClick={()=>handleBack("default")}
        className="px-0 shadow-none text-sky-500 py-2 bg-transparent hover:bg-transparent hover:text-sky-600"
        >
         &lt; Back
        </Button>
        <h2 className="text-xl mt-3 mb-5 font-poppins font-semibold">{offer?.remedy_title}</h2>

        {/* <p className="text-slate-700 font-semibold font-poppins pt-3 pb-1">{offer?.remedy_title}</p> */}
        <p className="text-slate-700 mb-6" dangerouslySetInnerHTML={{ __html: offer?.remedy_content ?? ""}}></p>
        {error && <p className="text-red-500 font-poppins mt-3">{error}</p>}
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
              {isCancelling ? 'Submitting...' : 'No Thanks, Continue to Cancel.'}
            </Button>
        </div>
            }
          {isSingleButtonFlow && 
          <Button
              onClick={handleAcceptOffer}
              disabled={isCancelling || (offer?.action_link_type === "other_feedback" && !otherReason)}
              className={`mt-3 px-6 py-2.5 h-auto font-medium rounded-md
              ${isCancelling
                ? 'bg-sky-500 text-white cursor-not-allowed border-sky-500'
                : 'bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600'
              }`}
            >
              {isCancelling ? 'Submitting...' : offer?.action_button_text}
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