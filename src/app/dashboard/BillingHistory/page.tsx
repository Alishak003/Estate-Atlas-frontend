'use client';

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Invoice {
  id: string;
  date: string;
  total: string;
  status: "Paid" | "Pending" | "Failed";
  download_url: string;
}

export default function BillingHistory() {
  const [billingHistory, setBillingHistory] = useState<Invoice[]>([]);
  const [currentPageBills,setCurrentPageBills] = useState<Invoice[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 1;

  const handleNext = async()=>{
    const end = perPage*(page+1);
    if(billingHistory.length >= end){
        const start = end-perPage;
        setCurrentPageBills(billingHistory.slice(start,end));
        setPage(prev=>prev+1);
    }
  }

  const handleBack = async()=>{
    if(page!==1){
        const end = perPage*(page-1);
        const start = end-perPage;
        setCurrentPageBills(billingHistory.slice(start,end));
        setPage(prev=>prev-1);
    }
  }
  const fetchHistory = async (perPage:number) => {
    try {
      setLoadingHistory(true);
      const token = Cookies.get("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      if(data.success){
        console.log("data : ",data);
        if(data.invoices){
            setBillingHistory(prev => [...prev,...data.invoices]);
            setCurrentPageBills(data.invoices.slice(0,perPage));
            setPage(prev=>prev+1);
            const result = (Math.floor(data.total_invoices/perPage));
            const total_invoices = result === 0 ? 1:result;
            setLastPage(total_invoices);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load billing history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory(perPage); // Preview mode: fetch 5 invoices
  }, []);

  const handleDownloadInvoice = async (downloadUrl: string) => {
    try {
      setIsDownloading(true);
      const token = Cookies.get("token");
      const res = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to download invoice");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };
  const handleDownloadAllInvoices = async () => {
    try {
      setIsDownloading(true);
      const token = Cookies.get("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/invoices/download-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to download invoices");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_invoices.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("All invoices downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download all invoices");
    } finally {
      setIsDownloading(false);
    }
  };


  useEffect(()=>{
    console.log("billingHistory : ",billingHistory);
  },[billingHistory])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
              <div className="w-3 h-0.5 bg-white"></div>
            </div>
            <h3 className="font-semibold text-gray-900">Billing History</h3>
          </div>
          {!loadingHistory && billingHistory.length >0 &&
          <div className="flex justify-end mb-3">
              <Button
                onClick={handleDownloadAllInvoices}
                className="font-poppins bg-sky-500 hover:bg-sky-600 text-white text-sm px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>Download All (ZIP)</span>
              </Button>
          </div>
          }
        </div>

        {loadingHistory ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : billingHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No billing history found
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
            
              <table className="w-full ">              
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
                  {currentPageBills.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4 px-2">{item.date}</td>
                      <td className="py-4 px-2">{item.total}</td>
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
                          onClick={() =>
                            handleDownloadInvoice(item.download_url)
                          }
                          size="sm"
                          disabled={isDownloading}
                          className="bg-gray-800 hover:bg-gray-900 text-white"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {isDownloading ? "Downloading..." : "Download"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-3 mt-10">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={handleBack}
                className="w-[100px] shadow-none border-gray-500 py-2 mx-4 hover:border-gray-600"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {lastPage}
              </span>
              <Button
                variant="outline"
                disabled={page === lastPage}
                onClick={handleNext}
                className="w-[100px] shadow-none border-gray-500 py-2 mx-4 hover:border-gray-600"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
