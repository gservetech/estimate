"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import logo from "@/images/logo.png";
import CartIcon from "./CartIcon";
import { BsBasket } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FaBars, FaPhone } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { Order } from "@/types/order.types";
import { User } from "@/types/user.types";

interface HeaderProps {
  user: User | null;
  orders: Order[];
}

const Header: React.FC<HeaderProps> = ({ user, orders }) => {
  const [country, setCountry] = useState<string>("CA");
  const [currency, setCurrency] = useState<string>("CAD");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndStoreVisit = async () => {
      try {
        const ipInfoToken = process.env.NEXT_PUBLIC_IPINFO_API_TOKEN; // Read from env variables

        if (!ipInfoToken) {
          console.error("IPINFO_API_TOKEN is not set in environment variables.");
          return;
        }

        // Fetch visitor details from ipinfo.io
        const response = await axios.get(`https://ipinfo.io/json?token=${ipInfoToken}`);
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

  return (
    <>
      {/* 🔹 Top Bar */}
      <div className="full bg-blue-900 text-white font-bold border-b border-gray-200 py-2">
        <div className="flex justify-end items-center px-4 space-x-3">
          <Link className="text-sm border-r border-[#ffffff46] px-3" href="/about-us">
            About Us
          </Link>
          <div className="flex items-center gap-1 border-r border-[#ffffff46] px-3">
            <img className="w-6 h-4" src={country === "CA" ? "/cf.png" : "/us.png"} alt="" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border-none bg-transparent text-sm text-white font-bold"
            >
              <option value="CA" className="text-black">Canada</option>
              <option value="US" className="text-black">USA</option>
            </select>
          </div>
          <div className="flex items-center gap-1 px-3">
            <p>$</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border-none bg-transparent text-sm text-white font-bold"
            >
              <option value="CAD" className="text-black">CAD</option>
              <option value="USD" className="text-black">USD</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🔹 Main Header */}
      <header className="sticky top-[0px] left-0 w-full pr-10 bg-white shadow-md border-b-4 border-blue-900 h-[60px] lg:h-[80px] flex items-center z-50">
        <div className="w-full flex items-center px-4">
          {/* 🔹 Logo */}
          <div className="flex-shrink-0 ml-0 mr-4">
            <Link href="/">
              <Image src={logo} alt="logo" width={40} height={40} priority className="object-contain h-[30px] lg:h-[70px] w-auto" />
            </Link>
          </div>

          {/* 🔹 Search Bar */}
          <div className="hidden lg:flex flex-grow max-w-2xl mx-auto">
            <form action="/search" className="w-full">
              <input type="text" name="query" placeholder="Search for products" className="bg-gray-50 text-gray-800 px-3 py-2 border border-gray-200 w-full rounded-md hoverEffect" />
            </form>
          </div>

          {/* 🔹 Right Section */}
          <div className="flex items-center space-x-6 ml-auto">
            {/* 🔹 Mobile Menu Toggle */}
            <div className="lg:hidden">
              {isMobileMenuOpen ? (
                <IoMdClose onClick={() => setIsMobileMenuOpen(false)} className="w-6 h-6 text-black cursor-pointer" />
              ) : (
                <FaBars onClick={() => setIsMobileMenuOpen(true)} className="w-5 h-5 text-black cursor-pointer" />
              )}
            </div>

            {/* 🔹 Contact */}
            <div className="flex items-center text-xs gap-2 px-2 py-1 rounded-md cursor-pointer">
              <FaPhone className="w-6 h-6 text-darkBlue" />
              <p className="text-sm font-semibold truncate">(416) 635-0502</p>
            </div>

            {/* 🔹 User Account */}
            <ClerkLoaded>
              {user ? (
                <div className="flex items-center gap-2">
                  <UserButton />
                  <p className="hidden lg:block text-sm font-bold">{user.firstName ?? "User"}</p>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <div className="flex items-center text-xs gap-2 px-2 py-1 rounded-md cursor-pointer">
                    <FiUser className="w-6 h-6 text-darkBlue" />
                  </div>
                </SignInButton>
              )}
            </ClerkLoaded>

            {/* 🔹 Shopping Cart */}
            <div className="relative flex items-center justify-center h-[40px] w-[40px] p-2 rounded-md bg-white shadow-md">
              <CartIcon />
            </div>

            {/* 🔹 Orders */}
            <SignedIn>
              <Link href="/orders" className="flex items-center text-xs gap-2 px-2 py-1 rounded-md">
                <BsBasket className="text-xl text-darkBlue" />
                <p className="hidden lg:block text-sm font-semibold">{orders.length ?? 0} items</p>
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
