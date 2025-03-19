import { ReactNode, useEffect } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useLocationStore from "@/store/locationStore";

const PayPalProvider = ({ children }: { children: ReactNode }) => {
  const { country, fetchLocation } = useLocationStore();

  const currency = country === "CA" ? "CAD" : "USD";

  const country_en = country === "CA" ? "en_CA" : "en_US";

  // Fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    throw new Error("PayPal client ID is not set");
  }

  console.log("currency", currency);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: currency,
    intent: process.env.PAYPAL_MODE,
    locale: country_en,
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
