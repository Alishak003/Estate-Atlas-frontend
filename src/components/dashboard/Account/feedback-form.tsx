'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Cookies from 'js-cookie';


import { useState } from "react"

interface ChildComponentProps {
    handleBack: (stepValue:string)=>void;
}

export const FeedbackForm =({handleBack}:ChildComponentProps)=>{
    const token = Cookies.get('token'); 
    const [formData,setFormData] = useState ({
        reason:"",
        desired_features:"",
        other_feedback:""
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error,setError] = useState("");

    const handleChange = (field:string , value:string) => {
        setFormData((prev)=>({...prev, [field]:value}));
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-competition-feedback-form`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
                body: JSON.stringify(formData),
            })

            const data = await res.json();

            if(!res.ok){
                setError(data.message || 'unable to submit form. Redirecting to confirmation page');
                setTimeout(()=>setError(""),5000)
            }
            if(data.success){
            // handleNext("CancellationConfirmation");
            }else{
                console.log(data);
            }
        } catch (error) {
           if (error instanceof Error) {
                console.error("Error message:", error.message);
                console.error("Stack trace:", error.stack);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }


    return (
        <div className="bg-gray-50 md:p-4 flex items-center justify-center">
            <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
            <CardContent className=" py-10 px-6 md:px-12 min-h-[500px]">
                <Button onClick={()=>handleBack("CancellationOffer")}
                        className="px-0 shadow-none text-sky-500 py-2 bg-transparent hover:bg-transparent hover:text-sky-600"
                        >
                         &lt; Back
                </Button>
                <h2 className="text-3xl mt-3 text-sky-500 mb-5 font-poppins font-semibold">FeedBack Form</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                    <p className="text-red-500 font-poppins mt-3">{error}</p>
                    )}

                    <label className="font-poppins text-slate-500">
                        Why did you choose a competitor?
                    </label>
                    
                        <Select 
                        value = {formData.reason}
                        onValueChange={(value)=>handleChange("reason",value)}
                        required
                        >
                            <SelectTrigger className="h-12 w-full pl-10 py-6 bg-white border-gray-200">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pricing">Better pricing</SelectItem>
                                <SelectItem value="features">More features</SelectItem>
                                <SelectItem value="usability">Easier to use</SelectItem>
                                <SelectItem value="support">Better support</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    <div className="mt-5">
                        <label className="font-poppins text-slate-500" >
                            Which features would you like us to have?
                        </label>
                            <Textarea value={formData.desired_features} onChange={(e)=>handleChange('desired_features',e.target.value)} className="w-full" />
                    </div>
                    <div className="mt-5">
                        <label className="font-poppins text-slate-500">
                            Any other feedback?
                        </label>
                            <Textarea value={formData.other_feedback} onChange={(e)=>handleChange('other_feedback',e.target.value)} className="w-full" />
                    </div>
                    <div className="flex mt-5 flex-col md:flex-row justify-center gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="outline"
                        className="bg-gray-500 hover:bg-gray-600 text-white border-gray-500 hover:border-gray-600 px-6 py-2.5 h-auto font-medium"
                        disabled={!formData.reason || !formData.desired_features || isSubmitting}
                        >
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                    </div>
                </form>

            </CardContent>
            </Card>
        </div>
    )

}