'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clipboard } from 'lucide-react'
import Cookies from 'js-cookie';
import toast from 'react-hot-toast'

export default function AffiliatePage() {
  // const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  const [affiliateLink, setAffiliateLink] = useState<string | null>(null)
    type AffiliateInfo = {
      total_commission: number;
      total_clicks: number;
      total_referrals: number;
      commission_rate: number;
      status: string;
    };

    const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null)
  const [loadingAffiliate, setLoadingAffiliate] = useState(false)
  const [loadingStripe, setLoadingStripe] = useState(false)

  const token = Cookies.get('token'); 

 // affiliate info on mount
  useEffect(() => {
    const fetchAffiliateInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/info`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setAffiliateInfo(data);
          const affiliate_code = `${process.env.NEXT_PUBLIC_API_URL}/affiliate/click/${data.affiliate_code}`;
          setAffiliateLink(affiliate_code);
        }
      } catch (err) {
        console.error('Failed to fetch affiliate info:', err)
      }
    }

    fetchAffiliateInfo()
  }, [token])







  const handleGetAffiliateLink = async () => {
    setLoadingAffiliate(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/link`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok && data) {
        
        setAffiliateLink(data.data.affiliate_link)
      
        
         toast.success('Affiliate code fetched successfully!')
      } else {
       toast.error('Failed to fetch affiliate code')
      }
    } catch (err) {
      console.error(err)
    toast.error('Error fetching affiliate code')
    } finally {
      setLoadingAffiliate(false)
    }
  }

  const handleStripeConnect = async () => {
    setLoadingStripe(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/connect/create`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok && data.url) {
       
        window.location.href = data.url
      
      } else {
      toast.error('Failed to connect Stripe')
      }
    } catch (err) {
      console.error(err)
     toast.error('Error connecting to Stripe')
    } finally {
      setLoadingStripe(false)
    }
  }

  return (
    <div className="md:max-w-6xl w-full mx-auto md:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Affiliate Dashboard</h1>

    <Card className="mb-6 shadow-xl border-0 border-t-4 py-10 border-sky-500">
    <CardContent className=" space-y-4  items-start">
      { !affiliateLink && <div className="space-y-4">
          <p className="text-lg font-semibold text-black">Get Your Affiliate Link</p>
          <Button onClick={handleGetAffiliateLink} disabled={loadingAffiliate}>
            {loadingAffiliate ? 'Loading...' : 'Generate Affiliate Link'}
          </Button>
        </div>
      }
{/* 
    {affiliateCode && (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-black">Your Code:</p>
        <div className="flex items-center gap-2">
          <Badge className="text-md">{affiliateCode}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(affiliateCode)
             toast.success('Copied to clipboard!')
            }}
          >
             <Clipboard />
          </Button>
        </div>

       
      </div>
    )} */}


{
  affiliateLink && (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-black">Your Affiliate Link:</p>
      <div className="flex items-center gap-2">
        <Badge className="text-md">{affiliateLink}</Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(affiliateLink)
            toast.success('Copied to clipboard!')
          }}
        >
          <Clipboard />
        </Button>
      </div>
    </div>
  )
}


  </CardContent>
</Card>




      {/* ✅ Affiliate Info Cards */}
      {affiliateInfo && (
        <div className='shadow-xl  border-t-4 py-5 px-4 border-sky-500 rounded-2xl my-5'>

      <h1 className='text-lg font-bold my-4 '>Affiliate Information</h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-6   ">
          <Card className="shadow border-0 p-4">
            <CardHeader>
              <CardTitle>Total Commission</CardTitle>
              <CardDescription className="text-xl font-bold text-green-600">
                ${affiliateInfo.total_commission}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow border-0 p-4">
            <CardHeader>
              <CardTitle>Total Clicks</CardTitle>
              <CardDescription className="text-xl font-bold text-blue-600">
                {affiliateInfo.total_clicks}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow border-0 p-4">
            <CardHeader>
              <CardTitle>Total Referrals</CardTitle>
              <CardDescription className="text-xl font-bold text-purple-600">
                {affiliateInfo.total_referrals}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow border-0 p-4">
            <CardHeader>
              <CardTitle>Commission Rate</CardTitle>
              <CardDescription className="text-xl font-bold text-orange-600">
                {affiliateInfo.commission_rate}%
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow border-0 p-4">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription className="text-xl font-bold text-sky-600 capitalize">
                {affiliateInfo.status}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
          </div>
      )}








      <Card className="shadow-xl border-0 border-t-4 py-10 border-sky-500">
        <CardHeader>
          <CardTitle>Connect Stripe Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStripeConnect} disabled={loadingStripe}>
            {loadingStripe ? 'Redirecting...' : 'Connect with Stripe'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
