import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiExternalLink, FiShare2 } from "react-icons/fi";
import { LuStar } from "react-icons/lu";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";

import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import PriceView from "@/components/PriceView";
import ProductImageCard from "@/components/ProductImageCard";
import { SingleProduct } from "@/types/product.types";

// Define the correct type for async params
interface Props {
  params: Promise<{ id: string }>;
}

// --- Data Fetching Function ---
async function getProduct(id: string): Promise<SingleProduct | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// --- Generate Metadata ---
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.gservetech.com";
  const defaultImageUrl = `${siteBaseUrl}/default-product-image.jpg`;

  if (!product) {
    return {
      title: "Product Not Found - GserveTech",
      description: "The product you are looking for could not be found.",
      openGraph: {
        title: "Product Not Found - GserveTech",
        description: "The product you are looking for could not be found.",
        images: [defaultImageUrl],
      },
    };
  }

  const pageTitle = `${product.name} - GserveTech`;
  const description = Array.isArray(product.description)
    ? product.description.join(". ")
    : product.description || "High-quality product available on GserveTech";

  const imageUrl = product.images?.[0]?.startsWith("http")
    ? product.images[0]
    : `${siteBaseUrl}${product.images?.[0] || defaultImageUrl}`;

  return {
    title: pageTitle,
    description: description,
    openGraph: {
      title: pageTitle,
      description: description,
      url: `${siteBaseUrl}/product/${id}`,
      siteName: "GserveTech",
      images: [{ url: imageUrl, alt: product.name }],
      locale: "en_US",
      type: "website",
    },
  };
}

// --- Product Page Component ---
const ProductPage = async ({ params }: Props) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const isOurProduct = product.affiliate_provider?.name === "GServeTech";

  const renderActionButton = () => {
    if (isOurProduct) {
      return <AddToCartButton product={product} />;
    }

    return (
      <a
        href={product.product_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-all duration-200"
      >
        Buy from {product.affiliate_provider?.name}
        <FiExternalLink className="text-lg" />
      </a>
    );
  };

  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {/* Product Images */}
      {product.images && product.images.length > 0 && (
        <ProductImageCard images={product.images} />
      )}

      {/* Product Details */}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

        <PriceView
          price={product.price}
          discount={product.discount}
          label={product.label}
          className="text-lg font-bold"
        />

        {product.stock && (
          <p className="bg-green-100 w-24 text-center text-green-600 text-sm py-2.5 font-semibold rounded-lg">
            In Stock
          </p>
        )}

        <div className="text-base text-gray-800 space-y-2">
          {Array.isArray(product.description) ? (
            product.description.map((item, index) => <p key={index}>{item}</p>)
          ) : (
            <p>{product.description}</p>
          )}
        </div>

        {renderActionButton()}

        <div className="flex gap-4 mt-4">
          <button className="flex items-center gap-2 text-blue-600 hover:underline">
            <FiShare2 /> Share
          </button>
          <button className="flex items-center gap-2 text-gray-600">
            <TbTruckDelivery /> Fast Delivery Available
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ProductPage;
