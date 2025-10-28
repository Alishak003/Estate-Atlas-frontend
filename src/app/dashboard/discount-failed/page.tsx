import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface DiscountFailedProps {
  errorMessage?: string; // Optional custom error message
}

export default function DiscountFailed({ errorMessage }: DiscountFailedProps) {
  return (
    <div className="bg-gray-50 md:p-4 flex justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
        <CardContent className="py-10 px-6 md:px-12">
          <h1 className="text-3xl font-bold text-slate-600 mb-4 font-poppins">
            Failed to Apply Discount
          </h1>

          <p className="text-gray-700 mb-6 font-poppins">
            Sorry! We were unable to apply your discount to your subscription at this moment.
          </p>

          {errorMessage && (
            <p className="text-gray-700 mb-6 font-poppins">
              <strong>Reason:</strong> {errorMessage}
            </p>
          )}

          <p className="text-gray-500 font-poppins">
            Please try again or contact our support team for assistance.
          </p>
        </CardContent>
        <CardFooter className="py-5 px-6 md:px-12">
          <div className="flex-col md:flex-row gap-4 w-full md:w-auto pt-5">
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 px-6 py-2.5 h-auto font-medium"
          >
            Contact Support Team
          </Button>
          <Button
            className="bg-slate-400 hover:bg-slate-500 text-white border-slate-400 hover:border-slate-500 px-6 py-2.5 h-auto font-medium"
          >
            Continue to dashboard
          </Button>
        </div>
        </CardFooter>
      </Card>
    </div>
  );
}
