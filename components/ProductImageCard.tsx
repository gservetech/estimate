"use client";

import Image from "next/image";
import React, { useState } from "react";

interface ProductImageCardProps {
  images: string[];
}

const ProductImageCard = ({ images }: ProductImageCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full flex flex-col gap-8 md:w-1/2 h-auto border border-darkBlue/20 shadow-md rounded-md group overflow-hidden">
      <div>
        {!imageError ? (
          <Image
            src={images?.[currentImage] || "/fallback-image.jpg"}
            alt="productImage"
            width={700}
            height={700}
            className="w-full h-auto max-h-[550px] object-cover group-hover:scale-110 hoverEffect rounded-md"
            onError={handleImageError}
            priority
          />
        ) : (
          <div className="w-full h-[550px] bg-gray-200 flex items-center justify-center">
            Image not available
          </div>
        )}
      </div>

      <div className="flex items-start gap-2">
        {images?.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setCurrentImage(index)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-auto object-cover"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageCard;
