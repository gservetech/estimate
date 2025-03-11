import {ReactNode} from "react";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";


const PayPalProvider = ({children}: { children: ReactNode }) => {

    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        throw new Error("PayPal client ID is not set");
    }

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: process.env.PAYPAL_MODE
    }

    return (
        <PayPalScriptProvider options={initialOptions}>
            {children}
        </PayPalScriptProvider>
    );
};

export default PayPalProvider;