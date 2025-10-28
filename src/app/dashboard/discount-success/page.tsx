import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DiscountSuccess() {

  return (
    <div className="bg-gray-50 md:p-4 flex justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
        <CardContent className="py-10 px-6 md:px-12">
          <h1 className="text-3xl font-bold font-poppins text-green-600 mb-4 font-poppins">
            🎉 Discount Applied Successfully!
          </h1>

          <p className="text-gray-700 mb-6 font-poppins">
            Congratulations! Your discount has been applied to your subscription. 
            You can now enjoy your savings immediately.
          </p>

          <p className="text-gray-500 font-poppins">
            If you have any questions or issues, feel free to contact our support team.
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
