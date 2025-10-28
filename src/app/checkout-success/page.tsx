'use client';

import { useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Cookies from 'js-cookie';

export default function CheckoutSuccess() {
  const router = useRouter();
  const [count, setCount] = useState(5);
  const {user,setUser} = useUser();

  useEffect(() => {

      if ( user && user.id) {
          const refreshUserData = async () => {
              const token = Cookies.get('token');

              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                  method: 'GET', // Or POST if you prefer
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              });

              if (response.ok) {
                  const refreshedData = await response.json();
                  
                  // 3. Update the user state and the cookie with the new data
                  setUser(refreshedData.data);
                  Cookies.set('user', JSON.stringify(refreshedData.user), { expires: 7, path: '/' });
                  
                  // OPTIONAL: Clean up the URL so the refresh doesn't happen again
                  history.replaceState(null, '', window.location.pathname);
                  
              } else {
                  console.error("Failed to refresh user data after checkout.");
              }
          };

          refreshUserData();
      }
  }, [user, setUser]); // Depends on the user state and the setter

  useEffect(() => {

    if (count === 1) {
      router.replace('/dashboard/Countries');
      return;
    }

    const timer = setTimeout(() => {
      setCount((prevCount) => prevCount - 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [count,router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. Your account is now active.
        </p>
        <p>
          Redirecting in {count}...
        </p>
      </div>
    </div>
  );
}
