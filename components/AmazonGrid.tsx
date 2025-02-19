"use client";

import { motion, AnimatePresence } from "framer-motion";
import AmazonCard from "./AmazonCard";
import { Product } from "@/types/product.types";

/* // Sale interface
export interface Sale {
  _id: string; // Unique identifier
  badge: string; // Badge text or label
  discountAmount: number; // Discount amount in currency
  title: string; // Product title
  description: string | string[]; // Product description
  couponCode: string; // Coupon code for the sale
  image?: string; // Optional single image URL
  asin: string; // Amazon Standard Identification Number
  deal_id: string; // Deal ID
  discountPercentage: number; // Discount percentage
  discountInfo: string; // Additional discount details
  productLink: string; // URL to the product page
  imageSources: string[]; // Array of image URLs
} */

// Props interface for AmazonGrid
interface Props {
  products: Product[]; // Array of Sale objects
}

const AmazonGrid: React.FC<Props> = ({ products }: Props) => {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products?.map((product) => (
        <AnimatePresence key={product.id}>
          <motion.div
            layout
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={product.id} // Ensure unique key for React reconciliation
          >
            <AmazonCard product={product} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
};

export default AmazonGrid;
