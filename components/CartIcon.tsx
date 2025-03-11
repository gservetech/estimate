"use client";
import useCartStore from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";

const CartIcon = () => {
  const [isClient, setIsClient] = useState(false);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <Link
      href={"/cart"}
      className="flex items-center text-sm gap-2  border-gray-200 px-2 py-1 rounded-md "
    >
      <MdOutlineShoppingCart className="w-7 h-7 text-darkBlue" />
      <div className="flex flex-col">
        <p className="font-semibold text-sm">CART</p>
        <p>${parseFloat(totalPrice.toFixed(2)) || 0}</p>
      </div>
    </Link>
  );
};

export default CartIcon;
