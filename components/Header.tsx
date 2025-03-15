"use client";

import logo from "@/images/logo.png";
import { Order } from "@/types/order.types";
import { User } from "@/types/user.types";
import useOrderStore from "@/store/orderStore";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsBasket } from "react-icons/bs";
import { FaBars, FaPhone } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import CartIcon from "./CartIcon";
import { getClientOrders } from "@/lib/getClientOrders";

interface HeaderProps {
  user: User | null;
  orders: Order[];
}

const Header: React.FC<HeaderProps> = ({ orders: initialOrders, user }) => {
  const [country, setCountry] = useState<string>("CA");
  const [currency] = useState<string>("CAD");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const {
    setOrders,
    getOrdersCount,
    clearOrders,
    setUserId,
    orders: storeOrders,
  } = useOrderStore();
  const { userId } = useAuth();
  const [orderCount, setOrderCount] = useState<number>(0);

  // Effect to handle initial order loading
  useEffect(() => {
    setIsClient(true);

    // Initialize the order store with the server-provided orders
    if (initialOrders && initialOrders.length > 0 && user?.clerkId) {
      setUserId(user.clerkId);
      setOrders(initialOrders);

      // Update local order count
      setOrderCount(initialOrders.length);
    }
  }, [initialOrders, setOrders, user?.clerkId, setUserId]);

  // Effect to update order count when store orders change
  useEffect(() => {
    if (isClient) {
      const count = storeOrders.length;
      setOrderCount(count);
    }
  }, [storeOrders, isClient]);

  // Effect to handle user changes and clear orders when user changes
  useEffect(() => {
    if (user?.clerkId) {
      // Set the user ID in the order store
      setUserId(user.clerkId);

      // If we're on the client side, fetch orders for this user
      if (isClient && user.clerkId) {
        const fetchUserOrders = async () => {
          try {
            const { orders, error } = await getClientOrders(
              user.clerkId as string
            );
            if (!error && orders) {
              setOrders(orders);
              setOrderCount(orders.length);
            } else if (error) {
              console.error("Error fetching orders:", error);
            }
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };

        fetchUserOrders();
      }
    }
  }, [user?.clerkId, setUserId, isClient, setOrders]);

  // Effect to clear orders when user signs out
  useEffect(() => {
    if (!userId && isClient) {
      // User has signed out
      clearOrders();
      setOrderCount(0);
    }
  }, [userId, isClient, clearOrders]);

  // Effect to fetch orders when userId changes (user logs in)
  useEffect(() => {
    if (userId && isClient) {
      const fetchUserOrders = async () => {
        try {
          const { orders, error } = await getClientOrders(userId);
          if (!error && orders) {
            setOrders(orders);
            setOrderCount(orders.length);
          } else if (error) {
            console.error("Error fetching orders:", error);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchUserOrders();
    }
  }, [userId, isClient, setOrders]);

  // Debug log for order count
  useEffect(() => {
    if (isClient) {
      const storeOrderCount = getOrdersCount();
      const storeState = useOrderStore.getState();
      console.log("Order count debug:", {
        storeOrderCount,
        storeUserId: storeState.userId,
        storeOrdersLength: storeState.orders.length,
        localOrderCount: orderCount,
        initialOrdersLength: initialOrders?.length || 0,
        clerkUserId: userId,
        userClerkId: user?.clerkId,
      });
    }
  }, [
    isClient,
    getOrdersCount,
    orderCount,
    initialOrders,
    userId,
    user?.clerkId,
  ]);

  useEffect(() => {
    const fetchAndStoreVisit = async () => {
      try {
        const ipInfoToken = process.env.NEXT_PUBLIC_IPINFO_API_TOKEN; // Read from env variables

        if (!ipInfoToken) {
          console.error(
            "IPINFO_API_TOKEN is not set in environment variables."
          );
          return;
        }

        // Fetch visitor details from ipinfo.io
        const response = await axios.get(
          `https://ipinfo.io/json?token=${ipInfoToken}`
        );
        const visitData = {
          ip: response.data?.ip ?? "",
          visitData: JSON.stringify(response.data), // Store full JSON response
        };

        // Save visit data to backend
        await axios.post("/api/visits", visitData);
        setCountry(response.data?.country ?? "CA"); // Set country from response
      } catch (error) {
        console.error("Error fetching or saving visit data:", error);
      }
    };

    fetchAndStoreVisit();
  }, []);

  // Use our local state for order count instead of relying on the store
  // This ensures we always show the correct count even if the store's getOrdersCount
  // function has conditions that might prevent it from returning the actual count

  return (
    <>
      {/* 🔹 Top Bar */}
      <div className="full bg-blue-900 text-white font-bold border-b border-gray-200 py-2">
        <div className="flex justify-end items-center px-4 space-x-3">
          <Link
            className="text-sm border-r border-[#ffffff46] px-3"
            href="/about-us"
          >
            About Us
          </Link>
          <div className="flex items-center gap-1 border-r border-[#ffffff46] px-3">
            <Image
              className="w-6 h-4"
              src={country === "CA" ? "/cf.png" : "/us.png"}
              alt=""
              width={24}
              height={24}
            />
            <span className="text-sm text-white font-bold">
              {country === "CA" ? "Canada" : "USA"}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3">
            <span>$</span>
            <span className="text-sm text-white font-bold">{currency}</span>
          </div>
        </div>
      </div>

      {/* 🔹 Main Header */}
      <header className="sticky top-0 left-0 w-full bg-white shadow-md border-b-4 border-blue-900 z-50">
        <div className="container mx-auto px-4 h-[60px] lg:h-[80px] flex items-center">
          <div className="w-full flex items-center gap-4">
            {/* 🔹 Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src={logo}
                  alt="logo"
                  width={40}
                  height={40}
                  priority
                  className="object-contain h-[30px] lg:h-[50px] w-auto"
                />
              </Link>
            </div>

            {/* 🔹 Search Bar */}
            <div className="hidden lg:flex flex-grow max-w-2xl">
              <form action="/search" className="w-full">
                <input
                  type="text"
                  name="query"
                  placeholder="Search for products"
                  className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </form>
            </div>

            {/* 🔹 Right Section */}
            <div className="flex items-center gap-6 ml-auto">
              {/* 🔹 Mobile Menu Toggle */}
              <button
                className="lg:hidden hover:bg-gray-100 p-2 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <IoMdClose className="w-6 h-6 text-gray-700" />
                ) : (
                  <FaBars className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* 🔹 Contact */}
              <div className="hidden md:flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                <FaPhone className="w-5 h-5 text-darkBlue" />
                <p className="text-sm font-semibold whitespace-nowrap">
                  (416) 635-0502
                </p>
              </div>

              {/* 🔹 User Account */}
              <ClerkLoaded>
                <SignedIn>
                  <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <FiUser className="w-5 h-5 text-darkBlue" />
                      <span className="hidden lg:block text-sm font-semibold">
                        Sign In
                      </span>
                    </button>
                  </SignInButton>
                </SignedOut>
              </ClerkLoaded>

              {/* 🔹 Shopping Cart */}
              <div className="relative flex items-center justify-center h-10 w-10 hover:bg-gray-50 rounded-lg transition-colors">
                <CartIcon />
              </div>

              {/* 🔹 Orders */}
              <SignedIn>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BsBasket className="w-5 h-5 text-darkBlue" />
                  <p className="hidden lg:block text-sm font-semibold">
                    {orderCount} items
                  </p>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
