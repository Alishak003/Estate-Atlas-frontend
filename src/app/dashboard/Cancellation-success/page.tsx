import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// interface DiscountSuccessProps {
//   endDate: string;
// }

export default function DiscountSuccess() {
  // Format dates nicely
  // const formatDate = (dateStr: string) => {
  //   const date = new Date(dateStr);
  //   return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  // };

  return (
    <div className="bg-gray-50 md:p-4 flex justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
        <CardContent className="py-10 px-6 md:px-12">
          <h1 className="text-3xl font-bold text-gray-700 mb-4 font-poppins">
            🌙 Subscription Cancelled
          </h1>

          <p className="text-gray-600 mb-6 font-poppins">
            Your subscription has been successfully cancelled. We’re sad to see you go.  
            Thank you for being with us, even if just for a while.
          </p>

          <p className="text-gray-500 font-poppins">
            You can still access your benefits until the end of your current billing period.  
            We hope to welcome you back in the future.
          </p>
        </CardContent>
        <CardFooter className="py-5 px-6 md:px-12">
          <Button
          variant="outline"
           className="bg-sky-500 text-white py-5 px-6 border-sky-500 hover:bg-sky-600"
          >
            Continue to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
