import { FeedbackForm } from "@/components/dashboard/Account/feedback-form"
interface ChildComponentProps {
    handleBack : (stepValue:string)=>void
}
export default function CompetitionFeedback({handleBack}:ChildComponentProps){
    return(
        <FeedbackForm handleBack={handleBack}/>
    )
}