"use client";
import React from "react";
import { LuStar } from "react-icons/lu";
import ProductCartBar from "./ProductCartBar";

import AddToCartButton from "./AddToCartButton";
import { Product } from "@/types/product.types";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useLocationStore from "@/store/locationStore";

const ProductCard = ({ product, own }: { product: Product; own: boolean }) => {
  const router = useRouter();
  const { country } = useLocationStore();
  const currency = country === "CA" ? "CAD" : "USD";

  const handleViewClick = () => {
    router.push(`/product/${product.id}`);
    // router.push(`/product?slug=${product.id}`);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden group text-sm bg-white shadow-lg p-4 transition-transform duration-300 hover:shadow-xl">
      <div className="border-b border-gray-300 overflow-hidden relative">
        {product.images.length > 0 && (
          <div className="w-full h-32 overflow-hidden flex justify-center items-center bg-gray-100">
            <div className="w-full h-full" onClick={handleViewClick}>
              <Image
                src={product.images[0]}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                alt="Product Image"
                width={300}
                height={300}
              />
            </div>
          </div>
        )}
        {product?.stock === 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-lg font-bold text-white">Out of Stock</p>
          </div>
        )}
        {product?.stock !== 0 && (
          <div className="absolute bottom-0 left-0 w-full translate-y-12 group-hover:-translate-y-4 hoverEffect">
            <ProductCartBar />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-xs font-medium">{product?.label}</p>
          <div className="text-lightText flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const isLastStar = index === 4;
              return (
                <LuStar
                  fill={!isLastStar ? "#fca99b" : "transparent"}
                  key={index}
                  className={`${
                    isLastStar ? "text-gray-500" : "text-lightOrange"
                  } w-3 h-3`}
                />
              );
            })}
          </div>
        </div>
        <p className="text-sm text-gray-800 tracking-wide font-semibold line-clamp-1 capitalize">
          {product?.name}
        </p>
        <div className="text-center">
          <p className="text-lg font-bold text-black">
            {currency}
            {product.price.toFixed(2)}
          </p>
          {product.discount && (
            <p className="text-gray-500 text-xs line-through">
              {currency}
              {(product.price + product.discount).toFixed(2)}
            </p>
          )}
          <p className="text-xs text-gray-600">
            {product?.stock ?? 0 > 0
              ? `Ships in ${product.shippingTime || 2} days`
              : "Out of Stock"}
          </p>
        </div>

        <div className="flex flex-col">
          {/* Show Add to Cart Button for Owned Products */}
          {own ? (
            <AddToCartButton product={product} />
          ) : (
            <a href={product.product_url} target="__blank">
              <button className="mt-2 bg-lightBlue text-white px-4 py-2 rounded-md flex flex-col items-center w-full hover:bg-blue-700 transition text-sm">
                Buy from
                <br />
                <span className="bg-yellow-300 text-black font-bold px-2 py-1 rounded-md">
                  {product.affiliate_provider_name || "Now"}
                </span>
              </button>

              <style jsx>{`
                button {
                  font-size: 1rem; /* Default font size */
                }

                @media (max-width: 768px) {
                  /* Adjust breakpoint as needed */
                  button {
                    font-size: 0.875rem; /* Smaller font size on smaller screens */
                  }
                }
              `}</style>
            </a>
          )}

          <Button
            onClick={handleViewClick}
            className={twMerge(
              "bg-darkBlue/10 border text-black border-green-500 w-full py-2 mt-2 rounded-md font-medium hover:bg-green-500 hover:text-white hoverEffect disabled:hover:cursor-not-allowed disabled:hover:bg-darkBlue/10 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:border-darkBlue/10"
            )}
          >
            View Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
