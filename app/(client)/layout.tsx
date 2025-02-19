import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import "../style.css";
import { ClerkProvider } from "@clerk/nextjs";

import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "react-hot-toast";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import DisableDraftMode from "@/components/DisableDraftMode";
import Header from "@/components/Header";
// import Header from "@/layout/Header";
import { getUserOrders } from "@/lib/getUserOrders";

const poppins = localFont({
  src: "../fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: "Ecommerce App for Shoppers",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, orders } = await getUserOrders(); // Fetch on the server

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          
        </head>
        <body className={`${poppins.variable} antialiased`}>
          {(await draftMode()).isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
           <Header user={JSON.parse(JSON.stringify(user))} orders={orders} />



          {children}
          <Footer />
          
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#fff",
              },
            }}
          />
           
        </body>
      </html>
    </ClerkProvider>
  );
}
