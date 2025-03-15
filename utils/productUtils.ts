import { Product } from "@/types/product.types";

export async function fetchProducts(): Promise<{
  ourProducts: Product[];
  otherProducts: Product[];
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const productData: Product[] = await response.json();

    const ourProducts = productData.filter(
      (item) => item.affiliate_provider_name === "GServeTech"
    );

    const otherProducts = productData.filter(
      (item) => item.affiliate_provider_name !== "GServeTech"
    );

    return { ourProducts, otherProducts };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { ourProducts: [], otherProducts: [] };
  }
}

fetchProducts();
