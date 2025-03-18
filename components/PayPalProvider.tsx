import { ReactNode, useEffect } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useLocationStore from "@/store/locationStore";

const PayPalProvider = ({ children }: { children: ReactNode }) => {
  const { country, fetchLocation } = useLocationStore();

  const currency = country === "CA" ? "CAD" : "USD";

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
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
