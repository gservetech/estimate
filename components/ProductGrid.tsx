import React from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product.types";

interface Props {
  products: Product[];
  ownProducts?: number[]; // Optional: List of product IDs the user owns
}

const ProductGrid = ({ products, ownProducts = [] }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products?.map((product) => {
        const own = ownProducts.includes(product.id); // Determine ownership

        return (
          <AnimatePresence key={product.id}>
            <motion.div
              layout
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductCard key={product.id} product={product} own={own} />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
};

export default ProductGrid;
