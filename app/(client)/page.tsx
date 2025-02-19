"use client";
import { useState, useEffect } from "react";
import AffiliateBanner from "@/components/AffliateBanner";
import Products from "@/components/Products";
import { Product } from "@/types/product.types";

interface Sale {
  _id: string;
  products: Product[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsNotOurs, setProductsNotOurs] = useState<Product[]>([]);
  const [country, setCountry] = useState<"US" | "Canada">("US"); // Default country

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const productData: Product[] = await response.json();
        const filterData = productData.filter(
          (item) => item.affiliate_provider?.name === "GServeTech"
        );
        const filterDataNotOurs = productData.filter(
          (item) => item.affiliate_provider?.name !== "GServeTech"
        );

        setProductsNotOurs(filterDataNotOurs);
        setProducts(filterData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-10 container mx-auto w-full">
      <AffiliateBanner />
      <Products
        products={products}
        productsNotOurs={productsNotOurs}
        own={true}
        country={country}
      />
    </div>
  );
}
