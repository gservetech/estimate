"use client";

import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/types/product.types";

const AddToCartWrapper = ({ product }: { product: Product }) => {
  return <AddToCartButton product={product} />;
};

export default AddToCartWrapper;
