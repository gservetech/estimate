import { Product } from "@/types/product.types";
import Image from "next/image";
import React from "react";
import { LuStar } from "react-icons/lu";
import Link from "next/link";

// Component Props
interface AmazonCardProps {
  product: Product;
}

const AmazonCard: React.FC<AmazonCardProps> = ({ product }) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden group text-sm">
      {/* Product Image */}
      <div className="border-b border-b-gray-300 overflow-hidden relative">
        {product?.images?.[0] ? (
          <Link href={product.product_url || ""}>
            <Image
              src={product.images[0]}
              alt={product.name || "Product Image"}
              width={500}
              height={500}
              loading="lazy"
              className="w-full h-auto max-h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ) : null}

        {/* Discount Badge */}
        {(product.discount ?? 0) > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {product.discount ?? 0}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col gap-2">
        {/* Product Title */}
        <p className="text-base text-gray-800 tracking-wide font-semibold line-clamp-1 capitalize">
          {product.name}
        </p>

        {/* Discount Info */}
        {(product.discount ?? 0) > 0 && (
          <p className="text-xs text-gray-500 font-light">{product.discount}</p>
        )}

        {/* Star Rating */}
        <div className="text-lightText flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <LuStar
              key={index}
              fill={
                index < Math.round((product.discount ?? 0) / 20)
                  ? "#fca99b"
                  : "transparent"
              }
              className={`${
                index < Math.round((product.discount ?? 0) / 20)
                  ? "text-lightOrange"
                  : "text-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description?.[0] ?? "No description available"}
        </p>

        <Link
          href={product.product_url || ""}
          className="bg-red-500 text-white font-bold text-lg py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mt-4"
        >
          {product.discount ?? 0} ON Amazon
        </Link>
      </div>
    </div>
  );
};

export default AmazonCard;
