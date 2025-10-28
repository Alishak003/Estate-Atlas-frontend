import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
interface DowngradeSuccessPageProps {
  searchParams?: {
    effectiveDate?: string; // Expect effectiveDate to be passed as a URL query parameter
  };
}

// ⚠️ Note: We removed the custom DowngradeSuccessProps interface from the function signature

export default function DowngradeSuccess({ searchParams }: DowngradeSuccessPageProps) {
  const effectiveDate = searchParams?.effectiveDate;

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A'; // Handle case where effectiveDate is missing

    // The rest of your formatting logic
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-gray-50 md:p-4 flex justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-green-500">
        <CardContent className="py-10 px-6 md:px-12">
          <h1 className="text-3xl font-bold font-poppins text-green-600 mb-4">
            🎉 Plan Downgrade Successful!
          </h1>

          <p className="text-gray-700 mb-6 font-poppins">
            Great news! Your subscription has been successfully downgraded to the <strong>Basic Plan</strong>. 
            This change will take effect starting from <strong>{formatDate(effectiveDate)}</strong>. 
            You can continue enjoying all the essential features you love, now with a simpler plan that better fits your needs.
          </p>

          <p className="text-gray-700 mb-6 font-poppins">
            We understand that sometimes plans need to change, and we’re happy to make it easy for you. 
            Even on the Basic Plan, you’ll still have access to key tools and resources to help you stay productive and get the most out of your subscription.
          </p>

          <p className="text-gray-700 mb-6 font-poppins">
            Remember, you can always upgrade again in the future if your needs grow or if you want to explore premium features. 
            Our team is always here to support you along the way.
          </p>

          <p className="text-gray-500 font-poppins">
            Thank you for being a valued member of our community! If you have any questions, concerns, or just want to chat about your plan, our support team is just a click away.
          </p>
        </CardContent>
        <CardFooter className="py-5 px-6 md:px-12">
          <Button
            variant="outline"
            className="bg-green-500 text-white py-5 px-6 border-green-500 hover:bg-green-600"
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
