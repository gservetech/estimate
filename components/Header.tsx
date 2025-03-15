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

interface HeaderProps {
  user: User | null;
  orders: Order[];
}

const Header: React.FC<HeaderProps> = ({ orders: initialOrders }) => {
  const [country, setCountry] = useState<string>("CA");
  const [currency, setCurrency] = useState<string>("CAD");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const { setOrders, getOrdersCount } = useOrderStore();

  useEffect(() => {
    setIsClient(true);
    // Initialize the order store with the server-provided orders
    // Only set orders if they don't already exist in the store or if the count has changed
    if (initialOrders && initialOrders.length > 0) {
      setOrders(initialOrders);
    }
  }, [initialOrders, setOrders]);

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

  // Get the order count from the store if on client, otherwise use the initial orders
  const orderCount = isClient ? getOrdersCount() : initialOrders?.length ?? 0;

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
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border-none bg-transparent text-sm text-white font-bold"
            >
              <option value="CA" className="text-black">
                Canada
              </option>
              <option value="US" className="text-black">
                USA
              </option>
            </select>
          </div>
          <div className="flex items-center gap-1 px-3">
            <p>$</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border-none bg-transparent text-sm text-white font-bold"
            >
              <option value="CAD" className="text-black">
                CAD
              </option>
              <option value="USD" className="text-black">
                USD
              </option>
            </select>
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
                      fallback="/"
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
