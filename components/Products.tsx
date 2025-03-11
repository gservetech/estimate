import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product.types";
import CanadaEcommerceLink from "@/components/CanadaEcommerceLink";
import USEcommerceLink from "@/components/USEcommerceLink";
import OtherBrandsProducts from "@/components/OtherBrandsProducts";

interface ProductsProps {
  products: Product[];
  productsNotOurs?: Product[]; // Optional, since some calls might not include it
  own: boolean;
  country: "US" | "CA"; // Updated to match locationStore type
}

const Products: React.FC<ProductsProps> = ({
  products,
  productsNotOurs = [],
  own,
  // country,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 items-start">
      {/* Left Sidebar - Canada Ecommerce Links */}
      <div className="hidden lg:flex flex-col justify-start w-full">
        <CanadaEcommerceLink own={own} />
      </div>

      {/* Product Grid */}
      <div className="lg:col-span-8">
        {/* "Our Products" Section Title Wrapped in AliExpress Background */}
        {products.length > 0 && (
          <div
            className="col-span-full text-center bg-cover bg-center py-6"
            style={{
              backgroundImage: `url('https://ae01.alicdn.com/kf/Sd4b8b26b77d94bd891e89a8665e4b5e47/2424x917.png')`,
            }}
          >
            <h1 className="text-3xl text-center uppercase w-full font-bold text-white">
              <span className="text-yellow-400 font-bold">Our</span> Products
            </h1>
          </div>
        )}

        {/* Product Grid for Our Products */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 px-6 pb-6"
          style={{
            backgroundImage: `url('https://ae01.alicdn.com/kf/Sd4b8b26b77d94bd891e89a8665e4b5e47/2424x917.png')`,
          }}
        >
          {products.map((item, index) => (
            <ProductCard key={index} product={item} own={true} />
          ))}
        </div>

        {/* Another Brands Products Section:
                    Extracted into its own component to ensure the parent component remains a server component
                */}
        <OtherBrandsProducts productsNotOurs={productsNotOurs} />
      </div>

      {/* Right Sidebar - US Ecommerce Links */}
      <div className="hidden lg:flex flex-col justify-start w-full">
        <USEcommerceLink own={own} />
      </div>
    </div>
  );
};

export default Products;
