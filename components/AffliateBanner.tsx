"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import AffiliateProductDetail from "./AffliateProductDetail";

export interface Sale {
  _id: string;
  badge: string;
  discountAmount: number;
  title: string;
  description: string | string[];
  couponCode: string;
  image?: string;
  asin: string;
  deal_id: string;
  discountPercentage: number;
  discountInfo: string;
  productLink: string;
  imageSources: string[];
}

const AffiliateBanner = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Sale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("/sales.json");
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const data: Sale[] = await response.json();
        setSales(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSales();
  }, []);

  const openModal = (product: Sale) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 🔹 Wrapped Carousel with Proper Spacing & Centering */}
      <div className="relative w-full max-w-screen-xl mx-auto px-8 md:px-12">
        <Carousel className="relative">
          <CarouselContent>
            {sales.map((sale) => (
              <CarouselItem key={sale.asin} className="relative">
                <a
                  href={sale.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="overflow-hidden min-h-[200px] md:min-h-[180px] flex flex-col md:flex-row justify-between items-center p-4 shadow-md">
                    <CardContent className="p-0 flex-1">
                      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        {/* Text Content - Properly Aligned */}
                        <div className="flex-1 text-center md:text-left">
                          <Badge
                            variant="secondary"
                            className="mb-2 md:mb-3 text-darkBlue capitalize text-xs md:text-sm"
                          >
                            {sale.badge} {sale.discountPercentage}% off
                          </Badge>

                          <h2 className="text-sm md:text-base font-bold tracking-tight mb-3">
                            {sale.title}
                          </h2>

                          <p className="text-xs md:text-sm text-gray-600 leading-tight line-clamp-2">
                            {typeof sale.description === "string"
                              ? sale.description
                              : sale.description.join(" ")}
                          </p>

                          <button
                            onClick={() =>
                              window.open(sale.productLink, "_blank")
                            }
                            className="mt-3 px-3 py-2 bg-blue-500 text-white text-xs md:text-sm font-bold rounded hover:bg-blue-600 transition"
                          >
                            ON AMAZON {sale.discountPercentage}% OFF
                          </button>
                        </div>

                        {/* Image Section - Ensured Proper Scaling & Alignment */}
                        {sale.imageSources && sale.imageSources.length > 0 && (
                          <div className="w-full md:w-1/3 flex items-center justify-center">
                            <Image
                              src={sale.imageSources[0]}
                              alt={sale.title}
                              width={160}
                              height={100}
                              priority
                              className="object-contain aspect-square transition-transform duration-300 ease-in-out hover:scale-105"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 🔹 Adjusted Arrows to Prevent Overlapping */}
          <CarouselPrevious className="absolute top-1/2 -left-10 transform -translate-y-1/2 text-white text-lg md:text-xl bg-blue-800 hover:bg-blue-900 rounded-full p-2 md:p-3 shadow-lg z-20" />
          <CarouselNext className="absolute top-1/2 -right-10 transform -translate-y-1/2 text-white text-lg md:text-xl bg-blue-800 hover:bg-blue-900 rounded-full p-2 md:p-3 shadow-lg z-20" />
        </Carousel>
      </div>

      {/* Modal for Product Detail */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6">
            <AffiliateProductDetail
              product={selectedProduct}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AffiliateBanner;
