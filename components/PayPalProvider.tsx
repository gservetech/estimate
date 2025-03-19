"use client"; // Ensure this is a client component

import { ReactNode, useEffect, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useLocationStore from "@/store/locationStore";

// Read environment variables at build time
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_MODE = process.env.NEXT_PUBLIC_PAYPAL_MODE || "capture";

const PayPalProvider = ({ children }: { children: ReactNode }) => {
  const { country, fetchLocation } = useLocationStore();
  const [isCountryLoaded, setIsCountryLoaded] = useState(false);

  useEffect(() => {
    fetchLocation().then(() => setIsCountryLoaded(true));
  }, [fetchLocation]);

  if (!PAYPAL_CLIENT_ID) {
    console.error("🚨 PayPal client ID is missing. Check .env.local");
    throw new Error("PayPal client ID is not set");
  }

  // Set currency and locale dynamically based on country
  const currency = country === "CA" ? "CAD" : "USD";
  const locale = country === "CA" ? "en_CA" : "en_US";

  // Full PayPal options
  const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency,
    intent: PAYPAL_MODE,
    locale,
  };

/*   // ✅ Print the entire `initialOptions` object
  console.log(
    "✅ PayPal Configuration:",
    JSON.stringify(initialOptions, null, 2)
  );

  if (!isCountryLoaded) {
    console.log("⏳ Waiting for country to load...");
    return <div>Loading PayPal...</div>;
  } */

  return (
    <PayPalScriptProvider options={initialOptions} key={country}>
     
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
