import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ChildComponentProps {
    handleBack : ()=> void;
    handleSubmit : ()=> void;
}
const CancellationConfirmation = ({handleBack, handleSubmit}:ChildComponentProps)=>{
    return (
        <div className="bg-gray-50 md:p-4 flex items-center justify-center">
    <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
      <CardContent className="py-10 px-6 md:px-10">
        <Button onClick={handleBack}
        className="px-0 shadow-none text-sky-500 py-2 bg-transparent hover:bg-transparent hover:text-sky-600"
        >
         &lt; Back
        </Button>
        <h2 className="text-2xl mb-2 font-poppins font-bold text-center">
          Are you sure you want to cancel?
        </h2>
        <p className="font-poppins text-center pb-3">
          Your Estate Atlas subscription and all saved data will be deleted at the end of your billing cycle on [Month, Day, Year]. You will not be charged again.
        </p>

        

          <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              variant="outline"
              className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 px-6 py-2.5 h-auto font-medium"
            >
              Never Mind, Keep My Subscription
            </Button>
            <Button
              type="submit"
              className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2.5 h-auto font-medium"
            >
              Confirm Cancellation
            </Button>
          </div>
      </CardContent>
    </Card>
  </div>
    )
}

export default CancellationConfirmation;