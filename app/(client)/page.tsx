"use client";
import { createUser } from "@/actions/createUser";
import AffiliateBanner from "@/components/AffliateBanner";
import Products from "@/components/Products";
import useLocationStore from "@/store/locationStore";
import { Product } from "@/types/product.types";
import { fetchProducts } from "@/utils/productUtils";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsNotOurs, setProductsNotOurs] = useState<Product[]>([]);
  const { country } = useLocationStore();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const loadProducts = async () => {
      const { ourProducts, otherProducts } = await fetchProducts();
      setProducts(ourProducts);
      setProductsNotOurs(otherProducts);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const handleUserCreation = async () => {
      if (isLoaded && user && user.primaryEmailAddress?.emailAddress) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
          const userEmail = user.primaryEmailAddress.emailAddress;

          try {
            const userExistsResponse = await fetch(
              `${baseUrl}/api/users/${user.id}`
            );

            if (userExistsResponse.ok) {
              const existingUser = await userExistsResponse.json();
              console.log("Existing user found:", existingUser);
              return;
            }

            const userData = {
              clerkId: user.id,
              email: userEmail,
              fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
              profileImageUrl: user.imageUrl,
              phone: user.phoneNumbers[0]?.phoneNumber || "",
              firstname: user.firstName || "",
              lastname: user.lastName || "",
              middlename: "",
              addresses: [],
            };

            const result = await createUser(userData);
            if (result.success) {
              console.log("User created successfully:", result.data);
            } else {
              console.error("Error creating user:", result.error);
            }
          } catch (apiError) {
            console.error("API Error:", apiError);
            // If the API call fails, attempt to create the user
            const userData = {
              clerkId: user.id,
              email: userEmail,
              fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
              profileImageUrl: user.imageUrl,
              phone: user.phoneNumbers[0]?.phoneNumber || "",
              firstname: user.firstName || "",
              lastname: user.lastName || "",
              middlename: "",
              addresses: [],
            };

            const result = await createUser(userData);
            if (result.success) {
              console.log(
                "User created successfully after API error:",
                result.data
              );
            } else {
              console.error(
                "Error creating user after API error:",
                result.error
              );
            }
          }
        } catch (error) {
          console.error(
            "Error in user creation process:",
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }
    };

    handleUserCreation();
  }, [user, isLoaded]);

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
