"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from 'axios'
const Header = () => {
  const [flag, setFlag] = useState("canada");
  const [country, setCountry] = useState('');

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get('https://ipinfo.io/json');
                const { country } = response.data;
                setCountry(country);
                console.log("data", data)
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        fetchLocation();
    }, []);
  return (
    <header className=" bg-[#ecf0f1]">
      <div className="container mx-auto">
        <div className=" border-b border-[#ffffff46]   py-3 flex items-center justify-end">
          <div className=" flex items-center  ">
            <Link
              className="text-white text-sm border-r border-[#ffffff46]  px-3"
              href={"/about-us"}
            >
              About Us
            </Link>
            <div className="flex items-center gap-1  border-r border-[#ffffff46]  px-3">
              <img
                className="w-6 h-4"
                src={flag === "canada" ? "/cf.png" : "us.png"}
                alt=""
              />
              {country}
              <select
                onChange={(e) => setFlag(e.target.value)}
                name=""
                className=" border-none bg-transparent text-white text-sm"
                id=""
              >
                <option value="canada" className="text-black">
                  Canada
                </option>
                <option value="usa" className="text-black">
                  USA
                </option>
              </select>
            </div>
            <div className="flex items-center gap-1  px-3">
              <p className="text-white">$</p>
              <select
                name=""
                className=" border-none bg-transparent text-white text-sm"
                id=""
              >
                <option value="cad" className="text-black">
                  CAD
                </option>
                <option value="usd" className="text-black">
                  USD
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className=" py-3">
          <img src="/gserve2.jpg" className="w-[100px]" alt="" />
        </div>
        <div className="category-container pt-2">
          <div className="category">
            <div className="text">Grocery Stores</div>
          </div>
          <div className="category">
            <div className="text">Clothing Stores</div>
          </div>
          <div className="category">
            <div className="text">Electronics Stores</div>
          </div>
          <div className="category">
            <div className="text">Home Improvement Stores</div>
          </div>
          <div className="category">
            <div className="text">Pharmacies</div>
          </div>
          <div className="category">
            <div className="text">Department Stores</div>
          </div>
          <div className="category">
            <div className="text">Specialty Stores</div>
          </div>
          <div className="category">
            <div className="text">Furniture Stores</div>
          </div>
          <div className="category">
            <div className="text">Sporting Goods Stores</div>
          </div>
          <div className="category">
            <div className="text">Discount Stores</div>
          </div>
          <div className="category">
            <div className="text">Automotive Stores</div>
          </div>
          <div className="category">
            <div className="text">Bookstores</div>
          </div>
          <div className="category">
            <div className="text">Toy Stores</div>
          </div>
          <div className="category">
            <div className="text">Jewelry Stores</div>
          </div>
          <div className="category">
            <div className="text">Office Supply Stores</div>
          </div>
          <div className="category">
            <div className="text">Pet Stores</div>
          </div>
          <div className="category">
            <div className="text">Beauty Stores</div>
          </div>
          <div className="category">
            <div className="text">Gourmet Food Stores</div>
          </div>
          <div className="category">
            <div className="text">Convenience Stores</div>
          </div>
          <div className="category">
            <div className="text">Thrift Stores</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
