import React from "react";
import AmazonGrid from "./AmazonGrid";
import { Product } from "@/types/product.types";


// TypeScript Props for AmazonList
interface Props {
  products: Product[]; // List of products to display
  title?: boolean; // Optional flag to display the title section
}

const AmazonList: React.FC<Props> = ({ products, title }: Props) => {
  // Log products to the console
 

  return (
    <div>
      {/* Conditionally render title section */}
      {title && (
        <div className="pb-5">
          <h2 className="text-2xl font-semibold text-gray-600">
            Day of the <span className="text-lightBlue">Deal</span>
          </h2>
          <p className="text-sm text-gray-500 font-thin">
            Don&rsquo;t wait. The time will never be just right.
          </p>
        </div>
      )}

      {/* Render AmazonGrid component */}
      <AmazonGrid products={products} />
    </div>
  );
};

export default AmazonList;
