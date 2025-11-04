"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, ArrowRight } from "lucide-react";
import Cookies from 'js-cookie';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from "react-hot-toast";
import SubscriptionSettings from "@/components/dashboard/Account/subscriptionSettings";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  date: string;
  total: string;
  status: "Paid" | "Pending" | "Failed";
  download_url: string;
}

export default function Billing() {
  const router = useRouter();
  // Billing history state
  const [billingHistory, setBillingHistory] = useState<Invoice[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Update options state
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const [selectedPriceSlug, setSelectedPriceSlug] = useState("basic_monthly");
  const [updating, setUpdating] = useState(false);

  // update card
  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  // billing details state
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(()=>{
    try {
      const token = Cookies.get('token'); 
      const fetchHistory = async ()=>{
        const historyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-history?per_page=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!historyRes.ok) {
          throw new Error(`Failed to fetch payment history: ${historyRes.status}`);
        }

        const historyData = await historyRes.json();
        console.log(historyData);
        setBillingHistory(historyData.invoices || []);
      }
      fetchHistory();
    } catch (error) {
      console.log(error);
    }finally{
      setLoadingHistory(false);
    }
  },[])

  const handleDownloadInvoice = async (downloadUrl: string) => {
    try {
      setIsDownloading(true);
      const token = Cookies.get('token');
      const response = await fetch(downloadUrl, {
        method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to haye invoice');
      }

      // Create a blob from the response and create a download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }finally{
      setIsDownloading(false);
    }
  };

  
  const handleConfirmUpdate = async () => {
    const token = Cookies.get('token');
    if (!token) return toast.error("Token missing!");

    try {
      setUpdating(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ price_slug: selectedPriceSlug }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
       toast.error("Failed to update subscription: " + data?.message);
      } else {
       toast.success("Subscription updated to " + selectedPriceSlug);
        setShowUpdateOptions(false);
      }
    } catch (err) {
      console.error("Error updating subscription:", err);
     toast.error("An error occurred.");
    } finally {
      setUpdating(false);
    }
  };


  // card update
  const handleUpdatePayment = async () => {
    if (!stripe || !elements) {
    toast.error("Payment system is not ready. Please try again later.");
      return;
    }

    setUpdatingPayment(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) throw error;

      const token = Cookies.get('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-method/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_method: paymentMethod.id
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update payment method");

    toast.success("Payment method updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Payment update error:", error);
     toast.error(error instanceof Error ? error.message : "Failed to update payment method");
    } finally {
      setUpdatingPayment(false);
    }
  };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <SubscriptionSettings/>
        
        {showUpdateOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Update Your Subscription
              </h2>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Plan:
              </label>
              <select
                value={selectedPriceSlug}
                onChange={(e) => setSelectedPriceSlug(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="basic_monthly">Basic Monthly</option>
                <option value="premium_monthly">Premium Monthly</option>
              </select>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleConfirmUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Confirm Update"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateOptions(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>

              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowUpdateOptions(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <Card className="border-0 border-t-4 border-sky-400">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Payment Method</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Update Card Information
                </label>
                <CardElement 
                  onChange={(e) => setCardComplete(e.complete)}
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  className="p-3 border rounded bg-white"
                />
              </div>

              <Button
                onClick={handleUpdatePayment}
                disabled={!cardComplete || updatingPayment}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white"
              >
                {updatingPayment ? "Updating..." : "Update Payment Method"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing History Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                <div className="w-3 h-0.5 bg-white"></div>
              </div>
              <h3 className="font-semibold text-gray-900">Billing History</h3>
            </div>
            

            {!loadingHistory &&
            (billingHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No billing history found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700 text-sm">
                        DATE
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700 text-sm">
                        AMOUNT
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700 text-sm">
                        STATUS
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700 text-sm">
                        INVOICE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-2">
                          <span className="text-sm text-gray-900">
                            {item.date}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-sm font-medium text-gray-900">
                            {item.total}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <Badge
                            variant="secondary"
                            className={`${
                              item.status === "Paid" 
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : item.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <Button
                            onClick={() => handleDownloadInvoice("https://upbeat-dust-99504.pktriot.net/api/stripe/invoice/in_1SONT5RzsDq04jEjPEkRpj91/download")}
                            size="sm"
                            disabled={isDownloading}
                            className="bg-gray-800 hover:bg-gray-900 text-white"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {isDownloading ? 'Downloading...':'Download'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/BillingHistory')}
                    className="text-sky-600 hover:text-sky-700 font-medium text-sm flex items-center gap-1 p-0 h-auto"
                  >
                    Show all transactions
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </div>

              </div>
            ))}
            {loadingHistory &&
            <>
              <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </>}
          </CardContent>
        </Card>
      </div>
    );
  

  // Loading state
  // return (
  //   <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
  //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //   </div>
  // );
}