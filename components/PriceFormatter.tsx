"use client";

import useLocationStore from "@/store/locationStore";
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  const { country } = useLocationStore();

  const currency = country === "CA" ? "CAD" : "USD";
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    currency: currency,
    style: "currency",
    minimumFractionDigits: 2,
  });
  return (
    <span className={twMerge("text-sm font-semibold text-darkText", className)}>
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
