import useLocationStore from "@/store/locationStore";
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
  raw?: boolean; // ✅ New prop to return only plain text
}

const PriceFormatter = ({ amount, className, raw }: Props) => {
  const { country } = useLocationStore();

  const currency = country === "CA" ? "CAD" : "USD";
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    currency: currency,
    style: "currency",
    minimumFractionDigits: 2,
  });

  // ✅ Return only the formatted text if `raw` is true
  if (raw) return formattedPrice;

  return (
    <span className={twMerge("text-sm font-semibold text-darkText", className)}>
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
