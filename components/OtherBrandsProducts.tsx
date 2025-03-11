"use client";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";
import { useState } from "react";

interface OtherBrandsProductsProps {
  productsNotOurs?: Product[];
}

const OtherBrandsProducts = ({
  productsNotOurs = [],
}: OtherBrandsProductsProps) => {
  const [visibleCount, setVisibleCount] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT)
  );

  return (
    <div>
      {productsNotOurs.length > 0 && (
        <div className="col-span-full text-center py-10">
          <h1 className="text-3xl text-center uppercase w-full font-bold">
            Other <span className="text-lightBlue font-bold">Brands</span>{" "}
            Products
          </h1>
        </div>
      )}

      {/* Product Grid for Other Brands */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {productsNotOurs.slice(0, visibleCount).map((item, index) => (
          <ProductCard key={`other-${index}`} product={item} own={false} />
        ))}
      </div>

      <div className="flex mt-2 items-center justify-center w-full">
        <Button
          onClick={() =>
            setVisibleCount(
              (prev) => prev + Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT)
            )
          }
          className="bg-white text-black hover:bg-neutral-300"
        >
          Load more
        </Button>
      </div>
    </div>
  );
};

export default OtherBrandsProducts;
