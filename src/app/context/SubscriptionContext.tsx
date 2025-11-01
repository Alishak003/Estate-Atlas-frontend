'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

type Subscription = {
  id: string;
  price: string;
  price_id: string;
  duration: 'monthly' | 'yearly';
  tier: 'basic' | 'premium' | 'none' | 'unknown';
  current_period_end: string;
  stripe_status?: string;
  status?: string;
  discount?: {
    value_off?: number;
    type?: string;
    ends_at?:string;
  } | null;
  is_paused?: {
    paused_at:string;
  } | null
};

interface ISubscriptionsContext {
  subscription: Subscription | null;
  setSubscription: (sub: Subscription | null) => void;
  updateSubscription: (updates: Partial<Subscription>) => void; 
  loading: boolean;
  // error: string | null;

//   fetchSubscription: () => Promise<void>;
}

const SubscriptionsContext = createContext<ISubscriptionsContext | undefined>(undefined);

export const SubscriptionsProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // Load subscription from cookie initially
  useEffect(() => {
    const storedSub = Cookies.get('subscription');
    if (storedSub) {
      try {
        setSubscription(JSON.parse(storedSub));
      } catch (err) {
        console.error('Error parsing subscription from cookies:', err);
      }
    }
    setLoading(false);
  }, []);

  // Persist subscription in cookies
  useEffect(() => {
    if (subscription) {
      Cookies.set('subscription', JSON.stringify(subscription), { expires: 7, path: '/' });
    } else {
      Cookies.remove('subscription');
    }
  }, [subscription]);

  const updateSubscription = (updates:Partial<Subscription>) => {
    setSubscription(prev => ({ ...prev!, ...updates }));
  };

//   const fetchSubscription = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Replace with real API call
//       const data: Subscription = await fetch('/api/subscription').then(res => res.json());
//       setSubscription(data);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || 'Failed to fetch subscription');
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <SubscriptionsContext.Provider
      value={{
        subscription,
        setSubscription,
        updateSubscription,
        loading,
        // error,
        // fetchSubscription,   
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionsProvider');
  }
  return context;
};
