"use client";
import useCartStore from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";

const CartIcon = () => {
  const [isClient, setIsClient] = useState(false);
  const groupedItems = useCartStore((state) => state.getGroupedItems());
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
        <p >
          {/* <span className="font-semibold">
            {groupedItems?.length ? groupedItems.length : 0}
          </span>
          items */}
          $199.08
        </p>
   
      </div>
    </Link>
  );
};

export default CartIcon;
