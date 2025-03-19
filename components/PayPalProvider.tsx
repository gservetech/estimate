import { ReactNode, useEffect } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useLocationStore from "@/store/locationStore";

const PayPalProvider = ({ children }: { children: ReactNode }) => {
  const { country, fetchLocation } = useLocationStore();
  const currency = country === "CA" ? "CAD" : "USD";

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!clientId) {
    console.error("PayPal client ID is not set");
    throw new Error("PayPal client ID is not set");
  }

  const initialOptions = {
    clientId,
    currency,
    intent: "capture",
    locale: country === "CA" ? "en_CA" : "en_US",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
